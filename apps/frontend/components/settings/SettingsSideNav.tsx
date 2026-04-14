'use client';

import { useDashboardStore } from '@/store/dashboard.store';

export function SettingsSideNav() {
  const { activeSettingsSection, setSettingsSection } = useDashboardStore();

  const navItems = [
    'Profile',
    'Plan & Billing',
    'Notifications',
    'Security',
    'Help & Support'
  ];

  return (
    <div className="w-[200px] shrink-0 flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = activeSettingsSection === item;
        return (
          <button
            key={item}
            onClick={() => setSettingsSection(item)}
            className={`text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors border-l-[3px] cursor-pointer ${
              isActive 
                ? 'bg-brand-blue-soft text-brand-blue border-brand-blue' 
                : 'bg-transparent text-ink/50 border-transparent hover:text-ink hover:bg-ink/5'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
