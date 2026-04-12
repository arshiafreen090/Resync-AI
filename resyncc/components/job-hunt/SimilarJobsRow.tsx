'use client';

import { MOCK_JOBS } from '@/lib/mock-data';
import { useState } from 'react';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { motion } from 'framer-motion';

export function SimilarJobsRow() {
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Create compact jobs from MOCK_JOBS just for display
  const jobs = MOCK_JOBS.slice(0, 4);

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return 'bg-brand-green-soft text-brand-green';
    if (pct >= 60) return 'bg-brand-orange-soft text-brand-orange';
    return 'bg-brand-red-soft text-brand-red';
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-10">
      <h3 className="text-[14px] font-semibold text-ink">Similar Jobs</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 overflow-y-hidden snap-x">
        {jobs.map(job => (
          <div key={job.id} className="min-w-[200px] border border-border bg-white rounded-xl p-4 flex flex-col gap-3 shrink-0 snap-start">
            <div className={`w-7 h-7 rounded-lg ${job.avatarColorClass} flex items-center justify-center text-white font-serif font-bold text-sm`}>
              {job.avatarInitial}
            </div>
            <p className="text-[13px] font-medium text-ink leading-tight">{job.title}</p>
            <div className="mt-auto">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${getMatchColor(job.matchPercentage)}`}>
                {job.matchPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center w-full mt-4 flex-col items-center">
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
        
        <button 
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="px-6 py-2.5 rounded-full border border-border bg-transparent text-ink font-medium text-[13px] hover:bg-ink/5 transition-colors cursor-pointer"
        >
          {loadingMore ? 'Loading...' : 'Load more jobs'}
        </button>
      </div>
    </div>
  );
}
