'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_KEYWORDS } from '@/lib/mock-data';
import { MousePointerClick } from 'lucide-react';
import { ContextualPanel } from './detail-panels/ContextualPanel';
import { MatchedPanel } from './detail-panels/MatchedPanel';
import { NotApplicablePanel } from './detail-panels/NotApplicablePanel';
import { PendingPanel } from './detail-panels/PendingPanel';

export function DetailPanel() {
  const { selectedKeywordId, keywordStatuses } = useDashboardStore();

  if (!selectedKeywordId) {
    return (
      <div className="w-full h-[500px] rounded-2xl border-2 border-dashed border-ink/15 flex flex-col items-center justify-center text-center gap-4">
        <MousePointerClick className="w-10 h-10 text-ink/20" />
        <p className="font-serif italic text-[20px] text-ink/30">
          ← Select a keyword to review
        </p>
      </div>
    );
  }

  const keyword = MOCK_KEYWORDS.find(k => k.id === selectedKeywordId);
  if (!keyword) return null;

  const currentStatus = keywordStatuses[keyword.id] || keyword.status;

  if (currentStatus === 'contextual') return <ContextualPanel keyword={keyword} />;
  if (currentStatus === 'matched' || currentStatus === 'modified') return <MatchedPanel keyword={{...keyword, status: currentStatus}} />;
  if (currentStatus === 'not-applicable' || currentStatus === 'rejected') return <NotApplicablePanel keyword={{...keyword, status: currentStatus}} />;
  if (currentStatus === 'pending') return <PendingPanel keyword={keyword} />;

  return null;
}
