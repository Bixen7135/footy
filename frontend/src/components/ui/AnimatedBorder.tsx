'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion(Box);

interface AnimatedBorderProps {
  children: ReactNode;
  borderWidth?: number;
  borderColor?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  expandTo?: string | number;
  isExpanded?: boolean;
  duration?: number;
}

export default function AnimatedBorder({
  children,
  borderWidth = 8,
  borderColor = 'secondary.main',
  side = 'left',
  expandTo = '40px',
  isExpanded = false,
  duration = 0.5,
}: AnimatedBorderProps) {
  const sideStyles: Record<string, any> = {
    left: {
      left: 0,
      top: 0,
      bottom: 0,
      width: isExpanded ? expandTo : `${borderWidth}px`,
      height: '100%',
    },
    right: {
      right: 0,
      top: 0,
      bottom: 0,
      width: isExpanded ? expandTo : `${borderWidth}px`,
      height: '100%',
    },
    top: {
      top: 0,
      left: 0,
      right: 0,
      height: isExpanded ? expandTo : `${borderWidth}px`,
      width: '100%',
    },
    bottom: {
      bottom: 0,
      left: 0,
      right: 0,
      height: isExpanded ? expandTo : `${borderWidth}px`,
      width: '100%',
    },
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <MotionBox
        animate={sideStyles[side]}
        transition={{ duration, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          bgcolor: borderColor,
          zIndex: 1,
        }}
      />
      {children}
    </Box>
  );
}
