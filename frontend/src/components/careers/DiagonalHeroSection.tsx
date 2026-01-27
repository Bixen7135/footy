'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';
import GridOverlay from '../ui/GridOverlay';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const diagonalOscillate = keyframes`
  0%, 100% { transform: rotate(25deg); }
  50% { transform: rotate(27deg); }
`;

export default function DiagonalHeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '70vh', md: '80vh' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Diagonal divider */}
      <MotionBox
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
            transform: 'rotate(26deg)',
            transformOrigin: 'center',
            animation: `${diagonalOscillate} 3s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '120%',
            height: '200%',
            bgcolor: 'grey.900',
            transform: 'rotate(26deg)',
            transformOrigin: 'center',
            clipPath: 'polygon(0 0, 0 100%, 50% 100%, 50% 0)',
            zIndex: 1,
          },
        }}
      />

      {/* Grid overlays */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '50%',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <GridOverlay color="rgba(255, 255, 255, 0.05)" opacity={0.5} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '50%',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <GridOverlay color="rgba(0, 0, 0, 0.1)" opacity={0.3} />
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left side - Black background area */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <MotionTypography
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              sx={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 900,
                fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                lineHeight: 0.9,
                color: 'secondary.main',
                mb: 2,
              }}
            >
              JOIN
            </MotionTypography>
            <MotionTypography
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: { xs: 'grey.900', md: 'white' },
              }}
            >
              OUR TEAM
            </MotionTypography>
          </Box>

          {/* Right side - Green background area */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'right' } }}>
            <MotionTypography
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: 'secondary.contrastText',
                maxWidth: { xs: '100%', md: '500px' },
                ml: { xs: 0, md: 'auto' },
                mb: 3,
              }}
            >
              Help us build the future of footwear retail. We&apos;re looking for passionate
              people who want to make a difference.
            </MotionTypography>

            <MotionButton
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.0,
                duration: 0.6,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              variant="contained"
              size="large"
              href="#open-positions"
              sx={{
                bgcolor: 'secondary.contrastText',
                color: 'secondary.main',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.900',
                  color: 'white',
                },
              }}
            >
              View Openings
            </MotionButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
