'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';

const MotionBox = motion(Box);

interface Benefit {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: <HealthAndSafetyIcon sx={{ fontSize: 80 }} />,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your family.',
    bgColor: 'secondary.main',
    textColor: 'secondary.contrastText',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 80 }} />,
    title: 'Growth',
    description: 'Learning budget, career development programs, and promotion opportunities.',
    bgColor: 'grey.900',
    textColor: 'white',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 80 }} />,
    title: 'Culture',
    description: 'Inclusive environment, team events, and a collaborative work atmosphere.',
    bgColor: 'secondary.main',
    textColor: 'secondary.contrastText',
  },
  {
    icon: <WorkIcon sx={{ fontSize: 80 }} />,
    title: 'Flexibility',
    description: 'Remote-friendly policies, flexible hours, and generous PTO.',
    bgColor: 'grey.900',
    textColor: 'white',
  },
];

const blockVariants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: (i: number) => ({
    opacity: 1,
    rotateY: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function BenefitsBlocks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: 'center',
            mb: 6,
          }}
        >
          Why Work With Us?
        </Typography>

        <Grid container spacing={0}>
          {BENEFITS.map((benefit, index) => (
            <Grid item xs={12} sm={6} key={benefit.title}>
              <MotionBox
                custom={index}
                variants={blockVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                sx={{
                  bgcolor: benefit.bgColor,
                  color: benefit.textColor,
                  p: { xs: 4, md: 6 },
                  minHeight: { xs: 280, md: 320 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.6s ease-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    zIndex: 2,
                    '@media (prefers-reduced-motion: reduce)': {
                      transform: 'scale(1.02)',
                    },
                    '& .benefit-icon': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }}
              >
                <Box
                  className="benefit-icon"
                  sx={{
                    mb: 3,
                    transition: 'transform 0.6s ease-in-out',
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                    },
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 2,
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    lineHeight: 1.6,
                    maxWidth: '300px',
                    opacity: 0.9,
                  }}
                >
                  {benefit.description}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
