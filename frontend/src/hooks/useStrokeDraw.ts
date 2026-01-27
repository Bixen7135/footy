import { useEffect, useState } from 'react';

interface StrokeDrawConfig {
  duration?: number;
  delay?: number;
}

export function useStrokeDraw(trigger: boolean, config: StrokeDrawConfig = {}) {
  const { duration = 1.5, delay = 0 } = config;
  const [pathLength, setPathLength] = useState(1);

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        setPathLength(0);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  return {
    strokeDasharray: 1,
    strokeDashoffset: pathLength,
    transition: `stroke-dashoffset ${duration}s ease-in-out`,
  };
}
