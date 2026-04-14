import React from 'react';

interface BulletCompareProps {
  original: string;
  rewritten: string;
  keyword: string;
}

export function BulletCompare({ original, rewritten, keyword }: BulletCompareProps) {
  // Simple highlight function (case insensitive)
  const highlightKeyword = (text: string, kw: string) => {
    if (!kw) return text;
    const regex = new RegExp(`(${kw})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-brand-blue">{part}</span> : part
    );
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border">
      <div className="bg-ink/5 p-4 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-wide text-ink/30 block mb-1">Original</span>
        <p className="text-[13px] text-ink/55 m-0 p-0 leading-relaxed">{original}</p>
      </div>
      <div className="bg-ink/5 opacity-80 p-4">
        {/* We use opacity-80 or a slightly lighter bg conceptually for ink/8 */}
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-green block mb-1">✓ Resynced</span>
        <p className="text-[13px] text-ink m-0 p-0 leading-relaxed">
          {highlightKeyword(rewritten, keyword)}
        </p>
      </div>
    </div>
  );
}
