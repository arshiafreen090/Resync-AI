'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { useKeywords } from '@/lib/useKeywords';
import { KeywordCard } from './KeywordCard';
import { useState, useEffect } from 'react';
import { LayoutGroup } from 'framer-motion';

export function KeywordList() {
  const [filter, setFilter] = useState<string | null>(null);
  const { keywordStatuses } = useDashboardStore();
  const keywords = useKeywords();

  useEffect(() => {
    const handleFilter = (e: any) => setFilter(e.detail);
    window.addEventListener('SET_KEYWORD_FILTER', handleFilter);
    return () => window.removeEventListener('SET_KEYWORD_FILTER', handleFilter);
  }, []);

  const getFilterMatched = (kwId: string) => {
    if (!filter) return true;
    const s = keywordStatuses[kwId];
    if (filter === 'matched' && (s === 'matched' || s === 'modified')) return true;
    if (filter === 'pending' && s === 'pending') return true;
    if (filter === 'contextual' && s === 'contextual') return true;
    if (filter === 'not-applicable' && (s === 'not-applicable' || s === 'rejected')) return true;
    return false;
  };

  const filtered = keywords.filter(kw => getFilterMatched(kw.id));

  // TABS inside KeywordList
  const stats = { all: keywords.length, matched: 0, pending: 0, contextual: 0, na: 0 };
  keywords.forEach(k => {
    const s = keywordStatuses[k.id] || k.status;
    if (s === 'matched' || s === 'modified') stats.matched++;
    if (s === 'pending') stats.pending++;
    if (s === 'contextual') stats.contextual++;
    if (s === 'not-applicable' || s === 'rejected') stats.na++;
  });

  return (
    <div className="flex flex-col w-full h-full">
      {/* Local Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 bg-ink/5 p-1 rounded-full w-fit">
        {[
          { id: null, label: `All (${stats.all})` },
          { id: 'pending', label: `Pending (${stats.pending})` },
          { id: 'matched', label: `Matched (${stats.matched})` },
          { id: 'contextual', label: `Contextual (${stats.contextual})` },
          { id: 'not-applicable', label: `N/A (${stats.na})` },
        ].map(t => (
          <button
            key={t.id || 'all'}
            onClick={() => setFilter(t.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              filter === t.id ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <LayoutGroup>
        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 pb-10">
          {filtered.map(kw => (
            <KeywordCard key={kw.id} keyword={kw} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-ink/40 text-sm">
              No keywords match this filter.
            </div>
          )}
        </div>
      </LayoutGroup>
    </div>
  );
}
