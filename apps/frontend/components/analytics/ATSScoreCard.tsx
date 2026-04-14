'use client';

import { MOCK_ANALYTICS } from '@/lib/mock-data';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ScoreBreakdownBars } from './ScoreBreakdownBars';

export function ATSScoreCard() {
  const data = MOCK_ANALYTICS;

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40 block">ATS Score</span>
      
      <div className="flex items-center gap-8">
        <div className="flex items-baseline font-serif italic text-brand-blue">
          <span className="text-[72px] leading-none">
            <CountUpNumber to={data.atsScore} />
          </span>
          <span className="text-[24px] text-ink/30 ml-1">/100</span>
        </div>

        <ProgressRing percentage={data.atsScore} size={120} strokeWidth={8}>
          <span className="font-serif italic text-[24px] text-brand-blue">
            <CountUpNumber to={data.atsScore} suffix="%" />
          </span>
        </ProgressRing>
      </div>

      <p className="text-[13px] font-medium text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-lg px-3 py-1.5 w-fit">
        ↑ Above average for Senior PM roles
      </p>

      <div className="mt-2 text-ink/70">
        <ScoreBreakdownBars />
      </div>
    </div>
  );
}
