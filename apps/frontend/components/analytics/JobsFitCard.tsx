'use client';

import { MOCK_ANALYTICS } from '@/lib/mock-data';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { motion } from 'framer-motion';

export function JobsFitCard() {
  const data = MOCK_ANALYTICS.jobsFit;
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40 block">Jobs You Fit</span>
      
      <div className="flex flex-col">
        <span className="font-serif italic text-[56px] text-brand-blue leading-none">
          <CountUpNumber to={total} />
        </span>
        <span className="text-[13px] text-ink/40 mt-2">Jobs match your current profile</span>
      </div>

      <div className="flex flex-col w-full bg-ink/5 rounded-xl h-2 overflow-hidden mt-2 mb-4 flex-row">
        {data.map((item, i) => (
          <motion.div 
            key={item.category}
            className={`h-full ${item.colorClass} border-r-2 border-white last:border-0`}
            initial={{ width: 0 }}
            animate={{ width: `${(item.count / total) * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.colorClass}`} />
              <span className="font-medium text-ink/60">{item.category}</span>
            </div>
            <span className="font-semibold text-ink">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
