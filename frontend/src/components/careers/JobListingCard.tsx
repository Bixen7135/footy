'use client';

import { Box, Typography, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import Link from 'next/link';

const MotionBox = motion(Box);

interface JobListing {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

interface JobListingCardProps {
  job: JobListing;
  index: number;
}

export default function JobListingCard({ job, index }: JobListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        p: 3,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'secondary.main',
          boxShadow: '0 4px 20px rgba(158, 255, 0, 0.15)',
        },
        // Thick green left border
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '12px',
          bgcolor: 'secondary.main',
          transition: 'width 0.5s ease-out',
          zIndex: 1,
        },
        '&:hover::before': {
          width: { xs: '12px', sm: '30%' },
        },
      }}
    >
      {/* Job info */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          zIndex: 2,
          transition: 'transform 0.5s ease-out',
          transform: isHovered ? { xs: 'none', sm: 'translateX(40px)' } : 'none',
          '@media (prefers-reduced-motion: reduce)': {
            transform: 'none !important',
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            mb: 1,
          }}
        >
          {job.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={job.department}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'secondary.main',
              color: 'text.primary',
              fontWeight: 500,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {job.type}
          </Typography>
        </Box>
      </Box>

      {/* View button with fade-in effect */}
      <MotionBox
        initial={{ opacity: 0.7 }}
        animate={{ opacity: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        sx={{ position: 'relative', zIndex: 2 }}
      >
        <Button
          component={Link}
          href={`/careers/positions/${job.slug}`}
          variant="outlined"
          size="small"
          sx={{
            borderColor: 'secondary.main',
            color: 'secondary.main',
            fontWeight: 600,
            minWidth: 120,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              borderColor: 'secondary.main',
            },
          }}
        >
          View Details →
        </Button>
      </MotionBox>
    </MotionBox>
  );
}
