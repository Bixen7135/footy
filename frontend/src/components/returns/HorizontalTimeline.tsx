'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MotionBox = motion(Box);

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Initiate Return',
    description: 'Log into your account and select items to return',
  },
  {
    number: 2,
    title: 'Print Label',
    description: 'Download and print your prepaid return label',
  },
  {
    number: 3,
    title: 'Pack Items',
    description: 'Securely pack items in original packaging',
  },
  {
    number: 4,
    title: 'Ship Package',
    description: 'Drop off at any authorized shipping location',
  },
  {
    number: 5,
    title: 'Receive Refund',
    description: 'Refund processed within 5-7 business days',
  },
];

export default function HorizontalTimeline() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            textAlign: 'center',
            mb: 8,
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          How to Return
        </Typography>

        {/* Timeline container */}
        <Box
          sx={{
            position: 'relative',
            display: { xs: 'block', md: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Connecting line */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '40px',
              left: '10%',
              right: '10%',
              height: '4px',
              bgcolor: 'divider',
              zIndex: 0,
            }}
          >
            {steps.map((step, index) => (
              <MotionBox
                key={step.number}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${(index / (steps.length - 1)) * 100}%`,
                  height: '100%',
                  bgcolor: 'secondary.main',
                  transformOrigin: 'left',
                }}
              />
            ))}
          </Box>

          {/* Steps */}
          {steps.map((step, index) => (
            <MotionBox
              key={step.number}
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.15 }}
              sx={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                mb: { xs: 4, md: 0 },
                '@media (prefers-reduced-motion: reduce)': {
                  transform: 'none !important',
                },
              }}
            >
              {/* Circle node */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: index < 5 ? 'secondary.main' : 'background.paper',
                  border: 3,
                  borderColor: index < 5 ? 'transparent' : 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {index < 5 ? (
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '2rem',
                      color: 'secondary.contrastText',
                      fontFamily: 'var(--font-satoshi)',
                    }}
                  >
                    {step.number}
                  </Typography>
                ) : (
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                )}
              </Box>

              {/* Step info */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  mb: 1,
                  fontFamily: 'var(--font-satoshi)',
                }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: '180px',
                  margin: '0 auto',
                }}
              >
                {step.description}
              </Typography>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
