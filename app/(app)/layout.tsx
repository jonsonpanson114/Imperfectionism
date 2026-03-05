'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/navigation';
import { useIsSetupComplete } from '@/lib/storage/hooks';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSetupComplete = useIsSetupComplete();

  useEffect(() => {
    if (!isSetupComplete) {
      router.push('/setup');
    }
  }, [isSetupComplete, router]);

  if (!isSetupComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 mb-20 md:mb-0">
        <Header />
        <div className="px-4 py-6 md:px-6 md:py-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
