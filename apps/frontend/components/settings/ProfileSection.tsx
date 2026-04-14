'use client';

import { MOCK_USER } from '@/lib/mock-data';

export function ProfileSection() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <h2 className="font-serif italic text-2xl text-ink">Profile</h2>
      
      <div className="flex flex-col gap-4">
        <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center text-white font-serif text-3xl">
          {MOCK_USER.avatarInitial}
        </div>
        <span className="text-[12px] text-brand-blue underline cursor-pointer w-fit">
          Change Photo
        </span>
      </div>

      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">Full Name</label>
          <input 
            type="text" 
            defaultValue={MOCK_USER.name}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">Email Address</label>
          <input 
            type="email" 
            defaultValue={MOCK_USER.email}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">Target Role</label>
          <input 
            type="text" 
            defaultValue={MOCK_USER.targetRole}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">LinkedIn URL</label>
          <input 
            type="url" 
            placeholder="https://linkedin.com/in/..."
            className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder:text-ink/30"
          />
        </div>
      </div>

      <button className="h-12 px-6 rounded-full bg-ink text-white font-semibold text-[14px] cursor-pointer hover:bg-brand-blue hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] transition-all w-fit mt-4">
        Save Changes
      </button>
    </div>
  );
}
