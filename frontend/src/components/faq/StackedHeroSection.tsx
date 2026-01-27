'use client';

import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const words = ['FREQUENTLY', 'ASKED', 'QUESTIONS'];

const wordVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function StackedHeroSection() {
  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          {/* Giant rotating "?" in background */}
          <MotionBox
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 0.1, rotate: -10 }}
            transition={{
              delay: 0.2,
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: { xs: '200px', md: '300px' },
              fontWeight: 900,
              color: 'secondary.main',
              fontFamily: 'var(--font-satoshi)',
              lineHeight: 1,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            ?
          </MotionBox>

          {/* Stacked text */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {words.map((word, index) => (
              <MotionBox
                key={word}
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: index === 2 ? 900 : 700,
                  fontSize:
                    index === 2
                      ? { xs: '3.5rem', sm: '5rem', md: '8.75rem' }
                      : { xs: '2rem', sm: '3rem', md: '3.75rem' },
                  color: index === 2 ? 'secondary.main' : 'white',
                  lineHeight: 0.9,
                  mb: index === 2 ? 0 : 1,
                }}
              >
                {word}
              </MotionBox>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
