'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PublicIcon from '@mui/icons-material/Public';

const MotionPaper = motion(Paper);

interface InfoSection {
  title: string;
  body: string;
  icon: React.ReactNode;
  accentSide: 'top' | 'left' | 'right' | 'bottom';
  height: number;
}

const infoSections: InfoSection[] = [
  {
    title: 'Delivery areas',
    body: 'We currently ship to all 50 US states. Delivery times may vary for Alaska, Hawaii, and remote areas. International shipping is not available at this time.',
    icon: <PublicIcon sx={{ fontSize: 32 }} />,
    accentSide: 'left',
    height: 180,
  },
  {
    title: 'Order processing',
    body: 'Orders placed before 2:00 PM EST on business days are processed the same day. Orders placed after 2:00 PM EST or on weekends will be processed the next business day. You will receive a shipping confirmation email with tracking information once your order ships.',
    icon: <InventoryIcon sx={{ fontSize: 32 }} />,
    accentSide: 'top',
    height: 220,
  },
  {
    title: 'Free shipping',
    body: 'Enjoy free standard shipping on all orders over $75. This offer applies to the contiguous United States and cannot be combined with other promotions.',
    icon: <LocalShippingIcon sx={{ fontSize: 32 }} />,
    accentSide: 'right',
    height: 180,
  },
  {
    title: 'Order tracking',
    body: 'Once your order ships, you will receive an email with your tracking number. You can also track your order by logging into your account and viewing your order history. Tracking updates typically appear within 24 hours of shipment.',
    icon: <TrackChangesIcon sx={{ fontSize: 32 }} />,
    accentSide: 'bottom',
    height: 200,
  },
  {
    title: 'Delivery issues',
    body: 'If your package is lost, damaged, or delayed, please contact our customer support team at support@footy.com. We will work with the carrier to resolve the issue and ensure you receive your order.',
    icon: <SupportAgentIcon sx={{ fontSize: 32 }} />,
    accentSide: 'left',
    height: 190,
  },
];

function getAccentStyles(side: string) {
  const baseStyle = {
    content: '""',
    position: 'absolute' as const,
    bgcolor: 'secondary.main',
  };

  switch (side) {
    case 'top':
      return { ...baseStyle, top: 0, left: 0, right: 0, height: '4px' };
    case 'bottom':
      return { ...baseStyle, bottom: 0, left: 0, right: 0, height: '4px' };
    case 'left':
      return { ...baseStyle, left: 0, top: 0, bottom: 0, width: '4px' };
    case 'right':
      return { ...baseStyle, right: 0, top: 0, bottom: 0, width: '4px' };
    default:
      return baseStyle;
  }
}

export default function OffsetInfoGrid() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {infoSections.map((section, index) => (
            <MotionPaper
              key={section.title}
              elevation={0}
              initial={{
                opacity: 0,
                y: index % 2 === 0 ? -40 : 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              sx={{
                p: 3,
                border: 1,
                borderColor: 'divider',
                borderRadius: '12px',
                position: 'relative',
                minHeight: { xs: 'auto', md: section.height },
                display: 'flex',
                flexDirection: 'column',
                '&::before': getAccentStyles(section.accentSide),
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(158, 255, 0, 0.1)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  '&:hover': {
                    transform: 'none',
                  },
                },
              }}
            >
              {/* Icon in circle badge */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'rgba(158, 255, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'secondary.main',
                  mb: 2,
                }}
              >
                {section.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 1.5,
                  fontFamily: 'var(--font-satoshi)',
                }}
              >
                {section.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'text.secondary',
                }}
              >
                {section.body}
              </Typography>
            </MotionPaper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
