'use client';

import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '../ui/CircularProgress';

const MotionBox = motion(Box);

const policyPoints = [
  'Items must be unworn and in original packaging',
  'All tags must be attached',
  '30-day return window from delivery date',
  'Free returns for exchanges',
  'Refunds subject to $5.99 shipping fee',
];

export default function TiltedPolicyPanel() {
  return (
    <MotionBox
      initial={{ opacity: 0, x: -60, rotate: 0 }}
      whileInView={{ opacity: 1, x: 0, rotate: -2 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        bgcolor: 'grey.900',
        border: 4,
        borderColor: 'secondary.main',
        borderRadius: '12px',
        p: 4,
        position: 'relative',
        transformOrigin: 'center',
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.875rem' },
              color: 'secondary.main',
              fontFamily: 'var(--font-satoshi)',
            }}
          >
            Return Policy
          </Typography>

          {/* 30-day circular progress */}
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={80} strokeWidth={6} progress={100} duration={1.5} />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: 'white',
                fontWeight: 600,
              }}
            >
              30 Days
            </Typography>
          </Box>
        </Box>

        {/* Policy checklist */}
        <Stack spacing={2}>
          {policyPoints.map((point, index) => (
            <MotionBox
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <MotionBox
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 + 0.2, type: 'spring' }}
                sx={{ color: 'secondary.main', flexShrink: 0 }}
              >
                <CheckCircleIcon />
              </MotionBox>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {point}
              </Typography>
            </MotionBox>
          ))}
        </Stack>
      </Stack>
    </MotionBox>
  );
}
