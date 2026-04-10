'use client';

export function PlanSection() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <h2 className="font-serif italic text-2xl text-ink">Plan & Billing</h2>
      
      {/* Current Plan Card */}
      <div className="w-full bg-ink text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif italic text-3xl">Pro Plan</h3>
          <span className="text-[16px] text-white/70 font-medium">$19 / month</span>
          <span className="text-[13px] text-white/40 mt-1">Renews on May 10, 2026</span>
        </div>
        <button className="px-5 py-2.5 rounded-full border border-white text-white text-[13px] font-semibold hover:bg-white hover:text-ink transition-colors cursor-pointer bg-transparent">
          Manage Subscription
        </button>
      </div>

      {/* Usage */}
      <div className="w-full bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-5">
        <h3 className="text-[16px] font-semibold text-ink">Usage This Month</h3>
        
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-ink/60">Tailoring Sessions</span>
            <span className="font-medium text-ink">8 / ∞</span>
          </div>
          <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-green w-full" />
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 w-full mt-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-ink/60">Cover Letters</span>
            <span className="font-medium text-ink">3 / ∞</span>
          </div>
          <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
