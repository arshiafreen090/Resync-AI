'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

type UserMeta = {
  name: string;
  email: string;
  avatarUrl: string | null;
  avatarInitial: string;
};

function Avatar({ user, size = 36 }: { user: UserMeta; size?: number }) {
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center text-white font-serif text-lg">
      {user.avatarInitial}
    </div>
  );
}

export function TopBar({ user }: { user: UserMeta }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (path: string) => {
    if (path.includes('/tailor')) return 'Tailor Resume';
    if (path.includes('/resumes')) return 'My Resumes';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/job-hunt')) return 'Job Hunt';
    if (path.includes('/settings')) return 'Account Settings';
    return 'Dashboard';
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    router.push('/');
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

        {/* Profile button + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-ink/10 cursor-pointer hover:scale-105 transition-transform focus:outline-none"
          >
            <Avatar user={user} size={36} />
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-[260px] bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_8px_40px_rgba(14,12,10,0.10)] z-50 overflow-hidden">
              {/* User info header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-ink/10 shrink-0">
                  <Avatar user={user} size={40} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-ink truncate">{user.name}</span>
                  <span className="text-[12px] text-ink/40 truncate">{user.email}</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  onClick={() => { setOpen(false); router.push('/dashboard/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors cursor-pointer bg-transparent border-none text-left"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  Account Settings
                </button>

                <div className="h-[1px] bg-[#E2E8F0] my-1.5 mx-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
