'use client';

import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import GridOverlay from '../ui/GridOverlay';
import StrokeText from '../ui/StrokeText';

const MotionBox = motion(Box);

export default function GridMeasurementHero() {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      {/* Measurement grid background */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <GridOverlay gridSize={10} opacity={0.05} color="#000000" />
      </MotionBox>

      {/* Ruler graphics */}
      <MotionBox
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '40px',
          bgcolor: 'secondary.main',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              right: 0,
              top: `${(i / 20) * 100}%`,
              width: i % 5 === 0 ? '20px' : '10px',
              height: '2px',
              bgcolor: 'secondary.contrastText',
            }}
          />
        ))}
      </MotionBox>

      <MotionBox
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40px',
          bgcolor: 'secondary.main',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: `${(i / 30) * 100}%`,
              height: i % 5 === 0 ? '20px' : '10px',
              width: '2px',
              bgcolor: 'secondary.contrastText',
            }}
          />
        ))}
      </MotionBox>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* SIZE */}
          <MotionBox
            initial={{ strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.4, duration: 1.5, ease: 'easeInOut' }}
            sx={{ mb: 2 }}
          >
            <StrokeText
              variant="h1"
              strokeWidth={4}
              strokeColor="#9EFF00"
              fillColor="transparent"
              sx={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 900,
                fontSize: { xs: '4rem', sm: '6rem', md: '7.5rem' },
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
              }}
            >
              SIZE
            </StrokeText>
          </MotionBox>

          {/* GUIDE */}
          <MotionBox
            initial={{ strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
          >
            <StrokeText
              variant="h1"
              strokeWidth={4}
              strokeColor="#9EFF00"
              fillColor="transparent"
              sx={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 900,
                fontSize: { xs: '4rem', sm: '6rem', md: '7.5rem' },
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
              }}
            >
              GUIDE
            </StrokeText>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}
