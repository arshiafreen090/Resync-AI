export function MiniResumeThumb() {
  return (
    <div className="w-[100px] h-[140px] bg-white border border-border rounded-lg overflow-hidden shrink-0 flex flex-col p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Top Name Bar */}
      <div className="w-[60%] h-2 bg-ink/20 rounded-sm mb-3 mx-auto" />
      
      {/* Contact info mockup */}
      <div className="flex gap-1 justify-center mb-4">
        <div className="w-4 h-1 bg-ink/10 rounded-sm" />
        <div className="w-4 h-1 bg-ink/10 rounded-sm" />
        <div className="w-4 h-1 bg-ink/10 rounded-sm" />
      </div>

      {/* Section 1 */}
      <div className="w-full h-[1px] bg-ink/10 mb-2" />
      <div className="w-[40%] h-1.5 bg-ink/20 rounded-sm mb-2" />
      <div className="w-full h-1 bg-ink/10 rounded-sm mb-1" />
      <div className="w-[90%] h-1 bg-ink/10 rounded-sm mb-1" />
      <div className="w-[95%] h-1 bg-ink/10 rounded-sm mb-3" />

      {/* Section 2 */}
      <div className="w-full h-[1px] bg-ink/10 mb-2" />
      <div className="w-[30%] h-1.5 bg-ink/20 rounded-sm mb-2" />
      <div className="w-[85%] h-1 bg-ink/10 rounded-sm mb-1" />
      <div className="w-full h-1 bg-ink/10 rounded-sm mb-1" />
      <div className="w-[70%] h-1 bg-ink/10 rounded-sm mb-1" />
    </div>
  );
}
