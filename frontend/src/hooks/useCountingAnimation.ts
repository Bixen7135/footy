'use client';

import { useEffect, useState } from 'react';
import { useSpring, useMotionValue, useTransform, animate } from 'framer-motion';

export function useCountingAnimation(
  target: number,
  duration: number = 1.5,
  start: boolean = false
) {
  const [hasStarted, setHasStarted] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (start && !hasStarted) {
      setHasStarted(true);
      const animation = animate(count, target, {
        duration,
        ease: [0.22, 1, 0.36, 1], // Custom easing for spring-like effect
      });

      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayValue(latest);
      });

      return () => {
        animation.stop();
        unsubscribe();
      };
    }
  }, [start, hasStarted, count, rounded, target, duration]);

  return displayValue;
}
