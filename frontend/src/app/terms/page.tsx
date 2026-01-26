'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Acceptance of terms',
    body:
      'By accessing and using the Footy website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.',
  },
  {
    title: '2. Use of website',
    body:
      'You may use our website for lawful purposes only. You agree not to use the website in any way that could damage, disable, or impair the site or interfere with any other party\'s use of the website.',
  },
  {
    title: '3. Account registration',
    body:
      'To make purchases, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
  },
  {
    title: '4. Product information',
    body:
      'We strive to display product colors and images as accurately as possible. However, we cannot guarantee that your device\'s display will accurately reflect the actual colors of products.',
  },
  {
    title: '5. Pricing and payment',
    body:
      'All prices are displayed in USD and are subject to change without notice. We reserve the right to refuse or cancel any order if pricing errors occur. Payment must be received before orders are processed.',
  },
  {
    title: '6. Intellectual property',
    body:
      'All content on this website, including text, graphics, logos, and images, is the property of Footy and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.',
  },
  {
    title: '7. Limitation of liability',
    body:
      'Footy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or purchase of products.',
  },
  {
    title: '8. Changes to terms',
    body:
      'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.',
  },
  {
    title: '9. Contact',
    body: 'For questions about these Terms of Service, please contact us at legal@footy.com.',
  },
];

export default function TermsOfServicePage() {
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
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants}>
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
                Terms ledger
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                  fontWeight: 900,
                  lineHeight: 0.98,
                  letterSpacing: '-0.04em',
                  fontFamily: 'var(--font-satoshi)',
                  mb: 2,
                }}
              >
                Terms of service
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Last updated: January 2026
              </Typography>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
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
            {sections.map((section) => (
              <motion.div key={section.title} variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      mb: 1,
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {section.body}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
