'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { Check } from 'lucide-react';
import React from 'react';

const steps = [
  { num: 1, label: 'Job Description' },
  { num: 2, label: 'Upload Resume' },
  { num: 3, label: 'Review Keywords' },
  { num: 4, label: 'Download' }
];

export function StepperNav() {
  const currentStep = useDashboardStore((state) => state.tailorStep);

  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b border-border py-5 px-8 flex justify-center items-center shrink-0">
      <div className="hidden sm:flex items-start w-full max-w-3xl justify-between relative">
        <div className="absolute top-5 left-0 w-full h-[2px] -z-10 flex">
          {steps.map((_, i) => {
            if (i === steps.length - 1) return null;
            const isCompleted = currentStep > i + 1;
            return (
              <div 
                key={i} 
                className={`flex-1 h-full ${
                  isCompleted ? 'bg-ink' : 'bg-transparent border-t-2 border-dashed border-ink/20'
                }`} 
              />
            );
          })}
        </div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                isCompleted 
                  ? 'bg-ink text-white' 
                  : isActive 
                    ? 'bg-brand-blue text-white shadow-[0_0_0_4px_rgba(26,86,255,0.2)]'
                    : 'bg-white text-ink/30 border-2 border-ink/20'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : step.num}
              </div>
              <span className={`text-xs ${isActive || isCompleted ? 'text-ink' : 'text-ink/50'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile fallback */}
      <div className="flex sm:hidden w-full items-center">
        {currentStep > 1 && (
          <span className="text-sm text-ink/50 mr-4">←</span>
        )}
        <span className="text-sm font-semibold">Step {currentStep} of {steps.length}</span>
      </div>
    </div>
  );
}
