'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { MOCK_USER } from '@/lib/mock-data';

export function TopBar() {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    if (path.includes('/tailor')) return 'Tailor Resume';
    if (path.includes('/resumes')) return 'My Resumes';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/job-hunt')) return 'Job Hunt';
    if (path.includes('/settings')) return 'Account Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center">
        <h1 className="font-serif italic text-2xl text-ink">
          {getPageTitle(pathname)}
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-ink/40 hover:text-ink transition-colors bg-transparent border-none cursor-pointer p-0">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="w-[1px] h-6 bg-ink/10" />
        
        <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-white font-serif text-lg cursor-pointer hover:scale-105 transition-transform">
          {MOCK_USER.avatarInitial}
        </div>
      </div>
    </header>
  );
}
