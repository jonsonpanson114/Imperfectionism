'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

export default function SetupPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    setLoading(true);

    // 設定を保存
    storage.updateSettings({
      birthDate,
      name: name || undefined,
    });

    // メインページへ遷移
    setTimeout(() => {
      router.push('/');
      setLoading(false);
    }, 500);
  };

  const calculateWeeksLeft = (dateString: string) => {
    const birth = new Date(dateString);
    const now = new Date();
    const eightyYears = new Date(birth);
    eightyYears.setFullYear(birth.getFullYear() + 80);

    const weeksLeft = Math.max(0, Math.floor((eightyYears.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
    return weeksLeft;
  };

  const weeksLeft = birthDate ? calculateWeeksLeft(birthDate) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-stone-800 mb-2">
              Imperfectionism
            </h1>
            <p className="text-stone-500 text-sm">
              不完全主義を受け入れる
            </p>
          </div>

          {weeksLeft !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <div className="text-6xl font-light text-stone-300 mb-2">
                {weeksLeft.toLocaleString()}
              </div>
              <div className="text-stone-500 text-sm">
                残り週間
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-stone-600 text-sm mb-2">
                誕生日
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 text-sm mb-2">
                名前（任意）
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="あなたの名前"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 text-stone-800"
              />
            </div>

            <button
              type="submit"
              disabled={!birthDate || loading}
              className="w-full py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '設定中...' : 'はじめる'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-400">
            人生は4000週間しかありません。<br />
            全部はできないと受け入れましょう。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
