'use client';

import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import InventoryIcon from '@mui/icons-material/Inventory';

const SHIPPING_OPTIONS = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Standard Shipping',
    time: '5-7 Business Days',
    price: '$5.99',
    description: 'Free on orders over $75',
  },
  {
    icon: <FlightIcon sx={{ fontSize: 40 }} />,
    title: 'Express Shipping',
    time: '2-3 Business Days',
    price: '$12.99',
    description: 'Fast delivery for urgent needs',
  },
  {
    icon: <InventoryIcon sx={{ fontSize: 40 }} />,
    title: 'Next Day Delivery',
    time: '1 Business Day',
    price: '$24.99',
    description: 'Order by 2pm for next day',
  },
];

const sections = [
  {
    title: 'Delivery areas',
    body:
      'We currently ship to all 50 US states. Delivery times may vary for Alaska, Hawaii, and remote areas. International shipping is not available at this time.',
  },
  {
    title: 'Order processing',
    body:
      'Orders placed before 2:00 PM EST on business days are processed the same day. Orders placed after 2:00 PM EST or on weekends will be processed the next business day. You will receive a shipping confirmation email with tracking information once your order ships.',
  },
  {
    title: 'Free shipping',
    body:
      'Enjoy free standard shipping on all orders over $75. This offer applies to the contiguous United States and cannot be combined with other promotions.',
  },
  {
    title: 'Order tracking',
    body:
      'Once your order ships, you will receive an email with your tracking number. You can also track your order by logging into your account and viewing your order history. Tracking updates typically appear within 24 hours of shipment.',
  },
  {
    title: 'Delivery issues',
    body:
      'If your package is lost, damaged, or delayed, please contact our customer support team at support@footy.com. We will work with the carrier to resolve the issue and ensure you receive your order.',
  },
];

export default function ShippingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'radial-gradient(circle at 18% 10%, rgba(24, 24, 24, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 8%, rgba(158, 255, 0, 0.2) 0%, transparent 50%), radial-gradient(circle at 8% 80%, rgba(158, 255, 0, 0.16) 0%, transparent 50%)'
                : 'radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 8%, rgba(158, 255, 0, 0.18) 0%, transparent 50%), radial-gradient(circle at 8% 80%, rgba(158, 255, 0, 0.12) 0%, transparent 50%)',
            opacity: 0.9,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants}>
              <Box sx={{ maxWidth: 720 }}>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  Shipping studio
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    fontFamily: 'var(--font-satoshi)',
                    mb: 2,
                  }}
                >
                  Delivery, calibrated.
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Every order is handled with precision. Choose the delivery speed that matches your pace.
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {SHIPPING_OPTIONS.map((option) => (
              <Grid item xs={12} md={4} key={option.title}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'left',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '20px',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box sx={{ color: 'secondary.main', mb: 2 }}>{option.icon}</Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }} gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {option.time}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        fontFamily: 'var(--font-satoshi)',
                        mb: 1,
                      }}
                    >
                      {option.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {sections.map((section) => (
              <Grid item xs={12} md={6} key={section.title}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '20px',
                      bgcolor: 'background.paper',
                      height: '100%',
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
                      {section.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {section.body}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
