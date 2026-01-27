import { useMemo } from 'react';

interface CircularTextPosition {
  char: string;
  x: number;
  y: number;
  rotation: number;
}

interface CircularTextConfig {
  radius?: number;
  startAngle?: number;
  direction?: 'clockwise' | 'counterclockwise';
}

export function useCircularText(
  text: string,
  config: CircularTextConfig = {}
): CircularTextPosition[] {
  const {
    radius = 150,
    startAngle = -90,
    direction = 'clockwise',
  } = config;

  const positions = useMemo(() => {
    const chars = text.split('');
    const angleStep = (360 / chars.length) * (direction === 'clockwise' ? 1 : -1);

    return chars.map((char, index) => {
      const angle = startAngle + angleStep * index;
      const radian = (angle * Math.PI) / 180;

      return {
        char,
        x: radius * Math.cos(radian),
        y: radius * Math.sin(radian),
        rotation: angle + 90, // Rotate char to be tangent to circle
      };
    });
  }, [text, radius, startAngle, direction]);

  return positions;
}
