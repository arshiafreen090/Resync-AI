'use client';

import { MOCK_ANALYTICS } from '@/lib/mock-data';
import { motion } from 'framer-motion';

export function SkillsGapCard() {
  const data = MOCK_ANALYTICS.missingSkills;

  const getColor = (importance: string) => {
    if (importance === 'High') return 'bg-brand-red';
    if (importance === 'Medium') return 'bg-brand-orange';
    return 'bg-ink/20';
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40 block">Top Missing Skills</span>
      
      <div className="flex flex-col gap-4 w-full">
        {data.map((skill) => (
          <div key={skill.skill} className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">{skill.skill}</span>
              <span className={`text-[11px] font-bold ${
                skill.importance === 'High' ? 'text-brand-red' : 
                skill.importance === 'Medium' ? 'text-brand-orange' : 'text-ink/40'
              }`}>
                {skill.importance}
              </span>
            </div>
            <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${getColor(skill.importance)}`}
                initial={{ width: 0 }}
                animate={{ width: `${skill.score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
