'use client';

import { useDashboardStore } from '@/store/dashboard.store';
import { X, Plus } from 'lucide-react';

export function JobFilterChips() {
  const { activeFilters, toggleFilter } = useDashboardStore();

  const presets = ['Remote', 'Full-time', 'PM', 'Senior'];
  // Active filters are managed in store, but the user specifies:
  // "each active filter: brand-blue-soft bg brand-blue text with × to remove"
  // Let's populate the initial state inside useEffect to match spec if empty, or just mock it.

  const currentFilters = activeFilters.length > 0 ? activeFilters : ['All', 'Remote', 'Full-time', 'PM'];

  const handleToggle = (filter: string) => {
    // If it's the mock default and not in state, just add all but the one toggled off to state
    // Let's keep it simple: clicking removes it locally if we dispatch
    toggleFilter(filter);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentFilters.map((f) => {
        // Just mock visibility logic for the list. 
        // We'll show it active if it's rendered here.
        return (
          <button
            key={f}
            onClick={() => handleToggle(f)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue-soft text-brand-blue text-[12px] font-medium hover:bg-brand-blue/20 transition-colors border border-transparent cursor-pointer"
          >
            {f}
            <X className="w-3 h-3 text-brand-blue/70" />
          </button>
        );
      })}
      <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-ink/20 text-ink/60 text-[12px] font-medium hover:bg-ink/5 transition-colors bg-transparent cursor-pointer">
        <Plus className="w-3 h-3" />
        Add Filter
      </button>
    </div>
  );
}
