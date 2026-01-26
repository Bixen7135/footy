'use client';

import { Container, Typography, Box, Paper, Stepper, Step, StepLabel, StepContent, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const RETURN_STEPS = [
  {
    label: 'Initiate return',
    description:
      'Log into your account, go to Order History, and select the item you wish to return. Click "Start Return" and select your reason for returning.',
  },
  {
    label: 'Print label',
    description:
      'You will receive an email with a prepaid return shipping label. Print the label and attach it securely to your package.',
  },
  {
    label: 'Pack items',
    description:
      'Place items in their original packaging with all tags attached. Include the packing slip from your order in the box.',
  },
  {
    label: 'Ship package',
    description:
      'Drop off your package at any UPS location or schedule a pickup. Keep your receipt as proof of shipment.',
  },
  {
    label: 'Receive refund',
    description:
      'Once we receive and inspect your return, your refund will be processed within 5-7 business days to your original payment method.',
  },
];

const refundHighlights = [
  {
    title: 'Processing time',
    body: 'Refunds are processed within 5-7 business days after we receive your return.',
  },
  {
    title: 'Refund method',
    body: 'Refunds are issued to your original payment method. Allow 3-5 business days for posting.',
  },
  {
    title: 'Shipping costs',
    body: 'Original shipping costs are non-refundable. Return shipping is free for exchanges; a $5.99 fee applies to refunds.',
  },
];

export default function ReturnsPage() {
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
                  Returns studio
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
                  Reset the fit, effortlessly.
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Returns and exchanges are designed to be seamless, so you can shop with confidence.
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={5}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-satoshi)',
                      mb: 2,
                    }}
                  >
                    Return policy
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    We accept returns within 30 days of delivery for a full refund or exchange. Items
                    must be unworn, in original packaging, and include all tags.
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, '& li': { mb: 1, color: 'text.secondary' } }}>
                    <li>Unworn and in original condition</li>
                    <li>Original packaging and tags attached</li>
                    <li>Free from scuffs or damage</li>
                    <li>Original packing slip included</li>
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Final sale items and personalized products cannot be returned or exchanged.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-satoshi)',
                      mb: 2,
                    }}
                  >
                    How to return
                  </Typography>
                  <Stepper orientation="vertical" sx={{ mt: 2 }}>
                    {RETURN_STEPS.map((step) => (
                      <Step key={step.label} active>
                        <StepLabel>
                          <Typography fontWeight={600}>{step.label}</Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                    height: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-satoshi)',
                      mb: 1,
                    }}
                  >
                    Exchanges
                  </Typography>
                  <Typography color="text.secondary">
                    Need a different size or color? Exchanges are free. Follow the return process and
                    select &quot;Exchange&quot; instead of &quot;Refund&quot;. We ship your new item as soon as we receive
                    the original. If your preferred option is out of stock, we will issue a full refund.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                    height: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-satoshi)',
                      mb: 2,
                    }}
                  >
                    Refund details
                  </Typography>
                  <Stack spacing={2}>
                    {refundHighlights.map((item) => (
                      <Box key={item.title} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                        <Typography fontWeight={600}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
