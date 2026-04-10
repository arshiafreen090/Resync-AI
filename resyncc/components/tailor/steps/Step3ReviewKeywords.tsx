'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { SummaryBar } from '../keyword-review/SummaryBar';
import { KeywordList } from '../keyword-review/KeywordList';
import { DetailPanel } from '../keyword-review/DetailPanel';
import { MOCK_KEYWORDS } from '@/lib/mock-data';
import { useEffect } from 'react';

export function Step3ReviewKeywords() {
  const { keywordStatuses, updateKeywordStatus, setTailorStep } = useDashboardStore();

  useEffect(() => {
    // Initialize statuses if empty
    if (Object.keys(keywordStatuses).length === 0) {
      MOCK_KEYWORDS.forEach(kw => {
        updateKeywordStatus(kw.id, kw.status);
      });
    }
  }, [keywordStatuses, updateKeywordStatus]);

  const unresolvedCount = Object.values(keywordStatuses).filter(s => s === 'pending' || s === 'contextual').length;
  const total = MOCK_KEYWORDS.length;
  const resolvedPct = total > 0 ? ((total - unresolvedCount) / total) * 100 : 0;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full pt-8 pb-32">
      <SummaryBar />
      
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
          onClick={() => setTailorStep(4)}
          disabled={unresolvedCount > 0}
          className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
            unresolvedCount === 0 
              ? 'bg-ink text-white hover:bg-brand-blue hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] hover:-translate-y-[1px]' 
              : 'bg-ink/10 text-ink/30 cursor-not-allowed'
          }`}
        >
          Complete Tailoring →
        </button>
      </div>
    </div>
  );
}
