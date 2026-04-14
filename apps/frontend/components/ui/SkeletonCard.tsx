export function SkeletonCard() {
  return (
    <div className="w-full bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-ink/10" />
        <div className="w-24 h-4 bg-ink/10 rounded-md" />
        <div className="ml-auto w-16 h-6 bg-ink/10 rounded-full" />
      </div>
      
      <div className="w-48 h-6 bg-ink/10 rounded-md mt-2" />
      
      <div className="flex gap-2 mb-2">
        <div className="w-16 h-4 bg-ink/10 rounded-md" />
        <div className="w-20 h-4 bg-ink/10 rounded-md" />
        <div className="w-14 h-4 bg-ink/10 rounded-md" />
      </div>

      <div className="w-32 h-4 bg-ink/10 rounded-md" />

      <div className="w-full h-[1px] bg-border my-2" />

      <div className="flex items-center justify-between">
        <div className="w-24 h-8 bg-ink/10 rounded-full" />
        <div className="w-32 h-8 bg-ink/10 rounded-full" />
      </div>
    </div>
  );
}
