'use client';

import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import SpeedLines from '../ui/SpeedLines';

const MotionBox = motion(Box);

export default function VelocityHeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      {/* Speed lines background */}
      <SpeedLines color="#9EFF00" opacity={0.2} lineCount={20} />

      <Container maxWidth="lg">
        <MotionBox
          initial={{ x: -100, opacity: 0, filter: 'blur(10px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <Box
            component="h1"
            sx={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 900,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              letterSpacing: { xs: '0.2em', md: '0.4em' },
              lineHeight: 1,
              color: 'text.primary',
              textTransform: 'uppercase',
              m: 0,
            }}
          >
            SHIPPING
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
