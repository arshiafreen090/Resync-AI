'use client';

import { SettingsSideNav } from './SettingsSideNav';
import { ProfileSection } from './ProfileSection';
import { PlanSection } from './PlanSection';
import { useDashboardStore } from '@/store/dashboard.store';
import { useState } from 'react';

function NotificationsSection() {
  const [toggles, setToggles] = useState({
    emailMatches: true,
    reminders: true,
    weeklyReport: false,
    productUpdates: false
  });

  const Toggle = ({ checked, onChange, label, desc }: any) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-ink">{label}</span>
        <span className="text-[12px] text-ink/40">{desc}</span>
      </div>
      <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${checked ? 'bg-brand-blue' : 'bg-ink/20'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <h2 className="font-serif italic text-2xl text-ink">Notifications</h2>
      
      <div className="w-full bg-white rounded-2xl border border-border flex flex-col px-6 shadow-sm divide-y divide-border">
        <Toggle 
          label="Email job matches" 
          desc="Get weekly highly matched jobs"
          checked={toggles.emailMatches}
          onChange={() => setToggles(p => ({...p, emailMatches: !p.emailMatches}))}
        />
        <Toggle 
          label="Tailoring reminders" 
          desc="Reminders to finish drafts"
          checked={toggles.reminders}
          onChange={() => setToggles(p => ({...p, reminders: !p.reminders}))}
        />
        <Toggle 
          label="Weekly ATS report" 
          desc="Score trends for the week"
          checked={toggles.weeklyReport}
          onChange={() => setToggles(p => ({...p, weeklyReport: !p.weeklyReport}))}
        />
        <Toggle 
          label="Product updates" 
          desc="New features and updates"
          checked={toggles.productUpdates}
          onChange={() => setToggles(p => ({...p, productUpdates: !p.productUpdates}))}
        />
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <h2 className="font-serif italic text-2xl text-ink">Security</h2>
      
      <div className="flex flex-col gap-5 w-full">
        <h3 className="text-[16px] font-semibold text-ink mb-1">Change Password</h3>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">Current Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">New Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink/60">Confirm New Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white border border-border rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-brand-blue transition-all" />
        </div>
      </div>

      <button className="h-12 px-6 rounded-full bg-ink text-white font-semibold text-[14px] cursor-pointer hover:bg-brand-blue hover:-translate-y-[1px] transition-all w-fit mt-4">
        Update Password
      </button>
    </div>
  );
}

function HelpSection() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <h2 className="font-serif italic text-2xl text-ink">Help & Support</h2>
      
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-semibold text-ink text-[16px]">Need assistance?</h3>
          <p className="text-[14px] text-ink/60">Join our Discord community or report a bug directly to our team.</p>
          <div className="flex gap-4 mt-2">
            <button className="px-5 py-2.5 rounded-full bg-brand-purple text-white text-[13px] font-semibold hover:bg-brand-purple/90 transition-colors border-none cursor-pointer">
              Join Discord
            </button>
            <button className="px-5 py-2.5 rounded-full border border-ink/20 text-ink text-[13px] font-semibold hover:bg-ink/5 transition-colors bg-transparent cursor-pointer">
              Report a bug
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-semibold text-ink text-[16px]">FAQ</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-medium text-ink text-[14px]">How does the ATS score work?</p>
              <p className="text-[13px] text-ink/60 mt-1">It cross-references your current text with the semantic context of the job description.</p>
            </div>
            <div>
              <p className="font-medium text-ink text-[14px]">Can I download older versions?</p>
              <p className="text-[13px] text-ink/60 mt-1">Yes, check the "My Resumes" tab to access all previously tailored files.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsLayout() {
  const { activeSettingsSection } = useDashboardStore();

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full">
      <SettingsSideNav />
      
      <div className="flex-1">
        {activeSettingsSection === 'Profile' && <ProfileSection />}
        {activeSettingsSection === 'Plan & Billing' && <PlanSection />}
        {activeSettingsSection === 'Notifications' && <NotificationsSection />}
        {activeSettingsSection === 'Security' && <SecuritySection />}
        {activeSettingsSection === 'Help & Support' && <HelpSection />}
      </div>
    </div>
  );
}
