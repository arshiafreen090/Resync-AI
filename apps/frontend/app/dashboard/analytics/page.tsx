import { ResumeSelectorCard } from '@/components/analytics/ResumeSelectorCard';
import { ATSScoreCard } from '@/components/analytics/ATSScoreCard';
import { ScoreHistoryChart } from '@/components/analytics/ScoreHistoryChart';
import { ResumeInfoCard } from '@/components/analytics/ResumeInfoCard';
import { JobsFitCard } from '@/components/analytics/JobsFitCard';
import { TailoringSessionsCard } from '@/components/analytics/TailoringSessionsCard';
import { SkillsGapCard } from '@/components/analytics/SkillsGapCard';

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-8 pb-32">
      <div className="max-w-md">
        <ResumeSelectorCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_calc(40%-24px)] gap-6 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <ATSScoreCard />
          <ScoreHistoryChart />
          <ResumeInfoCard />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <JobsFitCard />
          <TailoringSessionsCard />
          <SkillsGapCard />
        </div>
      </div>
    </div>
  );
}
