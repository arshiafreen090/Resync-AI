'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { StepperNav } from './StepperNav';
import { Step1JobDescription } from './steps/Step1JobDescription';
import { Step2UploadResume } from './steps/Step2UploadResume';
import { Step3ReviewKeywords } from './steps/Step3ReviewKeywords';
import { Step4Download } from './steps/Step4Download';
import { AnimatePresence, motion } from 'framer-motion';

const fadeUpVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
};

export function TailorWizard() {
  const tailorStep = useDashboardStore((state) => state.tailorStep);

  return (
    <div className="flex flex-col h-full w-full relative">
      <StepperNav />
      <div className="flex-1 overflow-y-auto p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tailorStep}
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full max-w-5xl mx-auto w-full"
          >
            {tailorStep === 1 && <Step1JobDescription />}
            {tailorStep === 2 && <Step2UploadResume />}
            {tailorStep === 3 && <Step3ReviewKeywords />}
            {tailorStep === 4 && <Step4Download />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
