'use client';

import { Job } from '@/lib/types';
import { useDashboardStore } from '@/store/dashboard.store';
import { Bookmark, MapPin, Briefcase, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function JobCard({ job }: { job: Job }) {
  const { savedJobIds, toggleSaveJob } = useDashboardStore();
  const isSaved = savedJobIds.includes(job.id);

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return 'bg-brand-green/10 text-brand-green border border-brand-green/20';
    if (pct >= 60) return 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20';
    return 'bg-brand-red/10 text-brand-red border border-brand-red/20';
  };

  const displaySkills = job.skills.slice(0, 4);
  const extraSkills = job.skills.length - 4;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(14,12,10,0.1)" }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-4 w-full"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${job.avatarColorClass} flex items-center justify-center text-white font-serif font-bold text-xl`}>
            {job.avatarInitial}
          </div>
          <span className="text-[14px] font-semibold text-ink">{job.companyName}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${getMatchColor(job.matchPercentage)}`}>
          {job.matchPercentage}% Match
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif italic text-[20px] text-ink leading-tight">{job.title}</h3>

      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 text-ink/50 text-[13px]">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </div>
        {job.fullTime && (
          <div className="flex items-center gap-1.5 text-ink/50 text-[13px]">
            <Briefcase className="w-3.5 h-3.5" />
            Full-time
          </div>
        )}
        {job.remote && (
          <div className="flex items-center gap-1.5 text-brand-blue text-[13px] font-medium">
            <Home className="w-3.5 h-3.5" />
            Remote
          </div>
        )}
      </div>

      {/* Salary & Date */}
      <div className="flex flex-col gap-1">
        <span className="text-brand-green text-[14px] font-semibold">{job.salary}</span>
        <span className="text-[11px] text-ink/30 font-medium">Posted {job.postedAt}</span>
      </div>

      {/* Skills Match */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <span className="text-[12px] text-ink/40 mr-1 font-medium">Matches:</span>
        {displaySkills.map(skill => (
          <span key={skill} className="px-2.5 py-1 bg-brand-blue-soft text-brand-blue rounded-full text-[11px] font-semibold">
            {skill}
          </span>
        ))}
        {extraSkills > 0 && (
          <span className="text-[11px] text-ink/30 font-medium">+{extraSkills} more</span>
        )}
      </div>

      <div className="w-full h-[1px] bg-border my-1" />

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 w-full">
        <button 
          onClick={() => toggleSaveJob(job.id)}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-full border text-[13px] font-medium transition-colors cursor-pointer ${
            isSaved 
              ? 'bg-brand-green/10 border-brand-green/20 text-brand-green' 
              : 'bg-transparent border-border text-ink hover:bg-ink/5'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save Job'}
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-ink text-white text-[13px] font-semibold transition-all hover:bg-brand-blue hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(26,86,255,0.4)] cursor-pointer border-none">
          Tailor & Apply →
        </button>
      </div>
    </motion.div>
  );
}
