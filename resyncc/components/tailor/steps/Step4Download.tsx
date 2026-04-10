'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_KEYWORDS } from '@/lib/mock-data';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { BulletCompare } from '@/components/ui/BulletCompare';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

function AnimatedCheckmark() {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.12, 1], opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
      className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center mx-auto mb-6 shrink-0"
    >
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
    </motion.div>
  );
}

export function Step4Download() {
  const { keywordStatuses, resetTailorWizard, setTailorStep } = useDashboardStore();
  
  // Calculate mock stats
  const total = MOCK_KEYWORDS.length;
  let integrated = 0;
  let rewritten = 0;
  let atsScore = 94; // Mock final score

  const changedKeywords = MOCK_KEYWORDS.filter(kw => {
    const s = keywordStatuses[kw.id] || kw.status;
    if (s === 'matched' || s === 'modified') {
      integrated++;
      if (kw.rewrittenBullet || kw.proposedAddition) rewritten++;
      return true;
    }
    return false;
  });

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full pt-8 pb-32 text-center">
      <AnimatedCheckmark />
      
      <h2 className="font-serif italic text-[48px] text-ink mb-2 leading-none">Your resume is resynced.</h2>
      <p className="text-[17px] text-ink/55 mb-10">Ready to submit. Here&apos;s what Resync improved.</p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
          <span className="text-[12px] font-bold uppercase tracking-wider text-ink/40 mb-2">Keywords Integrated</span>
          <div className="font-serif italic text-[40px] text-brand-blue leading-none">
            <CountUpNumber to={integrated} />/{total}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
          <span className="text-[12px] font-bold uppercase tracking-wider text-ink/40 mb-2">ATS Score</span>
          <div className="font-serif italic text-[40px] text-brand-green leading-none">
            <CountUpNumber to={atsScore} suffix="%" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
          <span className="text-[12px] font-bold uppercase tracking-wider text-ink/40 mb-2">Bullets Rewritten</span>
          <div className="font-serif italic text-[40px] text-ink leading-none">
            <CountUpNumber to={rewritten > 0 ? rewritten : 6} />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <button className="h-14 px-8 rounded-full bg-ink text-white font-semibold text-[15px] cursor-pointer hover:bg-brand-blue hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] transition-all">
          ⬇ Download PDF
        </button>
        <button className="h-14 px-8 rounded-full bg-white border border-ink text-ink font-semibold text-[15px] cursor-pointer hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] transition-all">
          ⬇ Download DOCX
        </button>
      </div>

      <button 
        onClick={() => {
          resetTailorWizard();
        }}
        className="text-[15px] text-ink/50 hover:text-ink underline cursor-pointer bg-transparent border-none w-fit mx-auto"
      >
        Tailor for another job →
      </button>

      {/* What Changed Panel */}
      <div className="w-full bg-white rounded-2xl border border-border shadow-brand p-8 text-left mt-12">
        <h3 className="text-[18px] font-semibold text-ink mb-6">What Changed</h3>
        
        <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2">
          {changedKeywords.map(kw => (
            <div key={kw.id} className="flex flex-col gap-3">
              <div className="w-fit">
                <StatusBadge status={keywordStatuses[kw.id] || kw.status} />
              </div>
              <BulletCompare 
                original={kw.originalBullet || '...'} 
                rewritten={kw.rewrittenBullet || kw.proposedAddition || '...'} 
                keyword={kw.name} 
              />
            </div>
          ))}
          {changedKeywords.length === 0 && (
            <p className="text-sm text-ink/40">No major bullet changes were recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
