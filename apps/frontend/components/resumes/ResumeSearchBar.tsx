'use client';

import { Search } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard.store';

export function ResumeSearchBar() {
  const { resumeSearchQuery, setResumeSearch } = useDashboardStore();

  return (
    <div className="relative w-full h-12 flex items-center bg-white rounded-xl border border-border shadow-sm">
      <Search className="absolute left-4 w-[18px] h-[18px] text-ink/30" />
      <input
        type="text"
        value={resumeSearchQuery}
        onChange={(e) => setResumeSearch(e.target.value)}
        placeholder="Search resumes by title, role, or company..."
        className="w-full h-full pl-11 pr-4 bg-transparent outline-none border-none text-[13px] font-sans placeholder:text-ink/30"
      />
    </div>
  );
}
