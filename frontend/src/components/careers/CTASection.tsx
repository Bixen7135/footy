'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

const MotionBox = motion(Box);

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.015); }
`;

export default function CTASection() {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        animation: `${pulse} 2s ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: 'secondary.contrastText',
                mb: 3,
              }}
            >
              Don&apos;t See Your Role?
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: 'secondary.contrastText',
                mb: 4,
                opacity: 0.9,
              }}
            >
              We&apos;re always interested in meeting talented people. Send us your resume and
              tell us how you can contribute to Footy.
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
          >
            <Button
              variant="outlined"
              size="large"
              href="mailto:careers@footy.com"
              sx={{
                borderColor: 'secondary.contrastText',
                color: 'secondary.contrastText',
                borderWidth: 2,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                transition: 'all 0.4s ease',
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'secondary.contrastText',
                  color: 'secondary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  '@media (prefers-reduced-motion: reduce)': {
                    transform: 'none',
                  },
                },
              }}
            >
              Contact Us
            </Button>
          </MotionBox>
        </Box>

        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            filter: 'blur(40px)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.03)',
            filter: 'blur(50px)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
      </Container>
    </Box>
  );
}
