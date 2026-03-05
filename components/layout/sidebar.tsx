'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '今', icon: '◎', description: 'Now' },
  { href: '/choice', label: '選択', icon: '✓', description: 'Choice' },
  { href: '/done', label: '達成', icon: '◐', description: 'Done' },
  { href: '/still', label: '無為', icon: '⊙', description: 'Still' },
  { href: '/letgo', label: '手放し', icon: '✕', description: 'Let Go' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-100 h-screen sticky top-0">
      <div className="p-6 border-b border-stone-100">
        <h1 className="text-xl font-medium text-stone-800">Imperfectionism</h1>
        <p className="text-sm text-stone-500 mt-1">不完全主義を受け入れる</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-stone-100 text-stone-800'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-60">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <p className="text-xs text-stone-400 text-center">
          人生は4000週間しかありません
        </p>
      </div>
    </aside>
  );
}
