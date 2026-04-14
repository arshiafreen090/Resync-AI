'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide entirely on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setDotPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateRing = () => {
      setRingPos((prev) => ({
        x: lerp(prev.x, dotPos.x, 0.12),
        y: lerp(prev.y, dotPos.y, 0.12),
      }));
      animationFrameId = requestAnimationFrame(updateRing);
    };
    
    updateRing();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotPos, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-brand-blue rounded-full pointer-events-none z-[9999] mix-blend-multiply transition-transform duration-100 ease-out hidden md:block"
        style={{ 
          transform: `translate3d(${dotPos.x - 5}px, ${dotPos.y - 5}px, 0) scale(${isHovered ? 0.5 : 1})`,
        }} 
      />
      <div 
        className="fixed top-0 left-0 w-[36px] h-[36px] border border-brand-blue/40 rounded-full pointer-events-none z-[9999] mix-blend-multiply transition-transform duration-100 ease-out hidden md:block"
        style={{ 
          transform: `translate3d(${ringPos.x - 18}px, ${ringPos.y - 18}px, 0) scale(${isHovered ? 1.5 : 1})`,
        }} 
      />
    </>
  );
}
