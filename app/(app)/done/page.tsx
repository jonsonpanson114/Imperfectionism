'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { useDones, useWeeklyDones, useDailyProgress } from '@/lib/storage/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DailyProgress } from '@/components/progress/DailyProgress';
import { CheckCircle } from 'lucide-react';

const TODAY = new Date().toISOString().split('T')[0];

export default function DonePage() {
  const dones = useDones(TODAY);
  const weeklyDones = useWeeklyDones(TODAY);
  const dailyProgress = useDailyProgress(TODAY);
  const [input, setInput] = useState('');
  const [feeling, setFeeling] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const handleAdd = () => {
    const content = input.trim();
    if (!content) return;

    storage.addDone({
      date: TODAY,
      content,
      feeling: feeling.trim() || undefined,
    });

    setInput('');
    setFeeling('');

    // 初めての達成を記録したら進捗を更新
    if (dones.length === 0) {
      storage.updateDailyProgress(TODAY, { step3Completed: true, currentStep: 3 });
      setShowCompletion(true);
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteDone(id);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-medium text-stone-800 mb-2">不完全な達成</h1>
        <p className="text-stone-500 mb-6">
          やったことを記録しましょう。完全でなくていいのです。
        </p>
        <Card className="p-4 bg-stone-50 border-stone-200 text-sm text-stone-600 space-y-2">
          <p><strong>完了（Done）ではなく進捗（Progress）:</strong> 「本を1冊読んだ」ではなく「1ページだけ読んだ」で十分です。不完全なまま進んだ自分を認めましょう。</p>
          <p><strong>具体例:</strong> 「メールを1通返した」「パソコンを開いた」「散歩した」...どんなに些細なことでも、あなたの「一歩」です。</p>
        </Card>
      </motion.div>

      {/* ステップ表示 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DailyProgress progress={dailyProgress} currentStep={3} />
      </motion.div>

      {/* 完了メッセージ */}
      {showCompletion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-medium text-green-800">今日のフロー完了！</h3>
                <p className="text-green-700 text-sm mt-1">
                  今日の気分、選択、達成を記録しました。
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 追加フォーム */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white border-stone-100">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="やったことを入力..."
            className="min-h-[100px] mb-4 bg-stone-50 border-stone-200 focus:ring-stone-300"
          />
          <Textarea
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="どう感じたか？（任意）"
            className="min-h-[60px] mb-4 bg-stone-50 border-stone-200 focus:ring-stone-300"
          />
          <Button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="w-full bg-stone-800 hover:bg-stone-700"
          >
            記録する
          </Button>
        </Card>
      </motion.div>

      {/* 今日のやったこと */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          今日のやったこと（{dones.length}件）
        </h2>
        <div className="space-y-3">
          {dones.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="p-4 bg-white border-stone-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-stone-700">{item.content}</p>
                    {item.feeling && (
                      <p className="text-sm text-stone-500 mt-2">「{item.feeling}」</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
          {dones.length === 0 && (
            <Card className="p-8 text-center bg-white border-stone-100">
              <p className="text-stone-400">
                まだ記録していません。小さなことでも大丈夫です。
              </p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* 週間サマリー */}
      {weeklyDones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium text-stone-700 mb-4">
            今週の積み重ね（{weeklyDones.length}件）
          </h2>
          <Card className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 border-stone-200">
            <div className="space-y-2">
              {weeklyDones.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-stone-600">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm truncate">{item.content}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center">
              週間やったことは「やれなかったこと」ではなく、「やったこと」にフォーカスしています。
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
