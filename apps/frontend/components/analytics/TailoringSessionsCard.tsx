import { MOCK_ANALYTICS } from '@/lib/mock-data';

export function TailoringSessionsCard() {
  const data = MOCK_ANALYTICS.tailoringSessions;

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <span className="text-[12px] font-bold uppercase tracking-wide text-ink/40 block">Tailoring Sessions</span>
      
      <div className="flex flex-col">
        <span className="font-serif italic text-[48px] text-ink leading-none">8</span>
        <span className="text-[13px] text-ink/40 mt-1">Resumes tailored this month</span>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {data.map((session, i) => (
          <div key={i} className="flex items-center justify-between text-[14px]">
            <div className="flex items-center gap-3">
              <span className="font-medium text-ink">{session.company}</span>
              <span className="text-[12px] text-ink/40">{session.date}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${session.colorClass}/10 ${session.colorClass.replace('bg-', 'text-')}`}>
              {session.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
