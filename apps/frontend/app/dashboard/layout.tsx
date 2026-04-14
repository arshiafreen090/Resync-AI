import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/Topbar';
import { CustomCursor } from '@/components/dashboard/CustomCursor';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userMeta = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
    avatarInitial: (user?.user_metadata?.full_name || user?.email || 'G').charAt(0).toUpperCase(),
  };

  return (
    <div className="flex h-screen w-full bg-cream overflow-hidden">
      <CustomCursor />
      <Sidebar user={userMeta} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={userMeta} />
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
