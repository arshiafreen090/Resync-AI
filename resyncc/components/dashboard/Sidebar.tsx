'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Wand2, FileStack, BarChart3, Briefcase, Settings2, Sparkles } from 'lucide-react';
import { MOCK_USER } from '@/lib/mock-data';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Tailor Resume', href: '/dashboard/tailor', icon: Wand2 },
    { name: 'My Resumes', href: '/dashboard/resumes', icon: FileStack },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Job Hunt', href: '/dashboard/job-hunt', icon: Briefcase },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings2 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-full bg-white border-r border-[#E2E8F0]">
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-[34px] h-[34px] bg-ink rounded-xl flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">Resync AI</span>
        </div>

        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex w-full items-center justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                  isActive 
                    ? 'border-l-[3px] border-brand-blue bg-brand-blue-soft text-brand-blue font-medium' 
                    : 'text-ink/50 hover:text-ink/80 hover:bg-ink/5 border-l-[3px] border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-blue' : 'text-ink/50'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white font-serif text-lg">
            {MOCK_USER.avatarInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-ink">{MOCK_USER.name}</span>
            <span className={`text-[11px] font-bold uppercase w-fit px-2 py-0.5 rounded-full mt-1 ${
              MOCK_USER.plan === 'Pro' ? 'bg-brand-blue-soft text-brand-blue' : 'bg-ink/10 text-ink/60'
            }`}>
              {MOCK_USER.plan}
            </span>
          </div>
        </div>
        <div>
          <button className="text-[12px] text-brand-red cursor-pointer hover:underline bg-transparent border-none p-0 outline-none">
            → Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
