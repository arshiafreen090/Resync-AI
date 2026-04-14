'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { Keyword } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { motion } from 'framer-motion';

export function KeywordCard({ keyword }: { keyword: Keyword }) {
  const { selectedKeywordId, selectKeyword, keywordStatuses } = useDashboardStore();
  
  const status = keywordStatuses[keyword.id] || keyword.status;
  const isSelected = selectedKeywordId === keyword.id;

  const getColorClass = () => {
    if (status === 'matched') return 'brand-green';
    if (status === 'pending' || status === 'contextual') return 'brand-orange';
    if (status === 'not-applicable') return 'brand-red';
    if (status === 'modified') return 'brand-blue';
    return 'ink/20'; // rejected
  };

  const bgBorderClass = getColorClass();

  return (
    <motion.div
      layout
      whileHover={{ x: 2, boxShadow: "0 4px 12px rgba(14,12,10,0.05)" }}
      whileTap={{ scale: 0.99 }}
      onClick={() => selectKeyword(keyword.id)}
      className={`relative w-full rounded-xl border p-5 px-5 cursor-pointer flex flex-col gap-3 transition-colors ${
        isSelected 
          ? 'bg-brand-blue-soft border-brand-blue' 
          : 'bg-white border-border hover:border-ink/20'
      }`}
      style={{
        borderLeftWidth: isSelected ? '3px' : '3px',
        borderLeftColor: isSelected ? '#1A56FF' : `var(--${bgBorderClass})`,
      }}
    >
      {isSelected && (
        <motion.div 
          layoutId="keyword-selection-highlight"
          className="absolute inset-0 bg-brand-blue-soft rounded-xl border-brand-blue pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div className="relative z-10 flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-${bgBorderClass}`} />
          <span className="text-[15px] font-semibold text-ink leading-none">{keyword.name}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="relative z-10 w-full mt-1">
        <span className="text-[11px] uppercase tracking-wider font-bold text-ink/40">
          PLACEMENT: {keyword.placement}
        </span>
      </div>
    </motion.div>
  );
}
