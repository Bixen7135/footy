'use client';

import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

const FAQ_CATEGORIES = [
  {
    title: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery. Shipping times may vary based on your location and product availability.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you will receive a confirmation email with a tracking number. You can also view your order status by logging into your account and visiting the Orders section.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Currently, we ship within the United States only. We are working on expanding our shipping options to international destinations in the near future.',
      },
      {
        question: 'Can I change or cancel my order?',
        answer:
          'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact customer support immediately if you need to make changes.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day return policy for unworn items in original packaging. Items must be in their original condition with all tags attached. Returns are free for exchanges; refunds may incur a shipping fee.',
      },
      {
        question: 'How do I start a return?',
        answer:
          'Log into your account, go to Order History, select the item you wish to return, and follow the return instructions. You will receive a prepaid shipping label via email.',
      },
      {
        question: 'How long do refunds take?',
        answer:
          'Once we receive your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method.',
      },
    ],
  },
  {
    title: 'Products & Sizing',
    questions: [
      {
        question: 'How do I find my shoe size?',
        answer:
          'Visit our Size Guide page for detailed instructions on measuring your feet. We provide size charts for all brands and recommend measuring both feet, as sizes can vary between brands.',
      },
      {
        question: 'Are your products authentic?',
        answer:
          'Yes, all products sold on Footy are 100% authentic. We source directly from brands and authorized distributors. We guarantee the authenticity of every item we sell.',
      },
      {
        question: 'Do you offer wide or narrow widths?',
        answer:
          'Width availability varies by product. If a shoe is available in different widths, you will see width options on the product page. Use the filter options to find shoes in your preferred width.',
      },
    ],
  },
  {
    title: 'Account & Payment',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All transactions are securely processed.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.',
      },
      {
        question: 'How do I reset my password?',
        answer:
          'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. The link expires after 24 hours for security.',
      },
    ],
  },
];

export default function FAQPage() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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
              <Box sx={{ maxWidth: 760 }}>
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
                  Support index
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
                  Answers, refined.
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Find guidance on orders, returns, sizing, and account details. If you need a custom
                  answer, reach our team any time.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1 }}>
                  {FAQ_CATEGORIES.map((category) => (
                    <Chip
                      key={category.title}
                      label={category.title}
                      sx={{
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'transparent',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {FAQ_CATEGORIES.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-satoshi)',
                    mb: 2,
                  }}
                >
                  {category.title}
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                  }}
                >
                  {category.questions.map((faq, index) => {
                    const panelId = `${category.title}-${index}`;
                    return (
                      <Accordion
                        key={panelId}
                        expanded={expanded === panelId}
                        onChange={handleChange(panelId)}
                        elevation={0}
                        disableGutters
                        sx={{
                          '&:before': { display: 'none' },
                          borderBottom: index < category.questions.length - 1 ? 1 : 0,
                          borderColor: 'divider',
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 1.5, px: 3 }}>
                          <Typography fontWeight={600}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, px: 3, pb: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Paper>
              </Box>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mt: 4,
                textAlign: 'center',
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
                  mb: 1,
                }}
              >
                Still have questions?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Our customer support team is ready to help.
              </Typography>
              <Typography fontWeight={600}>Email us at support@footy.com</Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
