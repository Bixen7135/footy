'use client';

import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';
import { useCircularText } from '@/hooks/useCircularText';
import ReplayIcon from '@mui/icons-material/Replay';

const MotionBox = motion(Box);

const rotate360 = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function CircularHeroSection() {
  const circularPositions = useCircularText('RETURNS', {
    radius: 180,
    startAngle: -90,
    direction: 'clockwise',
  });

  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '400px', md: '500px' },
          }}
        >
          {/* Circular text */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '300px', md: '360px' },
              height: { xs: '300px', md: '360px' },
            }}
          >
            {circularPositions.map((pos, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`,
                  transformOrigin: 'center',
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: 'secondary.main',
                  lineHeight: 1,
                }}
              >
                {pos.char}
              </MotionBox>
            ))}

            {/* Center rotating arrow */}
            <MotionBox
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'secondary.main',
                animation: `${rotate360} 8s linear infinite`,
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
            >
              <ReplayIcon sx={{ fontSize: { xs: 80, md: 120 } }} />
            </MotionBox>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
