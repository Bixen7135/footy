'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0-100
  color?: string;
  backgroundColor?: string;
  animate?: boolean;
  duration?: number;
}

export default function CircularProgress({
  size = 120,
  strokeWidth = 8,
  progress = 100,
  color = '#9EFF00',
  backgroundColor = 'rgba(158, 255, 0, 0.1)',
  animate = true,
  duration = 1.5,
}: CircularProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(animate ? 0 : progress);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100);
      return () => clearTimeout(timer);
    }
  }, [animate, progress]);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <MotionBox
          component="circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
    </Box>
  );
}
