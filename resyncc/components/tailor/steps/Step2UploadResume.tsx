'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';
import { UploadCloud, Check, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function Step2UploadResume() {
  const { selectedResumeId, selectResume, setTailorStep } = useDashboardStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const prevResumes = [
    { id: 'r1', name: 'software_engineer_v2.pdf', date: '3 days ago', size: '1.2 MB' },
    { id: 'prev2', name: 'pm_resume_v2.docx', date: '1 week ago', size: '980 KB' }
  ];

  // Auto-select first resume per spec if nothing is selected and no manual upload yet
  // actually spec says "(pre-selected)" for the first one. Let's do that via effect.
  if (!selectedResumeId && !uploadedFileName) {
    selectResume('r1');
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
      selectResume(null); // deselect prev ones
    }
  };

  const handleManualUpload = () => {
    // mock behavior
    setUploadedFileName('new_resume_draft.pdf');
    selectResume(null);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setTailorStep(3);
        }, 200);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full pt-8 pb-16">
      <h2 className="font-serif italic text-[40px] text-ink mb-2">Upload your resume</h2>
      <p className="text-base text-ink/55 mb-10">
        Resync reads your current resume and cross-matches it against the job&apos;s keywords instantly.
      </p>

      {/* Upload Zone */}
      <motion.div 
        whileHover={{ scale: uploadedFileName ? 1 : 1.01 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedFileName ? handleManualUpload : undefined}
        className={`h-[200px] w-full rounded-2xl flex flex-col items-center justify-center transition-colors ${
          uploadedFileName 
            ? 'bg-white border-2 border-brand-green/30' 
            : isDragging 
              ? 'bg-brand-blue-soft border-2 border-dashed border-brand-blue cursor-pointer'
              : 'bg-white border-2 border-dashed border-ink/15 cursor-pointer hover:border-ink/30'
        }`}
      >
        {uploadedFileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-ink text-[16px]">{uploadedFileName}</p>
              <p className="text-[13px] text-ink/40 mt-1 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); setUploadedFileName(null); selectResume('r1'); }}>Remove file</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-brand-blue' : 'text-ink/20'}`} />
            <div className="text-center">
              <p className={`font-medium text-[16px] ${isDragging ? 'text-brand-blue' : 'text-ink'}`}>
                Drop your PDF or DOCX here
              </p>
              <p className={`text-[13px] mt-1 underline ${isDragging ? 'text-brand-blue/60' : 'text-ink/40'}`}>
                or click to browse
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Or Divider */}
      <div className="flex items-center gap-4 my-8 w-full">
        <div className="flex-1 h-[1px] bg-border" />
        <span className="text-[14px] text-ink/40 font-medium lowercase">or</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      {/* Previously Uploaded */}
      <div className="w-full flex flex-col gap-4 mb-10">
        <h3 className="text-[12px] font-bold uppercase tracking-wide text-ink/40">Previously Uploaded</h3>
        
        <div className="flex gap-4 w-full">
          {prevResumes.map(resume => {
            const isSelected = selectedResumeId === resume.id;
            return (
              <motion.div 
                key={resume.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { selectResume(resume.id); setUploadedFileName(null); }}
                className={`flex-1 flex flex-col rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-brand-blue bg-brand-blue-soft' 
                    : 'bg-white border-border hover:border-ink/20 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-brand-blue border-transparent text-white' : 'border-[1.5px] border-ink/20 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-ink break-all leading-tight">{resume.name}</p>
                  <p className="text-[12px] text-ink/40 mt-1">Uploaded {resume.date} · {resume.size}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full flex flex-col items-center mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="relative overflow-hidden w-full h-14 rounded-full bg-ink flex items-center justify-center transition-all cursor-pointer hover:shadow-[0_4px_16px_rgba(14,12,10,0.25)] hover:-translate-y-[1px]"
        >
          {isAnalyzing && (
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-brand-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          )}
          <span className="relative z-10 text-white font-semibold text-[15px]">
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume →'}
          </span>
        </button>
        
        {isAnalyzing && (
          <p className="text-[13px] text-ink/50 mt-4 animate-pulse">
            Matching 13 keywords against your resume…
          </p>
        )}
      </div>
    </div>
  );
}
