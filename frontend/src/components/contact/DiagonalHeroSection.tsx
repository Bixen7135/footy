'use client';

import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';
import GridOverlay from '../ui/GridOverlay';

const MotionBox = motion(Box);

const gridRotate = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(0.5deg); }
`;

export default function DiagonalHeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '60vh', md: '70vh' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Diagonal divider */}
      <MotionBox
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '120%',
            height: '200%',
            bgcolor: 'secondary.main',
            transform: 'rotate(-15deg)',
            transformOrigin: 'center',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '120%',
            height: '200%',
            bgcolor: 'grey.900',
            transform: 'rotate(-15deg)',
            transformOrigin: 'center',
            clipPath: 'polygon(0 0, 0 100%, 50% 100%, 50% 0)',
            zIndex: 1,
          },
        }}
      />

      {/* Grid overlay - Black side */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '50%',
          overflow: 'hidden',
          zIndex: 2,
          animation: `${gridRotate} 20s ease-in-out infinite`,
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
        <GridOverlay color="rgba(255, 255, 255, 0.05)" opacity={0.5} />
      </MotionBox>

      {/* Grid overlay - Green side */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '50%',
          overflow: 'hidden',
          zIndex: 2,
          animation: `${gridRotate} 20s ease-in-out infinite`,
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
        <GridOverlay color="rgba(0, 0, 0, 0.1)" opacity={0.3} />
      </MotionBox>

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, md: 0 },
          }}
        >
          {/* "GET IN" on black side */}
          <MotionBox
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{ flex: 1, textAlign: { xs: 'center', md: 'right' }, pr: { xs: 0, md: 4 } }}
          >
            <Box
              component="h1"
              sx={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 900,
                fontSize: { xs: '4rem', sm: '5rem', md: '6.5rem' },
                lineHeight: 0.9,
                color: 'secondary.main',
                m: 0,
              }}
            >
              GET IN
            </Box>
          </MotionBox>

          {/* "TOUCH" on green side */}
          <MotionBox
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, pl: { xs: 0, md: 4 } }}
          >
            <Box
              component="h1"
              sx={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 900,
                fontSize: { xs: '4rem', sm: '5rem', md: '6.5rem' },
                lineHeight: 0.9,
                color: 'secondary.contrastText',
                m: 0,
              }}
            >
              TOUCH
            </Box>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}
