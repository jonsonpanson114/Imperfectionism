'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '今', icon: '◎' },
  { href: '/choice', label: '選択', icon: '✓' },
  { href: '/done', label: '達成', icon: '◐' },
  { href: '/still', label: '無為', icon: '⊙' },
  { href: '/letgo', label: '手放し', icon: '✕' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'text-stone-800' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
