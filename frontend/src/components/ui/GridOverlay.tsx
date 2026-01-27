'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { keyframes } from '@mui/system';

interface GridOverlayProps {
  gridSize?: number;
  opacity?: number;
  animate?: boolean;
  color?: string;
}

const gridRotate = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
`;

export default function GridOverlay({
  gridSize = 40,
  opacity = 0.03,
  animate = false,
  color = 'currentColor',
}: GridOverlayProps) {
  const gridStyles: SxProps<Theme> = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(to right, ${color} 1px, transparent 1px),
      linear-gradient(to bottom, ${color} 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    opacity,
    animation: animate
      ? `${gridRotate} 10s ease-in-out infinite alternate`
      : 'none',
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  };

  return <Box sx={gridStyles} aria-hidden="true" />;
}
