'use client';

import { useDashboardStore } from '@/store/dashboard.store';

export function JobHuntTopControls() {
  const { jobViewMode, setJobViewMode, jobResumeMode, setJobResumeMode } = useDashboardStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
      {/* Row 1 / Left — Resume mode */}
      <div className="flex w-fit bg-white border border-border rounded-lg p-1 relative shadow-sm">
        <button
          onClick={() => setJobResumeMode('base')}
          className={`relative z-10 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
            jobResumeMode === 'base' ? 'text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          📄 Base Resume
        </button>
        <button
          onClick={() => setJobResumeMode('tailored')}
          className={`relative z-10 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
            jobResumeMode === 'tailored' ? 'text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          ✨ Tailor Resume
        </button>

        {/* Animated background selection */}
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-ink rounded-md transition-transform duration-300 ease-out z-0"
          style={{ transform: jobResumeMode === 'base' ? 'translateX(0)' : 'translateX(100%)' }}
        />
      </div>

      {/* Row 2 / Right — View mode */}
      <div className="flex w-fit bg-white border border-border rounded-lg p-1 relative shadow-sm">
        <button
          onClick={() => setJobViewMode('saved')}
          className={`relative z-10 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
            jobViewMode === 'saved' ? 'text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          💾 Saved Jobs (3)
        </button>
        <button
          onClick={() => setJobViewMode('find')}
          className={`relative z-10 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
            jobViewMode === 'find' ? 'text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          🔍 Find New Jobs
        </button>
        
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-ink rounded-md transition-transform duration-300 ease-out z-0"
          style={{ transform: jobViewMode === 'saved' ? 'translateX(0)' : 'translateX(100%)' }}
        />
      </div>
    </div>
  );
}
