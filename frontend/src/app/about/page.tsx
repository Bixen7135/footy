'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import HeroSection from '@/components/about/HeroSection';
import StorySection from '@/components/about/StorySection';
import ValuesGrid from '@/components/about/ValuesGrid';
import StatsSection from '@/components/about/StatsSection';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function AboutPage() {
  const heroStats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '4.9', label: 'Customer Rating' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection stats={heroStats} />

      {/* Story Section */}
      <StorySection />

      {/* Values Grid */}
      <ValuesGrid />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section - Join Our Journey */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: 'secondary.contrastText',
                mb: 2,
              }}
            >
              Join Our Journey
            </Typography>
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
              We&apos;re always looking for passionate people to join our team. Check out our
              careers page to see current openings.
            </Typography>
            <Button
              component={Link}
              href="/careers"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'secondary.contrastText',
                color: 'secondary.contrastText',
                borderWidth: 2,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'secondary.contrastText',
                  color: 'secondary.main',
                  transform: 'translateY(-2px)',
                  '@media (prefers-reduced-motion: reduce)': {
                    transform: 'none',
                  },
                },
              }}
            >
              View Careers
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
