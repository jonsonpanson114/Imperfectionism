'use client';

import { useSettings } from '@/lib/storage/hooks';
import Link from 'next/link';

export function Header() {
  const settings = useSettings();

  if (!settings) return null;

  const birthDate = new Date(settings.birthDate);
  const now = new Date();
  const eightyYears = new Date(birthDate);
  eightyYears.setFullYear(birthDate.getFullYear() + 80);

  const totalWeeks = 80 * 52;
  const weeksPassed = Math.max(0, Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const weeksLeft = Math.max(0, Math.floor((eightyYears.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const progress = Math.min(100, (weeksPassed / totalWeeks) * 100);

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex-1">
            <Link href="/" className="text-stone-400 hover:text-stone-600 md:hidden">
              ←
            </Link>
          </div>
          <div className="flex-1 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl md:text-4xl font-light text-stone-200">
                {weeksLeft.toLocaleString()}
              </span>
              <span className="text-sm md:text-base text-stone-400">
                週
              </span>
            </div>
            <div className="text-xs text-stone-400 mt-1">
              人生の {progress.toFixed(1)}% を過ぎました
            </div>
          </div>
          <div className="flex-1 text-right">
            <Link
              href="/setup"
              className="text-stone-400 hover:text-stone-600 text-sm"
            >
              設定
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1 bg-stone-100 w-full">
        <div
          className="h-full bg-gradient-to-r from-stone-300 to-stone-400 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
