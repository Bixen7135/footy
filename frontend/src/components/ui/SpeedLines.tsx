'use client';

import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const scrollFast = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const scrollMedium = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const scrollSlow = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

interface SpeedLinesProps {
  color?: string;
  opacity?: number;
  lineCount?: number;
}

export default function SpeedLines({
  color = '#9EFF00',
  opacity = 0.3,
  lineCount = 15,
}: SpeedLinesProps) {
  const lines = Array.from({ length: lineCount }, (_, i) => ({
    top: `${(i / lineCount) * 100}%`,
    speed: i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'medium' : 'slow',
    width: i % 3 === 0 ? '40%' : i % 3 === 1 ? '30%' : '20%',
  }));

  const getAnimation = (speed: string) => {
    switch (speed) {
      case 'fast':
        return `${scrollFast} 1s linear infinite`;
      case 'medium':
        return `${scrollMedium} 1.5s linear infinite`;
      case 'slow':
        return `${scrollSlow} 2s linear infinite`;
      default:
        return 'none';
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {lines.map((line, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: '100%',
            top: line.top,
            width: line.width,
            height: '2px',
            bgcolor: color,
            opacity,
            animation: getAnimation(line.speed),
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              display: 'none',
            },
          }}
        />
      ))}
    </Box>
  );
}
