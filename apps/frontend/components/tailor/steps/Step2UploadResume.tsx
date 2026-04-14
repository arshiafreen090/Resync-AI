'use client';

import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';
import { UploadCloud, Check, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  uploadResume,
  listResumes,
  startAnalysis,
  pollUntil,
  getSessionKeywords,
  getSessionStatus,
} from '@/lib/api';
import type { UploadedResume } from '@/lib/types';

const STAGE_LABELS: Record<string, string> = {
  uploading: 'Uploading your resume…',
  analyzing: 'Running AI keyword analysis…',
  reviewing: 'Building your keyword review…',
};

export function Step2UploadResume() {
  const {
    jobDescription,
    selectedResumeId,
    selectResume,
    setTailorStep,
    setSessionId,
    setUploadedResumeId,
    setSessionKeywords,
    setInitialAtsScore,
    setProcessingStage,
    setProcessingError,
    processingStage,
    processingError,
  } = useDashboardStore();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prevResumes, setPrevResumes] = useState<UploadedResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [stageLabel, setStageLabel] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnalyzing = processingStage === 'uploading' || processingStage === 'analyzing';

  // Load previously uploaded resumes
  useEffect(() => {
    listResumes()
      .then(({ resumes }) => {
        setPrevResumes(resumes)
        // Pre-select the most recent one if nothing is selected
        if (resumes.length > 0 && !selectedResumeId && !uploadedFile) {
          selectResume(resumes[0].id)
        }
      })
      .catch(() => {/* silently ignore if backend is down */})
      .finally(() => setLoadingResumes(false))
  }, [])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) { setUploadedFile(file); selectResume(null); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedFile(file); selectResume(null); }
  };

  const handleAnalyze = async () => {
    setProcessingError(null);
    setProgress(0);

    try {
      let resumeId = selectedResumeId;

      // Step 1: Upload if new file provided
      if (uploadedFile) {
        setProcessingStage('uploading');
        setStageLabel(STAGE_LABELS.uploading);
        setProgress(15);
        const { resume_id } = await uploadResume(uploadedFile, uploadedFile.name);
        resumeId = resume_id;
        setUploadedResumeId(resume_id);
        selectResume(resume_id);
        setProgress(35);
      } else if (!resumeId) {
        setProcessingError('Please upload a resume or select a previous one.');
        return;
      }

      // Step 2: Start analysis
      setProcessingStage('analyzing');
      setStageLabel(STAGE_LABELS.analyzing);
      setProgress(45);
      const { session_id } = await startAnalysis(resumeId!, jobDescription);
      setSessionId(session_id);
      setProgress(55);

      // Step 3: Poll until 'reviewing'
      let tick = 0;
      await pollUntil(
        session_id,
        ['reviewing'],
        (status) => {
          tick++;
          setStageLabel(STAGE_LABELS[status] || STAGE_LABELS.analyzing);
          setProgress(Math.min(55 + tick * 4, 90));
        },
        3000,
        60,
      );

      // Step 4: Fetch keywords + initial score
      setStageLabel('Loading keyword review…');
      setProgress(95);
      const [kwData, statusData] = await Promise.all([
        getSessionKeywords(session_id),
        getSessionStatus(session_id),
      ]);
      setSessionKeywords(kwData.keywords);
      if (statusData.initial_ats_score !== null) {
        setInitialAtsScore(statusData.initial_ats_score);
      }

      setProcessingStage('reviewing');
      setProgress(100);
      setTimeout(() => setTailorStep(3), 300);
    } catch (err: any) {
      setProcessingStage('failed');
      setProcessingError(err?.message || 'Something went wrong. Please try again.');
      setProgress(0);
    }
  };

  const canAnalyze = (uploadedFile !== null || selectedResumeId !== null) && !isAnalyzing;

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full pt-8 pb-16">
      <h2 className="font-serif italic text-[40px] text-ink mb-2">Upload your resume</h2>
      <p className="text-base text-ink/55 mb-10">
        Resync reads your current resume and cross-matches it against the job&apos;s keywords instantly.
      </p>

      {/* Error banner */}
      <AnimatePresence>
        {processingError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{processingError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleFileInput}
      />
      <motion.div
        whileHover={{ scale: uploadedFile ? 1 : 1.01 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedFile ? () => fileInputRef.current?.click() : undefined}
        className={`h-[200px] w-full rounded-2xl flex flex-col items-center justify-center transition-colors ${
          uploadedFile
            ? 'bg-white border-2 border-brand-green/30'
            : isDragging
              ? 'bg-brand-blue-soft border-2 border-dashed border-brand-blue cursor-pointer'
              : 'bg-white border-2 border-dashed border-ink/15 cursor-pointer hover:border-ink/30'
        }`}
      >
        {uploadedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-ink text-[16px]">{uploadedFile.name}</p>
              <p
                className="text-[13px] text-ink/40 mt-1 cursor-pointer hover:underline"
                onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
              >
                Remove file
              </p>
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

      {/* Previously Uploaded */}
      {!loadingResumes && prevResumes.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8 w-full">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-[14px] text-ink/40 font-medium lowercase">or</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <div className="w-full flex flex-col gap-4 mb-10">
            <h3 className="text-[12px] font-bold uppercase tracking-wide text-ink/40">Previously Uploaded</h3>
            <div className="flex gap-4 w-full flex-wrap">
              {prevResumes.slice(0, 4).map(resume => {
                const isSelected = selectedResumeId === resume.id && !uploadedFile;
                return (
                  <motion.div
                    key={resume.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { selectResume(resume.id); setUploadedFile(null); }}
                    className={`flex-1 min-w-[140px] flex flex-col rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
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
                      <p className="text-[14px] font-semibold text-ink truncate leading-tight">{resume.name}</p>
                      <p className="text-[12px] text-ink/40 mt-1">
                        {resume.base_ats_score > 0 ? `ATS ${resume.base_ats_score}%` : 'Uploaded'}
                        {resume.created_at ? ` · ${new Date(resume.created_at).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* CTA Button */}
      <div className="w-full flex flex-col items-center mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="relative overflow-hidden w-full h-14 rounded-full bg-ink flex items-center justify-center transition-all cursor-pointer hover:shadow-[0_4px_16px_rgba(14,12,10,0.25)] hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {isAnalyzing && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-brand-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.3 }}
            />
          )}
          <span className="relative z-10 text-white font-semibold text-[15px] flex items-center gap-2">
            {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume →'}
          </span>
        </button>

        {isAnalyzing && stageLabel && (
          <p className="text-[13px] text-ink/50 mt-4 animate-pulse">{stageLabel}</p>
        )}
      </div>
    </div>
  );
}