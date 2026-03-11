'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { useChoices, useDailyProgress } from '@/lib/storage/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DailyProgress } from '@/components/progress/DailyProgress';

const TODAY = new Date().toISOString().split('T')[0];

export default function ChoicePage() {
  const choices = useChoices(TODAY);
  const dailyProgress = useDailyProgress(TODAY);
  const [inputs, setInputs] = useState({
    todo: '',
    notodo: '',
    accept: '',
  });

  const todoItems = choices.filter(c => c.type === 'todo');
  const notodoItems = choices.filter(c => c.type === 'notodo');
  const acceptItems = choices.filter(c => c.type === 'accept');
  const hasAnyChoice = choices.length > 0;

  const handleAdd = (type: 'todo' | 'notodo' | 'accept') => {
    const content = inputs[type].trim();
    if (!content) return;

    // やることは最大3個まで
    if (type === 'todo' && todoItems.length >= 3) {
      alert('やることは最大3個までです');
      return;
    }

    storage.addChoice({
      date: TODAY,
      type,
      content,
      completed: false,
    });

    setInputs({ ...inputs, [type]: '' });

    // 初めての選択を追加したら進捗を更新
    if (!hasAnyChoice && choices.length === 0) {
      storage.updateDailyProgress(TODAY, { step2Completed: true, currentStep: 3 });
    }
  };

  const handleToggleComplete = (id: string) => {
    const choice = choices.find(c => c.id === id);
    if (choice) {
      storage.updateChoice(id, { completed: !choice.completed });
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteChoice(id);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-medium text-stone-800 mb-2">今日の3つの選択</h1>
        <p className="text-stone-500">
          やること・やらないこと・受け入れることを決めましょう
        </p>
      </motion.div>

      {/* ステップ表示 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DailyProgress progress={dailyProgress} currentStep={2} />
      </motion.div>

      {/* やること */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          やると決めたこと（最大3個）
        </h2>

        <div className="space-y-3 mb-4">
          {todoItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 flex items-center gap-3 bg-white border ${
                item.completed ? 'border-green-200 bg-green-50/50' : 'border-stone-100'
              }`}
            >
              <button
                onClick={() => handleToggleComplete(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.completed
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-stone-300 hover:border-stone-400'
                }`}
              >
                {item.completed && <span>✓</span>}
              </button>
              <span className={`flex-1 ${item.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                {item.content}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputs.todo}
            onChange={(e) => setInputs({ ...inputs, todo: e.target.value })}
            placeholder="やることを入力..."
            className="flex-1 min-h-[80px] bg-white border-stone-200 focus:ring-stone-300"
            disabled={todoItems.length >= 3}
          />
          <Button
            onClick={() => handleAdd('todo')}
            disabled={todoItems.length >= 3}
            className="bg-green-600 hover:bg-green-700"
          >
            追加
          </Button>
        </div>
        <p className="text-xs text-stone-400 mt-1">
          {todoItems.length}/3 個
        </p>
      </motion.div>

      {/* やらないこと */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4 flex items-center gap-2">
          <span className="text-red-600">✕</span>
          やらないと決めたこと（Not-To-Do）
        </h2>

        <div className="space-y-3 mb-4">
          {notodoItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex items-center gap-3 bg-white border-stone-100"
            >
              <span className="text-red-400">✕</span>
              <span className="flex-1 text-stone-700">{item.content}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-stone-400 hover:text-stone-600"
              >
                削除
              </button>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputs.notodo}
            onChange={(e) => setInputs({ ...inputs, notodo: e.target.value })}
            placeholder="今日、やらないと決めること..."
            className="flex-1 min-h-[80px] bg-white border-stone-200 focus:ring-stone-300"
          />
          <Button
            onClick={() => handleAdd('notodo')}
            className="bg-stone-800 hover:bg-stone-700"
          >
            追加
          </Button>
        </div>
      </motion.div>

      {/* 受け入れること */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4 flex items-center gap-2">
          <span className="text-blue-600">◎</span>
          受け入れること
        </h2>

        <div className="space-y-3 mb-4">
          {acceptItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex items-center gap-3 bg-white border-stone-100"
            >
              <span className="text-blue-400">◎</span>
              <span className="flex-1 text-stone-700">{item.content}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-stone-400 hover:text-stone-600"
              >
                削除
              </button>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputs.accept}
            onChange={(e) => setInputs({ ...inputs, accept: e.target.value })}
            placeholder="今日、どうしても変わらないこと..."
            className="flex-1 min-h-[80px] bg-white border-stone-200 focus:ring-stone-300"
          />
          <Button
            onClick={() => handleAdd('accept')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            追加
          </Button>
        </div>
      </motion.div>

      {/* 次へボタン */}
      {hasAnyChoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/done">
            <Button className="w-full bg-stone-800 hover:bg-stone-700">
              次へ：達成 →
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
