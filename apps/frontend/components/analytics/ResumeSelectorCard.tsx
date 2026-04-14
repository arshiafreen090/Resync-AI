'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_RESUMES } from '@/lib/mock-data';
import { FileText, ChevronDown } from 'lucide-react';

export function ResumeSelectorCard() {
  const { analyticsResumeId } = useDashboardStore();
  const currentResume = MOCK_RESUMES.find(r => r.id === analyticsResumeId) || MOCK_RESUMES[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-border p-5 flex items-center justify-between cursor-pointer hover:border-ink/20 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-[20px] text-ink leading-tight">
            {currentResume.title} (Main)
          </span>
          <span className="text-[12px] text-ink/40">↓ Click to switch resume</span>
        </div>
      </div>
      <ChevronDown className="w-5 h-5 text-ink/40" />
    </div>
  );
}
