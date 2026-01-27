'use client';

import { useState, useEffect } from 'react';

interface GlitchConfig {
  iterations?: number;
  duration?: number;
  colors?: string[];
}

export function useGlitchEffect(
  trigger: boolean,
  config: GlitchConfig = {}
) {
  const {
    iterations = 5,
    duration = 300,
    colors = ['#9EFF00', '#ffffff', '#9EFF00'],
  } = config;

  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger && !isGlitching) {
      setIsGlitching(true);
      const interval = duration / (iterations * colors.length);
      let count = 0;

      const glitchInterval = setInterval(() => {
        const colorIndex = count % colors.length;
        setCurrentColor(colors[colorIndex]);
        count++;

        if (count >= iterations * colors.length) {
          clearInterval(glitchInterval);
          setCurrentColor(colors[0]);
          setIsGlitching(false);
        }
      }, interval);

      return () => clearInterval(glitchInterval);
    }
  }, [trigger, isGlitching, iterations, duration, colors]);

  return { currentColor, isGlitching };
}
