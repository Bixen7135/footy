import { useState, useEffect } from 'react';

interface FormGlitchConfig {
  iterations?: number;
  duration?: number;
  colors?: string[];
}

export function useFormGlitch(trigger: boolean, config: FormGlitchConfig = {}) {
  const {
    iterations = 8,
    duration = 500,
    colors = ['#9EFF00', '#ffffff', '#000000', '#9EFF00'],
  } = config;

  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger && !isGlitching) {
      setIsGlitching(true);
      let count = 0;
      const interval = setInterval(() => {
        const colorIndex = count % colors.length;
        setBackgroundColor(colors[colorIndex]);
        count++;

        if (count >= iterations) {
          clearInterval(interval);
          setBackgroundColor('transparent');
          setIsGlitching(false);
        }
      }, duration / iterations);

      return () => clearInterval(interval);
    }
  }, [trigger, isGlitching, iterations, duration, colors]);

  return { backgroundColor, isGlitching };
}
