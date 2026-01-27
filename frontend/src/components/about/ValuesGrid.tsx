'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RecyclingIcon from '@mui/icons-material/Recycling';

const MotionPaper = motion(Paper);

interface Value {
  icon: ReactNode;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: 'Authenticity',
    description:
      'Every product we sell is 100% authentic. We partner directly with brands and authorized distributors to guarantee quality.',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Fast Shipping',
    description:
      "We know you want your new kicks fast. That's why we offer express shipping options and same-day processing.",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Customer First',
    description:
      'Our dedicated support team is here to help with sizing, returns, and any questions you might have.',
  },
  {
    icon: <RecyclingIcon sx={{ fontSize: 40 }} />,
    title: 'Sustainability',
    description:
      "We're committed to reducing our environmental footprint through eco-friendly packaging and carbon-neutral shipping.",
  },
];

// Random entrance order for cards
const shuffledIndices = [2, 0, 3, 1];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: shuffledIndices.indexOf(i) * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ValuesGrid() {
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
          Our Values
        </Typography>

        {/* Offset grid layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            position: 'relative',
          }}
        >
          {VALUES.map((value, index) => (
            <MotionPaper
              key={value.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                textAlign: 'center',
                border: 1,
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s ease-out',
                // Offset positioning for visual interest
                ...(index === 1 && {
                  mt: { xs: 0, md: 4 },
                }),
                ...(index === 3 && {
                  mt: { xs: 0, md: -2 },
                }),
                // Green flood background
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'secondary.main',
                  transform: 'scaleY(0)',
                  transformOrigin: 'bottom',
                  transition: 'transform 0.4s ease-out',
                  zIndex: 0,
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(158, 255, 0, 0.2)',
                  '@media (prefers-reduced-motion: reduce)': {
                    transform: 'none',
                  },
                  '&::after': {
                    transform: 'scaleY(1)',
                  },
                  '& .MuiTypography-root, & .MuiSvgIcon-root': {
                    color: 'secondary.contrastText',
                  },
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ color: 'grey.700', mb: 2, transition: 'color 0.3s ease' }}>
                  {value.icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ transition: 'color 0.3s ease' }}
                >
                  {value.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ transition: 'color 0.3s ease' }}
                >
                  {value.description}
                </Typography>
              </Box>
            </MotionPaper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
