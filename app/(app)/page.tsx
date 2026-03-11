'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { useDailyState, useOpenListItems, useWeeklyDones, useDailyProgress } from '@/lib/storage/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DailyProgress } from '@/components/progress/DailyProgress';

const MOODS = [
  { value: 'normal' as const, label: '😊 普通', description: 'いつも通り' },
  { value: 'anxious' as const, label: '😰 焦ってる', description: '少し不安' },
  { value: 'tired' as const, label: '😫 疲れてる', description: '疲れを感じる' },
  { value: 'confused' as const, label: '🤔 迷ってる', description: '方向性を探る' },
  { value: 'calm' as const, label: '😌 落ち着いてる', description: '今が心地よい' },
];

const TODAY = new Date().toISOString().split('T')[0];

export default function HomePage() {
  const router = useRouter();
  const dailyState = useDailyState(TODAY);
  const openItems = useOpenListItems();
  const weeklyDones = useWeeklyDones(TODAY);
  const dailyProgress = useDailyProgress(TODAY);

  const [newIdea, setNewIdea] = useState('');

  const handleMoodSelect = (mood: typeof MOODS[number]['value']) => {
    storage.updateDailyState(TODAY, { mood });
    storage.updateDailyProgress(TODAY, { step1Completed: true, currentStep: 2 });
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    storage.addOpenListItem({ content: newIdea.trim() });
    setNewIdea('');
  };

  const handleArchiveIdea = (id: string) => {
    storage.archiveOpenListItem(id);
  };

  const handleDeleteIdea = (id: string) => {
    storage.deleteOpenListItem(id);
  };

  const weekStart = new Date(TODAY);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 日曜始まり

  return (
    <div className="space-y-8">
      {/* イントロダクション */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-stone-800 text-stone-100 p-6 rounded-2xl shadow-lg relative overflow-hidden group"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-medium mb-2 flex items-center gap-2">
             不完全主義へようこそ
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed mb-4">
            ここは「全部できない」ことを受け入れるための場所です。脳内のノイズを書き出し、
            今日選んだ3つだけを、不完全なまま進めてみましょう。
          </p>
          <Link href="/philosophy">
            <Button variant="secondary" size="sm" className="bg-stone-700 hover:bg-stone-600 border-none text-stone-200">
              心得を読む →
            </Button>
          </Link>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-stone-700/30 rounded-full blur-3xl group-hover:bg-stone-600/40 transition-colors" />
      </motion.div>

      {/* ステップ表示 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DailyProgress progress={dailyProgress} currentStep={1} />
      </motion.div>

      {/* 気分選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">今日の気分</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                dailyState?.mood === mood.value
                  ? 'border-stone-400 bg-stone-100'
                  : 'border-stone-100 hover:border-stone-200 bg-white'
              }`}
            >
              <span className="text-2xl mb-1">{mood.label.split(' ')[0]}</span>
              <span className="text-xs text-stone-500">{mood.description}</span>
            </button>
          ))}
        </div>

        {/* 次へボタン */}
        {dailyState?.mood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <Link href="/choice">
              <Button className="w-full bg-stone-800 hover:bg-stone-700">
                次へ：選択 →
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* 開放式リスト */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          思いついたことは全部書いてください
        </h2>

        <form onSubmit={handleAddIdea} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="アイデアやタスク..."
            className="flex-1 px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-800"
          />
          <Button
            type="submit"
            className="bg-stone-800 hover:bg-stone-700"
          >
            追加
          </Button>
        </form>

        <div className="space-y-2">
          {openItems.map((item) => (
            <Card key={item.id} className="p-4 flex items-center gap-3 bg-white border-stone-100">
              <span className="text-stone-400">•</span>
              <span className="flex-1 text-stone-700">{item.content}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleArchiveIdea(item.id)}
                  className="text-sm text-stone-400 hover:text-stone-600"
                  title="アーカイブ"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleDeleteIdea(item.id)}
                  className="text-sm text-stone-400 hover:text-stone-600"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            </Card>
          ))}
          {openItems.length === 0 && (
            <p className="text-center text-stone-400 py-8">
              まだアイデアがありません
            </p>
          )}
        </div>
      </motion.div>

      {/* 週間プログレス */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">今週の進捗</h2>
        <Card className="p-6 bg-white border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-600">やったこと</span>
            <span className="text-2xl font-light text-stone-800">{weeklyDones.length}</span>
          </div>
          <Progress value={Math.min(100, weeklyDones.length * 10)} className="h-2" />
          <p className="text-xs text-stone-400 mt-2 text-center">
            目標はありません。やったことを積み重ねましょう。
          </p>
        </Card>
      </motion.div>

      {/* 今日の名言 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 border-stone-200 text-center">
          <p className="text-stone-600 italic">
            「全部はできないと受け入れましょう」
          </p>
          <p className="text-xs text-stone-400 mt-2">— オリバー・バークマン</p>
        </Card>
      </motion.div>
    </div>
  );
}
