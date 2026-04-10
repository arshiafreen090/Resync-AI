'use client';

import { Keyword } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { motion } from 'framer-motion';

export function NotApplicablePanel({ keyword }: { keyword: Keyword }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border border-border border-l-[4px] border-l-brand-red rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <StatusBadge status="not-applicable" />
        </div>
      </div>

      <div className="bg-cream rounded-xl p-4 flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink/40">
          Why Resync flagged this
        </span>
        <p className="text-[14px] text-ink/65 leading-relaxed">
          {keyword.whyFlagged || `No prior experience detected regarding ${keyword.name}. Including it without context might lower ATS relevance scoring.`}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button className="px-5 py-3 rounded-xl border border-transparent text-ink/40 text-[14px] font-medium hover:bg-ink/5 transition-colors cursor-pointer">
          Dismiss
        </button>
        <button className="flex-1 px-5 py-3 rounded-xl border border-brand-blue/30 text-brand-blue text-[14px] font-semibold hover:bg-brand-blue/5 transition-colors cursor-pointer bg-transparent">
          ✨ Try Fix with AI
        </button>
      </div>
    </motion.div>
  );
}
