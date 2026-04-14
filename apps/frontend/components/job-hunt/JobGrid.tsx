'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_JOBS } from '@/lib/mock-data';
import { JobCard } from './JobCard';

export function JobGrid() {
  const { jobViewMode, savedJobIds } = useDashboardStore();

  const displayJobs = jobViewMode === 'saved' 
    ? MOCK_JOBS.filter(job => savedJobIds.includes(job.id))
    : MOCK_JOBS;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      {displayJobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
      
      {displayJobs.length === 0 && (
        <div className="col-span-full py-20 text-center text-ink/40 text-[14px]">
          {jobViewMode === 'saved' ? "You haven't saved any jobs yet." : "No jobs found matching your criteria."}
        </div>
      )}
    </div>
  );
}
