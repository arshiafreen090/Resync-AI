import { FileText, Wand2 } from 'lucide-react';

export function ResumeTypeExplainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-white rounded-2xl border border-border p-8 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <FileText className="w-8 h-8 text-ink" />
          <button className="px-5 py-2 rounded-full border border-ink text-ink text-[13px] font-semibold hover:bg-ink hover:text-white transition-colors cursor-pointer bg-transparent">
            + Create New
          </button>
        </div>
        <div>
          <h2 className="font-serif font-semibold text-[20px] text-ink mb-1">Base Resume</h2>
          <p className="text-[14px] text-ink/55 leading-relaxed">
            Your master resume containing all your experience. Upload these so they can be tailored to specific jobs.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Wand2 className="w-8 h-8 text-brand-blue" />
          <button className="px-5 py-2 rounded-full border-none bg-brand-blue-soft text-brand-blue text-[13px] font-semibold hover:bg-brand-blue/20 transition-colors cursor-pointer">
            + Select Base Resume
          </button>
        </div>
        <div>
          <h2 className="font-serif font-semibold text-[20px] text-ink mb-1">Job Tailored Resume</h2>
          <p className="text-[14px] text-ink/55 leading-relaxed">
            Resumes specifically rewritten and optimized by Resync AI to match a particular job description.
          </p>
        </div>
      </div>
    </div>
  );
}
