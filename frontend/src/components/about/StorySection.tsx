'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const MotionBox = motion(Box);

export default function StorySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        py: { xs: 6, md: 10 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 0 },
            minHeight: { xs: 'auto', md: 400 },
          }}
        >
          {/* Left side - Black background with rotated heading */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 40%' },
              bgcolor: 'grey.900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 4, md: 6 },
              position: 'relative',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: 'white',
                transform: { xs: 'rotate(0deg)', md: 'rotate(-2deg)' },
                textAlign: 'center',
              }}
            >
              Our Story
            </Typography>
          </Box>

          {/* Right side - White background with content */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 60%' },
              bgcolor: 'white',
              p: { xs: 4, md: 6 },
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              borderLeft: { xs: 'none', md: '8px solid' },
              borderTop: { xs: '8px solid', md: 'none' },
              borderColor: 'secondary.main',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: 'grey.800',
                maxWidth: '800px',
              }}
            >
              Founded by footwear enthusiasts, Footy started with a simple mission: make it
              easy for everyone to find their perfect pair of shoes. We were tired of endless
              searching through countless stores, dealing with poor customer service, and
              worrying about authenticity. So we built something better. Today, we curate the
              best selection of sneakers, boots, and running shoes from the brands you love,
              all in one place with the shopping experience you deserve.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
