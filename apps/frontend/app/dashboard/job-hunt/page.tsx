import { JobHuntTopControls } from '@/components/job-hunt/JobHuntTopControls';
import { JobStatsStrip } from '@/components/job-hunt/JobStatsStrip';
import { JobFilterChips } from '@/components/job-hunt/JobFilterChips';
import { JobGrid } from '@/components/job-hunt/JobGrid';
import { SimilarJobsRow } from '@/components/job-hunt/SimilarJobsRow';

export default function JobHuntPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 pb-32">
      <JobHuntTopControls />
      <JobStatsStrip />

      <div className="flex flex-col gap-6 mt-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div className="flex flex-col">
            <h2 className="font-serif italic text-2xl text-ink">Recommended Jobs</h2>
            <p className="text-[13px] text-ink/40 mt-1">
              Based on your skills: Python, SQL, Product Strategy...
            </p>
          </div>
          <JobFilterChips />
        </div>

        <JobGrid />
        
        <div className="w-full h-[1px] bg-border mt-8" />
        
        <SimilarJobsRow />
      </div>
    </div>
  );
}
