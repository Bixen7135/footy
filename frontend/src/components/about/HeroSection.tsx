'use client';

import React from 'react';
import { Box, Container, Typography, type TypographyProps } from '@mui/material';
import { motion, type MotionProps } from 'framer-motion';
import NoiseTexture from '../ui/NoiseTexture';

const MotionBox = motion(Box);

const MotionTypography = motion(Typography) as React.ComponentType<
  TypographyProps & MotionProps & { component?: React.ElementType }
>;

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.05,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const statsCardVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 1.0 + i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface HeroSectionProps {
  stats?: Array<{ value: string; label: string }>;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const title = 'ABOUT FOOTY';
  const description =
    'Your destination for premium footwear. We believe everyone deserves to step out in style without compromising on quality or comfort.';

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '60vh', md: '70vh' },
        bgcolor: 'secondary.main',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        py: { xs: 6, md: 8 },
      }}
    >
      <NoiseTexture opacity={0.15} animate />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '60%' } }}>
            <Box sx={{ mb: 3, overflow: 'hidden' }}>
              {title.split('').map((char, index) => (
                <MotionTypography
                  key={index}
                  component="span"
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 900,
                    fontSize: { xs: '3.5rem', sm: '5rem', md: '6.5rem' },
                    lineHeight: 0.85,
                    letterSpacing: '-0.06em',
                    color: 'secondary.contrastText',
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </MotionTypography>
              ))}
            </Box>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.9,
                  color: 'secondary.contrastText',
                  maxWidth: '40ch',
                  opacity: 0.9,
                }}
              >
                {description}
              </Typography>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: -2 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              sx={{
                mt: 4,
                display: { xs: 'none', md: 'inline-block' },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'secondary.contrastText',
                  opacity: 0.7,
                  display: 'block',
                  transform: 'rotate(-2deg)',
                }}
              >
                EST. 2025
              </Typography>
            </MotionBox>
          </Box>

          {stats && stats.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {stats.slice(0, 2).map((stat, index) => (
                <MotionBox
                  key={stat.label}
                  custom={index}
                  variants={statsCardVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: { xs: 120, md: 140 },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: '#9EFF00',
                      mb: 0.5,
                      fontSize: { xs: '1.75rem', md: '2rem' },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      opacity: 0.8,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </MotionBox>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            width: 2,
            height: 40,
            bgcolor: 'secondary.contrastText',
            opacity: 0.6,
            animation: 'scroll-indicator 2s ease-in-out infinite',
            '@keyframes scroll-indicator': {
              '0%, 100%': { transform: 'translateY(0)', opacity: 0.6 },
              '50%': { transform: 'translateY(10px)', opacity: 0.3 },
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        />
      </MotionBox>
    </Box>
  );
}
