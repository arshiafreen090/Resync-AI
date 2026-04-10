'use client';

import { motion } from 'framer-motion';

export function ScoreBreakdownBars() {
  const bars = [
    { label: 'Keyword Match', score: 82, colorClass: 'bg-brand-blue' },
    { label: 'Formatting', score: 96, colorClass: 'bg-brand-green' },
    { label: 'Readability', score: 74, colorClass: 'bg-brand-orange' },
    { label: 'Relevance', score: 88, colorClass: 'bg-brand-purple' }
  ];

  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      {bars.map((bar) => (
        <div key={bar.label} className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink/50">{bar.label}</span>
            <span className="font-medium text-ink">{bar.score}%</span>
          </div>
          <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${bar.colorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar.score}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
