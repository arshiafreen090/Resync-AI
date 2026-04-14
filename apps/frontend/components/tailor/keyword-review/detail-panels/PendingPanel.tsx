'use client';

import { Keyword } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useDashboardStore } from '@/store/dashboard.store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { updateKeywordDecision } from '@/lib/api';

export function PendingPanel({ keyword }: { keyword: Keyword }) {
  const { updateKeywordStatus, sessionId } = useDashboardStore();
  const [isExiting, setIsExiting] = useState(false);

  // Simple highlight function
  const highlightKeyword = (text: string, kw: string) => {
    if (!kw) return text;
    const regex = new RegExp(`(${kw})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-brand-blue">{part}</span> : part
    );
  };

  const handleAction = (status: 'matched' | 'rejected') => {
    setIsExiting(true);
    // Fire API call if real session exists
    if (sessionId) {
      const decision = status === 'matched' ? 'accepted' : 'rejected';
      updateKeywordDecision(sessionId, keyword.id, decision).catch(console.error);
    }
    setTimeout(() => {
      updateKeywordStatus(keyword.id, status);
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
              <StatusBadge status="pending" />
            </div>
            <h3 className="text-[20px] font-semibold text-ink leading-tight">{keyword.name}</h3>
            <span className="text-[11px] uppercase tracking-wider font-bold text-ink/40">
              PLACEMENT: {keyword.placement}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12px] uppercase tracking-wider font-bold text-ink/40">
              Proposed Addition:
            </span>
            <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[14px] text-ink leading-relaxed">
                {highlightKeyword(keyword.proposedAddition || `Utilized ${keyword.name} to optimize workflows.`, keyword.name)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button 
              onClick={() => handleAction('rejected')}
              className="px-5 py-3 rounded-xl border border-ink/20 text-ink/50 text-[14px] font-medium hover:bg-ink/5 transition-colors cursor-pointer"
            >
              ⊗ Reject
            </button>
            <button 
              className="px-5 py-3 rounded-xl border border-brand-blue/30 text-brand-blue text-[14px] font-medium hover:bg-brand-blue/5 transition-colors cursor-pointer bg-transparent"
            >
              ✎ Edit
            </button>
            <button 
              onClick={() => handleAction('matched')}
              className="flex-1 min-w-[120px] px-5 py-3 rounded-xl bg-brand-green text-white text-[14px] font-semibold hover:bg-brand-green/90 transition-colors shadow-sm cursor-pointer border-none"
            >
              ✓ Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
