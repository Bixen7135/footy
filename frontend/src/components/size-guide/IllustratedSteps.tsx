'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MotionBox = motion(Box);

const steps = [
  {
    number: 1,
    instruction: 'Place your foot on a flat surface against a wall',
  },
  {
    number: 2,
    instruction: 'Mark the longest toe and measure from wall to mark',
  },
  {
    number: 3,
    instruction: 'Measure both feet and use the larger measurement',
  },
  {
    number: 4,
    instruction: 'Compare your measurement with our size chart',
  },
];

export default function IllustratedSteps() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            textAlign: 'center',
            mb: 6,
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          How to Measure Your Feet
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            position: 'relative',
          }}
        >
          {/* Connecting arrows */}
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                display: { xs: 'none', md: index < 2 ? 'block' : 'none' },
                position: 'absolute',
                top: index === 0 ? '25%' : '75%',
                left: index === 0 ? '50%' : '0%',
                right: index === 0 ? '0%' : '50%',
                transform: index === 0 ? 'translateX(0)' : 'translateX(0)',
                zIndex: 0,
              }}
            >
              <MotionBox
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.3, duration: 0.4 }}
                sx={{
                  width: '100%',
                  height: '3px',
                  bgcolor: 'secondary.main',
                  transformOrigin: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <ArrowForwardIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
              </MotionBox>
            </Box>
          ))}

          {/* Steps */}
          {steps.map((step, index) => (
            <MotionBox
              key={step.number}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              sx={{
                p: 3,
                border: 2,
                borderColor: 'divider',
                borderRadius: '12px',
                display: 'flex',
                gap: 3,
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
                bgcolor: 'background.default',
              }}
            >
              {/* Number circle */}
              <MotionBox
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    color: 'secondary.contrastText',
                    fontFamily: 'var(--font-satoshi)',
                  }}
                >
                  {step.number}
                </Typography>
              </MotionBox>

              {/* Instruction */}
              <Box sx={{ flex: 1, pt: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.125rem',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  {step.instruction}
                </Typography>
              </Box>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
