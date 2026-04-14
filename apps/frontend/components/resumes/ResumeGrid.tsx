'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_RESUMES } from '@/lib/mock-data';
import { ResumeCard } from './ResumeCard';

export function ResumeGrid() {
  const { resumeTab, resumeSearchQuery } = useDashboardStore();

  const filteredResumes = MOCK_RESUMES.filter(r => {
    // Search
    const searchLower = resumeSearchQuery.toLowerCase();
    const matchesSearch = 
      r.title.toLowerCase().includes(searchLower) ||
      r.jobTitle.toLowerCase().includes(searchLower) ||
      (r.company && r.company.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Tabs
    if (resumeTab === 'base') return r.isBase;
    if (resumeTab === 'tailored') return !r.isBase;
    return true; // 'all'
  });

  const baseResumes = filteredResumes.filter(r => r.isBase);
  const tailoredResumes = filteredResumes.filter(r => !r.isBase);

  return (
    <div className="flex flex-col gap-10 w-full mt-4">
      {baseResumes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-semibold text-ink">Base Resumes ({baseResumes.length})</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {baseResumes.map(r => <ResumeCard key={r.id} resume={r} />)}
          </div>
        </div>
      )}

      {tailoredResumes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-semibold text-ink">Job Tailored Resumes ({tailoredResumes.length})</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {tailoredResumes.map(r => <ResumeCard key={r.id} resume={r} />)}
          </div>
        </div>
      )}

      {filteredResumes.length === 0 && (
        <div className="py-20 text-center text-ink/40 text-[14px]">
          No resumes found matching your search.
        </div>
      )}
    </div>
  );
}
