'use client';

import { Keyword } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BulletCompare } from '@/components/ui/BulletCompare';
import { useDashboardStore } from '@/store/dashboard.store';
import { motion } from 'framer-motion';

export function MatchedPanel({ keyword }: { keyword: Keyword }) {
  const { updateKeywordStatus } = useDashboardStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border border-border border-l-[4px] border-l-brand-green rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <StatusBadge status={keyword.status} />
        </div>
      </div>

      <BulletCompare 
        original={keyword.originalBullet || '...'} 
        rewritten={keyword.rewrittenBullet || '...'} 
        keyword={keyword.name} 
      />

      <div className="flex items-center gap-3 mt-2">
        <button className="px-5 py-3 rounded-xl border border-transparent text-ink/50 text-[14px] font-medium hover:bg-ink/5 transition-colors cursor-pointer">
          ← Undo
        </button>
        <button 
          onClick={() => {
            // Usually this would just confirm and show next, mock does nothing or just highlights next
          }}
          className="flex-1 px-5 py-3 rounded-xl bg-brand-green/10 text-brand-green text-[14px] font-semibold hover:bg-brand-green/20 transition-colors cursor-pointer border border-brand-green/20"
        >
          ✓ Keep This
        </button>
      </div>
    </motion.div>
  );
}
