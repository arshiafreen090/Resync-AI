export function JobStatsStrip() {
  const stats = [
    { label: 'Applied', count: 12, classes: 'bg-brand-blue-soft text-brand-blue' },
    { label: 'Interviews', count: 3, classes: 'bg-brand-green/10 text-brand-green' },
    { label: 'Offers', count: 1, classes: 'bg-green-800 text-white' }, // "green dark bg white text"
    { label: 'Saved', count: 8, classes: 'bg-ink/5 text-ink/60' }
  ];

  return (
    <div className="flex flex-row flex-wrap gap-4 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className={`flex items-center justify-between px-5 py-3 rounded-full flex-1 min-w-[120px] ${stat.classes}`}
        >
          <span className="text-[14px] font-semibold">{stat.label}</span>
          <span className="text-[15px] font-bold">{stat.count}</span>
        </div>
      ))}
    </div>
  );
}
