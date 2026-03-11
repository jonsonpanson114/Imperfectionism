'use client';

import { motion } from 'framer-motion';
import { PhilosophyGuide } from '@/components/guide/PhilosophyGuide';

export default function PhilosophyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-stone-800 tracking-tight">不完全主義の心得</h1>
          <p className="text-stone-500">人生の有限性を受け入れ、豊かに生きるためのガイド</p>
        </div>

        <PhilosophyGuide />

        <div className="pt-8 border-t border-stone-100">
          <blockquote className="text-center font-serif text-lg text-stone-600 italic">
            「完璧にこなそうとするのをやめたとき、はじめて本当の人生が始まる」
          </blockquote>
          <p className="text-center text-sm text-stone-400 mt-4">— Imperfectionism Philosophy</p>
        </div>
      </motion.div>
    </div>
  );
}
