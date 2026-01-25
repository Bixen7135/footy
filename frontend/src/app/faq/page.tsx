'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Find answers to common questions about shopping at Footy. Can&apos;t find what
          you&apos;re looking for? Contact our support team.
        </Typography>
      </Box>

      {FAQ_CATEGORIES.map((category) => (
        <Box key={category.title} sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            {category.title}
          </Typography>
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
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
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ py: 1 }}
                  >
                    <Typography fontWeight={500}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Paper>
        </Box>
      ))}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 6,
          textAlign: 'center',
          bgcolor: 'grey.50',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Our customer support team is here to help you.
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          Email us at support@footy.com
        </Typography>
      </Paper>
    </Container>
  );
}
