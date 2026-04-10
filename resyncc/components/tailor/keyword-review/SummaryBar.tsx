'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_KEYWORDS } from '@/lib/mock-data';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useState } from 'react';

export function SummaryBar() {
  const { keywordStatuses } = useDashboardStore();
  
  // Actually we need to make it filterable in the list, but we can manage local filter state in KeywordList
  // Wait, the prompt says "Right: horizontal pill segments as filter buttons".
  // Let's pass setActiveFilter down or manage it in Zustand if needed.
  // Actually let's use a local event bus or Zustand to filter.
  // We'll add filter to Zustand later if needed, or just let SummaryBar dispatch a custom event.
  // A simpler way is to put the active filter string in Zustand. Oh, wait, the prompt says:
  // "Clicking a segment filters the keyword list" 
  
  // We can just add it to Zustand: `reviewFilter: 'all'` etc. But we didn't add it in dashboard.store.ts.
  // Let's just use window DispatchEvent for a quick hook-less connection between SummaryBar and KeywordList
  // Or since they share a parent (Step3ReviewKeywords), we can lift state up or add to store.
  
  const stats = {
    matched: 0,
    pending: 0,
    contextual: 0,
    'not-applicable': 0
  };

  Object.values(keywordStatuses).forEach(status => {
    if (status === 'matched' || status === 'modified') stats.matched++;
    if (status === 'pending') stats.pending++;
    if (status === 'contextual') stats.contextual++;
    if (status === 'not-applicable' || status === 'rejected') stats['not-applicable']++;
  });

  const total = MOCK_KEYWORDS.length;
  const integrated = stats.matched;
  const pct = total > 0 ? Math.round((integrated / total) * 100) : 0;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFilter = (f: string) => {
    const newFilter = activeFilter === f ? null : f;
    setActiveFilter(newFilter);
    window.dispatchEvent(new CustomEvent('SET_KEYWORD_FILTER', { detail: newFilter }));
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-brand p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
      {/* Left */}
      <div className="flex flex-col">
        <h2 className="font-serif italic text-[32px] text-ink leading-none">{total} Keywords Found</h2>
        <p className="text-[13px] text-ink/40 mt-2">Senior PM role at Stripe</p>
      </div>

      {/* Center - Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => toggleFilter('matched')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all ${
            activeFilter === 'matched' 
              ? 'bg-brand-green text-white border-brand-green' 
              : 'bg-brand-green/10 text-brand-green border-[1px] border-brand-green/20 hover:bg-brand-green/20'
          }`}
        >
          <span className="text-[10px]">●</span> Matched {stats.matched}
        </button>

        <button 
          onClick={() => toggleFilter('pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all ${
            activeFilter === 'pending' 
              ? 'bg-brand-orange text-white border-brand-orange' 
              : 'bg-brand-orange/10 text-brand-orange border-[1px] border-brand-orange/20 hover:bg-brand-orange/20'
          }`}
        >
          <span className="text-[10px]">●</span> Pending {stats.pending}
        </button>

        <button 
          onClick={() => toggleFilter('contextual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all ${
            activeFilter === 'contextual' 
              ? 'bg-brand-purple text-white border-brand-purple' 
              : 'bg-brand-purple/10 text-brand-purple border-[1px] border-brand-purple/20 hover:bg-brand-purple/20'
          }`}
        >
          <span className="text-[10px]">●</span> Contextual {stats.contextual}
        </button>

        <button 
          onClick={() => toggleFilter('not-applicable')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all ${
            activeFilter === 'not-applicable' 
              ? 'bg-brand-red text-white border-brand-red' 
              : 'bg-brand-red/10 text-brand-red border-[1px] border-brand-red/20 hover:bg-brand-red/20'
          }`}
        >
          <span className="text-[10px]">●</span> N/A {stats['not-applicable']}
        </button>
      </div>

      {/* Right */}
      <div className="flex flex-col items-center shrink-0 border-l border-border pl-6">
        <ProgressRing percentage={pct} size={80} strokeWidth={5} color="#1A56FF">
          <span className="font-serif italic text-[18px] text-brand-blue">{pct}%</span>
        </ProgressRing>
        <span className="text-[11px] text-ink/40 mt-1 uppercase tracking-wider font-bold">Keywords Integrated</span>
      </div>
    </div>
  );
}
