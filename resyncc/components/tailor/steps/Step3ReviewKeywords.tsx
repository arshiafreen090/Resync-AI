'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { SummaryBar } from '../keyword-review/SummaryBar';
import { KeywordList } from '../keyword-review/KeywordList';
import { DetailPanel } from '../keyword-review/DetailPanel';
import { useKeywords } from '@/lib/useKeywords';
import { useState } from 'react';
import { finalizeSession, pollUntil } from '@/lib/api';
import { Loader2, AlertCircle } from 'lucide-react';

export function Step3ReviewKeywords() {
  const {
    keywordStatuses,
    sessionId,
    setTailorStep,
    setFinalAtsScore,
    setProcessingStage,
  } = useDashboardStore();

  const keywords = useKeywords();
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  const unresolvedCount = keywords.filter(kw => {
    const s = keywordStatuses[kw.id] || kw.status;
    return s === 'pending' || s === 'contextual';
  }).length;

  const total = keywords.length;
  const resolvedPct = total > 0 ? ((total - unresolvedCount) / total) * 100 : 0;

  const handleFinalize = async () => {
    setFinalizeError(null);
    setIsFinalizing(true);
    try {
      if (sessionId) {
        setProcessingStage('finalizing');
        await finalizeSession(sessionId);
        await pollUntil(sessionId, ['complete'], undefined, 3000, 60);
        setProcessingStage('complete');
      }
      setTailorStep(4);
    } catch (err: any) {
      setProcessingStage('failed');
      setFinalizeError(err?.message || 'Finalization failed. Please try again.');
      setIsFinalizing(false);
    }
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full pt-8 pb-32">
      <SummaryBar />

      {finalizeError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{finalizeError}</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 mt-8 w-full items-start">
        <div className="w-full lg:w-[55%]">
          <KeywordList />
        </div>
        <div className="w-full lg:w-[45%] lg:sticky lg:top-24 mt-8 lg:mt-0">
          <DetailPanel />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 md:left-[240px] right-0 bg-white border-t border-border p-4 px-8 flex items-center justify-between z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
          <span className="text-sm text-ink/50 font-medium">
            {unresolvedCount > 0 ? `${unresolvedCount} keywords still need review` : 'All keywords reviewed'}
          </span>
          <div className="w-[200px] h-1.5 bg-ink/10 rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-brand-green transition-all duration-500 ease-out"
              style={{ width: `${resolvedPct}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={handleFinalize}
          disabled={unresolvedCount > 0 || isFinalizing}
          className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            unresolvedCount === 0 && !isFinalizing
              ? 'bg-ink text-white hover:bg-brand-blue hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] hover:-translate-y-[1px]' 
              : 'bg-ink/10 text-ink/30 cursor-not-allowed'
          }`}
        >
          {isFinalizing && <Loader2 className="w-4 h-4 animate-spin" />}
          {isFinalizing ? 'Generating your resume...' : 'Complete Tailoring →'}
        </button>
      </div>
    </div>
  );
}