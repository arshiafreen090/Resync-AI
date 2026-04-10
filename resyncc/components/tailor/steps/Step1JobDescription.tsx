'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';
import { MOCK_JD } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';

export function Step1JobDescription() {
  const [tab, setTab] = useState<'paste' | 'url'>('paste');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const { jobDescription, setJobDescription, setTailorStep } = useDashboardStore();

  const handleNext = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setTailorStep(2);
    }, 1500);
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full pt-8 pb-16">
      <h2 className="font-serif italic text-[40px] text-ink mb-2">What job are you targeting?</h2>
      <p className="text-base text-ink/55 mb-10">Paste the job description you want to tailor your resume for.</p>

      {/* Tabs */}
      <div className="flex w-fit bg-ink/5 rounded-full p-1 mb-8 relative">
        <button 
          onClick={() => setTab('paste')}
          className={`relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            tab === 'paste' ? 'text-white' : 'text-ink/50 hover:text-ink'
          }`}
        >
          Paste Text
        </button>
        <button 
          onClick={() => setTab('url')}
          className={`relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            tab === 'url' ? 'text-white' : 'text-ink/50 hover:text-ink'
          }`}
        >
          Enter URL
        </button>
        
        {/* Animated Background */}
        <div 
          className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-ink rounded-full transition-transform duration-300 ease-out z-0"
          style={{ transform: tab === 'paste' ? 'translateX(0)' : 'translateX(100%)' }}
        />
      </div>

      {tab === 'paste' ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="bg-white rounded-[20px] border border-border p-8 shadow-sm">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — requirements, responsibilities, preferred qualifications, everything..."
              className="w-full min-h-[220px] resize-none outline-none border-none bg-transparent font-sans text-sm text-ink placeholder:text-ink/30"
              maxLength={5000}
            />
            <div className="w-full flex justify-end">
              <span className="text-xs text-ink/30">{jobDescription.length} / 5000</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={() => setJobDescription(MOCK_JD)}
              className="text-[13px] text-brand-blue underline hover:text-brand-blue/80 bg-transparent border-none cursor-pointer"
            >
              Try an example
            </button>

            <button
              onClick={handleNext}
              disabled={!jobDescription || isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                !jobDescription 
                  ? 'bg-ink/10 text-ink/40 cursor-not-allowed' 
                  : 'bg-ink text-white hover:bg-brand-blue hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] cursor-pointer'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Extract Keywords →'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          <div className="flex gap-4">
            <input 
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://company.com/careers/job-123"
              className="flex-1 bg-white border border-border rounded-xl px-4 py-3 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-shadow font-sans text-sm"
            />
            <button
              onClick={handleNext}
              disabled={!urlInput || isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 shrink-0 ${
                !urlInput 
                  ? 'bg-ink/10 text-ink/40 cursor-not-allowed' 
                  : 'bg-ink text-white hover:bg-brand-blue hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] cursor-pointer'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Fetch & Extract →'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
