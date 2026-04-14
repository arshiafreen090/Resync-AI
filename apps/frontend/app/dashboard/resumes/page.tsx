import { ResumeTypeExplainer } from '@/components/resumes/ResumeTypeExplainer';
import { ResumeTabFilter } from '@/components/resumes/ResumeTabFilter';
import { ResumeSearchBar } from '@/components/resumes/ResumeSearchBar';
import { ResumeGrid } from '@/components/resumes/ResumeGrid';

export default function ResumesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 pb-32">
      <ResumeTypeExplainer />
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mt-4">
        <ResumeTabFilter />
        <div className="w-full sm:w-[320px]">
          <ResumeSearchBar />
        </div>
      </div>
      <ResumeGrid />
    </div>
  );
}
