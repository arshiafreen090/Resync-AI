'use client';

import { Keyword } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useDashboardStore } from '@/store/dashboard.store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function ContextualPanel({ keyword }: { keyword: Keyword }) {
  const { updateKeywordStatus } = useDashboardStore();
  const [isExiting, setIsExiting] = useState(false);

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => {
      updateKeywordStatus(keyword.id, 'matched');
      // A full implementation would auto-select next pending here
    }, 300);
  };

  const handleReject = () => {
    setIsExiting(true);
    setTimeout(() => {
      updateKeywordStatus(keyword.id, 'rejected');
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
          className="w-full bg-brand-orange/5 border border-brand-orange/20 border-l-[4px] border-l-brand-orange rounded-2xl p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <div className="w-fit">
              <StatusBadge status="contextual" />
            </div>
            <h3 className="text-[20px] font-semibold text-ink leading-tight">{keyword.name}</h3>
            <span className="text-[11px] uppercase tracking-wider font-bold text-ink/40">
              PLACEMENT: {keyword.placement}
            </span>
          </div>

          <div className="bg-cream rounded-xl p-4 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink/40">
              Clarifying Question
            </span>
            <p className="text-[14px] text-ink/65 leading-relaxed">
              {keyword.clarifyingQuestion || `Could you elaborate on your experience with ${keyword.name}?`}
            </p>
          </div>

          <textarea
            placeholder="Describe your relevant experience..."
            className="w-full min-h-[80px] bg-white border border-border rounded-xl p-4 text-[13px] font-sans text-ink outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow resize-none"
          />

          <div className="flex items-center gap-3 mt-2">
            <button 
              onClick={handleReject}
              className="px-5 py-3 rounded-xl border border-ink/20 text-ink/50 text-[14px] font-medium hover:bg-ink/5 transition-colors"
            >
              ⊗ Reject
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 px-5 py-3 rounded-xl bg-brand-blue text-white text-[14px] font-semibold hover:bg-brand-blue/90 transition-colors shadow-sm"
            >
              Confirm & Integrate →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
