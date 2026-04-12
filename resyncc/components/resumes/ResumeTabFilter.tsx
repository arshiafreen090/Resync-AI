'use client';

import { useDashboardStore } from '@/store/dashboard.store';

export function ResumeTabFilter() {
  const { resumeTab, setResumeTab } = useDashboardStore();

  const tabs = [
    { id: 'all', label: 'All Resumes' },
    { id: 'base', label: 'Base Resumes' },
    { id: 'tailored', label: 'Tailored Resumes' }
  ] as const;

  return (
    <div className="flex w-fit bg-ink/5 rounded-full p-1 relative mt-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setResumeTab(t.id)}
          className={`relative z-10 px-5 py-2 rounded-full text-[14px] font-medium transition-colors ${
            resumeTab === t.id ? 'text-white bg-ink' : 'text-ink/50 hover:text-ink bg-transparent'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
