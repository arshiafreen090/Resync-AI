'use client';

import { Resume } from '@/lib/types';
import { MOCK_RESUMES } from '@/lib/mock-data';
import { MiniResumeThumb } from '@/components/ui/MiniResumeThumb';
import { motion } from 'framer-motion';

export function ResumeCard({ resume }: { resume: Resume }) {
  const baseResumeName = resume.baseResumeId 
    ? MOCK_RESUMES.find(r => r.id === resume.baseResumeId)?.title 
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(14,12,10,0.1)" }}
      className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col sm:flex-row gap-5"
    >
      <MiniResumeThumb />
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2 mb-4">
          <div>
            <span className="text-[11px] text-ink/40 uppercase tracking-widest font-bold">Resume Title:</span>
            <p className="text-[14px] font-semibold text-ink break-all">{resume.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-ink/40 uppercase tracking-widest font-bold block">Job Title:</span>
              <span className="text-[13px] text-ink/60">{resume.jobTitle}</span>
            </div>
            <div>
              <span className="text-[11px] text-ink/40 uppercase tracking-widest font-bold block">Company:</span>
              <span className={`text-[13px] ${resume.company ? 'text-ink/60' : 'text-ink/30 italic'}`}>
                {resume.company || 'Not specified'}
              </span>
            </div>
          </div>
          
          {!resume.isBase && baseResumeName && (
            <div>
              <span className="text-[11px] text-ink/40 uppercase tracking-widest font-bold">Used Base Resume:</span>
              <p className="text-[13px] text-brand-blue underline cursor-pointer">{baseResumeName}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button className="h-9 w-full rounded-lg bg-brand-blue-soft text-brand-blue text-[13px] font-semibold cursor-pointer hover:brightness-95 transition-all border-none">
            ✎ Edit Resume
          </button>
          <button className="h-9 w-full rounded-lg bg-brand-green/10 text-brand-green text-[13px] font-semibold cursor-pointer hover:brightness-95 transition-all border-none">
            ⟳ Tailor to Job
          </button>
          <button className="h-9 w-full rounded-lg bg-ink/5 text-ink/50 text-[13px] font-semibold cursor-pointer hover:bg-ink/10 transition-all border-none">
            ⧉ Duplicate
          </button>
          <button className="h-9 w-full rounded-lg bg-brand-red/10 text-brand-red text-[13px] font-semibold cursor-pointer hover:brightness-95 transition-all border-none">
            🗑 Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
