'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { useStillMoments } from '@/lib/storage/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const TODAY = new Date().toISOString().split('T')[0];

const DURATIONS = [
  { minutes: 5, label: '5分' },
  { minutes: 10, label: '10分' },
  { minutes: 15, label: '15分' },
  { minutes: 30, label: '30分' },
];

export default function StillPage() {
  const stillMoments = useStillMoments(TODAY);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // 自動的に記録
            storage.addStillMoment({
              date: TODAY,
              durationMinutes: selectedDuration!,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, selectedDuration]);

  const handleStart = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelectedDuration(null);
  };

  const handleCompleteEarly = () => {
    if (!selectedDuration) return;
    const elapsed = selectedDuration * 60 - timeLeft;
    const duration = Math.ceil(elapsed / 60);

    storage.addStillMoment({
      date: TODAY,
      durationMinutes: duration,
      note: note.trim() || undefined,
    });

    setIsRunning(false);
    setTimeLeft(0);
    setSelectedDuration(null);
    setNote('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalMinutes = stillMoments.reduce((sum, m) => sum + m.durationMinutes, 0);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-medium text-stone-800">無為</h1>
          <Badge variant="as-needed">必要時</Badge>
        </div>
        <p className="text-stone-500">
          何もしない時間を大切にしましょう。
        </p>
      </motion.div>

      {/* タイマー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 bg-white border-stone-100">
          <div className="text-center">
            {!isRunning && timeLeft === 0 ? (
              <>
                <p className="text-stone-500 mb-6">時間を選んでください</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {DURATIONS.map((duration) => (
                    <button
                      key={duration.minutes}
                      onClick={() => handleStart(duration.minutes)}
                      className="py-4 px-6 rounded-xl border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all text-stone-700 font-medium"
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="text-7xl md:text-8xl font-light text-stone-300 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  {isRunning ? (
                    <p className="text-stone-400">何もしない...</p>
                  ) : (
                    <p className="text-stone-400">一時停止中</p>
                  )}
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-stone-300 hover:bg-stone-50"
                  >
                    {isRunning ? '一時停止' : '再開'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-stone-300 hover:bg-stone-50"
                  >
                    リセット
                  </Button>
                </div>

                {timeLeft > 0 && (
                  <div className="mb-6">
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="タイマー終了後の気づきを記録..."
                      className="min-h-[80px] bg-stone-50 border-stone-200 focus:ring-stone-300 text-sm"
                    />
                  </div>
                )}

                {timeLeft < selectedDuration! * 60 && (
                  <Button
                    onClick={handleCompleteEarly}
                    className="bg-stone-800 hover:bg-stone-700"
                  >
                    終了して記録
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      </motion.div>

      {/* 本日の無為 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          今日の無為（{totalMinutes}分）
        </h2>
        <div className="space-y-3">
          {stillMoments.map((moment) => (
            <Card key={moment.id} className="p-4 bg-white border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-700">{moment.durationMinutes}分の無為</p>
                  {moment.note && (
                    <p className="text-sm text-stone-500 mt-1">「{moment.note}」</p>
                  )}
                </div>
                <span className="text-stone-400">
                  {new Date(moment.createdAt).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </Card>
          ))}
          {stillMoments.length === 0 && (
            <Card className="p-8 text-center bg-white border-stone-100">
              <p className="text-stone-400">
                今日はまだ無為の時間がありません。
              </p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* 無為の意味 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <p className="text-stone-600 text-center">
            何もしないことは、何かをすることと同じくらい大切です。<br />
            焦りが消え、自分の内側に戻る時間を持ちましょう。
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
