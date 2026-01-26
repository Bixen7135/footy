'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Information we collect',
    body: [
      'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, shipping address, payment information, and phone number.',
      'We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.',
    ],
  },
  {
    title: '2. How we use your information',
    body: [
      'We use the information we collect to process transactions, send order confirmations, respond to your requests, improve our services, and send promotional communications (with your consent).',
    ],
  },
  {
    title: '3. Information sharing',
    body: [
      'We do not sell your personal information. We may share your information with service providers who assist us in operating our website and conducting our business, such as payment processors and shipping carriers.',
    ],
  },
  {
    title: '4. Data security',
    body: [
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
    ],
  },
  {
    title: '5. Cookies',
    body: [
      'We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings.',
    ],
  },
  {
    title: '6. Your rights',
    body: [
      'You have the right to access, correct, or delete your personal information. You may also opt out of receiving promotional communications at any time by clicking the unsubscribe link in our emails or contacting us directly.',
    ],
  },
  {
    title: '7. Contact us',
    body: ['If you have questions about this Privacy Policy, please contact us at privacy@footy.com.'],
  },
];

export default function PrivacyPolicyPage() {
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
                Privacy ledger
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
                Privacy policy
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
                  {section.body.map((paragraph) => (
                    <Typography key={paragraph} color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Box>
              </motion.div>
            ))}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
