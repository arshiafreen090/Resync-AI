import { MOCK_ANALYTICS } from '@/lib/mock-data';

export function ResumeInfoCard() {
  const data = MOCK_ANALYTICS;

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <h3 className="text-[16px] font-semibold text-ink">Resume Information</h3>

      <div className="flex flex-col gap-4">
        <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40">What for?</span>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-ink/40">Target Role:</span>
            <span className="font-medium text-ink">{data.targetRole}</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-ink/40">Target Industry:</span>
            <span className="font-medium text-ink">{data.targetIndustry}</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-ink/40">Experience Level:</span>
            <span className="font-medium text-ink">{data.experienceLevel}</span>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-border" />

      <div className="flex flex-col gap-4">
        <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40">Top Skills</span>
        <div className="flex flex-wrap gap-2">
          {data.topSkills.map(skill => (
            <span key={skill} className="bg-brand-blue-soft text-brand-blue rounded-full px-3 py-1 text-[12px] font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[1px] w-full bg-border" />

      <div className="flex flex-col gap-4">
        <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40">Top Jobs You Fit</span>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-brand-green">✓ Senior PM</span>
            <span className="text-ink/60">94% match</span>
          </div>
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-brand-green">✓ Product Lead</span>
            <span className="text-ink/60">88% match</span>
          </div>
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-brand-orange">◎ Engineering Manager</span>
            <span className="text-ink/60">71% match</span>
          </div>
        </div>
      </div>

    </div>
  );
}
