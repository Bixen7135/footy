'use client';

import { Box, Container, Typography, Grid, Skeleton } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useCountingAnimation } from '@/hooks/useCountingAnimation';
import { useGlitchEffect } from '@/hooks/useGlitchEffect';
import { keyframes } from '@mui/system';
import type { Statistics } from '@/lib/queries';

const MotionBox = motion(Box);

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsSectionProps {
  stats?: Statistics;
  isLoading?: boolean;
}

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(158, 255, 0, 0.4),
                0 0 40px rgba(158, 255, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(158, 255, 0, 0.6),
                0 0 60px rgba(158, 255, 0, 0.3);
  }
`;

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [triggerGlitch, setTriggerGlitch] = useState(false);

  const displayValue = useCountingAnimation(stat.value, 1.5, isInView);
  const { currentColor } = useGlitchEffect(triggerGlitch, {
    iterations: 5,
    duration: 300,
    colors: ['#9EFF00', '#ffffff', '#9EFF00'],
  });

  useEffect(() => {
    if (isInView && !triggerGlitch) {
      // Trigger glitch effect on first view
      const timer = setTimeout(() => setTriggerGlitch(true), 500 + index * 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, triggerGlitch, index]);

  return (
    <Grid item xs={6} md={3} ref={sectionRef}>
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
        sx={{
          textAlign: 'center',
          py: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '3rem', md: '4.5rem' },
            color: currentColor,
            mb: 1,
            animation: `${glowPulse} 2s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
            transition: 'color 0.05s ease',
          }}
        >
          {displayValue}
          {stat.suffix}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            fontSize: { xs: '0.875rem', md: '1rem' },
            opacity: 0.9,
          }}
        >
          {stat.label}
        </Typography>
      </MotionBox>
    </Grid>
  );
}

export default function StatsSection({ stats, isLoading }: StatsSectionProps) {
  const displayStats: Stat[] = stats
    ? [
        { value: Math.floor(stats.total_customers / 1000), suffix: 'K+', label: 'Happy Customers' },
        { value: stats.total_products, suffix: '+', label: 'Products' },
        { value: stats.total_brands, suffix: '+', label: 'Top Brands' },
        { value: stats.customer_rating, suffix: '', label: 'Customer Rating' },
      ]
    : [
        { value: 50, suffix: 'K+', label: 'Happy Customers' },
        { value: 500, suffix: '+', label: 'Products' },
        { value: 30, suffix: '+', label: 'Top Brands' },
        { value: 4.9, suffix: '', label: 'Customer Rating' },
      ];

  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={12}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
                textAlign: 'center',
                mb: 6,
              }}
            >
              By the Numbers
            </Typography>
          </Grid>

          {isLoading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Skeleton
                      variant="text"
                      width={120}
                      height={80}
                      sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={24}
                      sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }}
                    />
                  </Box>
                </Grid>
              ))}
            </>
          ) : (
            displayStats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))
          )}
        </Grid>
      </Container>

      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(158, 255, 0, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(158, 255, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
