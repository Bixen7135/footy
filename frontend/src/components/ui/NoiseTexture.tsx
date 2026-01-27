'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { keyframes } from '@mui/system';

interface NoiseTextureProps {
  opacity?: number;
  animate?: boolean;
  blendMode?: string;
}

const noisePulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

export default function NoiseTexture({
  opacity = 0.15,
  animate = true,
  blendMode = 'multiply',
}: NoiseTextureProps) {
  const noiseStyles: SxProps<Theme> = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    backgroundSize: '200px 200px',
    opacity,
    mixBlendMode: blendMode,
    animation: animate
      ? `${noisePulse} 3s ease-in-out infinite`
      : 'none',
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  };

  return <Box sx={noiseStyles} aria-hidden="true" />;
}
