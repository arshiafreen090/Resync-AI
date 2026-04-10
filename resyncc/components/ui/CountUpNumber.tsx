'use client';

import { useEffect, useState } from 'react';

interface CountUpNumberProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function CountUpNumber({ to, duration = 1000, suffix = '', prefix = '' }: CountUpNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const update = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      
      const currentVal = Math.floor(easeOutCubic(percent) * to);
      setCount(currentVal);

      if (percent < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setCount(to);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [to, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}
