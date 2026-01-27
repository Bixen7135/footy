'use client';

import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import { useCountingAnimation } from '@/hooks/useCountingAnimation';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const MotionBox = motion(Box);

interface ShippingOption {
  name: string;
  days: number;
  price: string;
  description: string;
  height: number;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

const shippingOptions: ShippingOption[] = [
  {
    name: 'Standard',
    days: 7,
    price: '$5.99',
    description: '5-7 business days',
    height: 200,
    bgColor: 'background.paper',
    textColor: 'text.primary',
    icon: <LocalShippingIcon sx={{ fontSize: 60 }} />,
  },
  {
    name: 'Express',
    days: 3,
    price: '$12.99',
    description: '2-3 business days',
    height: 260,
    bgColor: 'rgba(158, 255, 0, 0.1)',
    textColor: 'text.primary',
    icon: <FlightIcon sx={{ fontSize: 70 }} />,
  },
  {
    name: 'Next Day',
    days: 1,
    price: '$24.99',
    description: 'Order by 2pm for next-day delivery',
    height: 340,
    bgColor: 'secondary.main',
    textColor: 'secondary.contrastText',
    icon: <FlightIcon sx={{ fontSize: 80 }} />,
  },
];

function ShippingCard({ option, index }: { option: ShippingOption; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const displayDays = useCountingAnimation(option.days, 0.8, isInView);

  return (
    <MotionBox
      ref={ref}
      initial={{ height: 0, opacity: 0 }}
      animate={isInView ? { height: option.height, opacity: 1 } : { height: 0, opacity: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.8,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.08,
        transition: { duration: 0.3 },
      }}
      sx={{
        bgcolor: option.bgColor,
        border: 2,
        borderColor: index === 2 ? 'transparent' : 'secondary.main',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '@media (prefers-reduced-motion: reduce)': {
          transform: 'none !important',
        },
      }}
    >
      <Box sx={{ color: index === 2 ? option.textColor : 'secondary.main', mb: 2 }}>
        {option.icon}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontSize: '1.5rem',
          color: option.textColor,
          mb: 1,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {option.name}
      </Typography>

      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: '4rem', md: '7.5rem' },
          color: index === 2 ? option.textColor : 'secondary.main',
          lineHeight: 0.9,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {displayDays}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: '0.875rem',
          color: option.textColor,
          mb: 2,
          opacity: 0.8,
        }}
      >
        {option.description}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: '1.5rem',
          color: option.textColor,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {option.price}
      </Typography>
    </MotionBox>
  );
}

export default function SizeHierarchyCards() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 3,
            alignItems: 'flex-end',
          }}
        >
          {shippingOptions.map((option, index) => (
            <ShippingCard key={option.name} option={option} index={index} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
