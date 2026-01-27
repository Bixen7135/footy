'use client';

import { Box, Container, Typography } from '@mui/material';
import DiagonalHeroSection from '@/components/careers/DiagonalHeroSection';
import BenefitsBlocks from '@/components/careers/BenefitsBlocks';
import JobListingCard from '@/components/careers/JobListingCard';
import CTASection from '@/components/careers/CTASection';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const OPEN_POSITIONS = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Marketing Coordinator',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    title: 'Warehouse Associate',
    department: 'Operations',
    location: 'Newark, NJ',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <Box>
      {/* Hero Section */}
      <DiagonalHeroSection />

      {/* Why Footy Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '4rem' },
                mb: 4,
              }}
            >
              Why Footy?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.9,
                maxWidth: '900px',
                '& span': {
                  position: 'relative',
                  fontWeight: 600,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 2,
                    left: -4,
                    right: -4,
                    height: '40%',
                    bgcolor: 'secondary.main',
                    opacity: 0.3,
                    zIndex: -1,
                  },
                },
              }}
            >
              At Footy, you&apos;ll work alongside talented individuals who are passionate about
              creating exceptional shopping experiences. We value{' '}
              <Box component="span">innovation</Box>, celebrate{' '}
              <Box component="span">diversity</Box>, and believe in empowering our team members
              to do their best work.
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Benefits Section */}
      <BenefitsBlocks />

      {/* Open Positions Section */}
      <Box id="open-positions" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 4,
            }}
          >
            Open Positions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {OPEN_POSITIONS.map((position, index) => (
              <JobListingCard key={position.title} job={position} index={index} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection />
    </Box>
  );
}
