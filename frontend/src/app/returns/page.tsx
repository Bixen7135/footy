'use client';

import { Container, Typography, Box, Paper, Stepper, Step, StepLabel, StepContent } from '@mui/material';

const RETURN_STEPS = [
  {
    label: 'Initiate Return',
    description:
      'Log into your account, go to Order History, and select the item you wish to return. Click "Start Return" and select your reason for returning.',
  },
  {
    label: 'Print Label',
    description:
      'You will receive an email with a prepaid return shipping label. Print the label and attach it securely to your package.',
  },
  {
    label: 'Pack Items',
    description:
      'Place items in their original packaging with all tags attached. Include the packing slip from your order in the box.',
  },
  {
    label: 'Ship Package',
    description:
      'Drop off your package at any UPS location or schedule a pickup. Keep your receipt as proof of shipment.',
  },
  {
    label: 'Receive Refund',
    description:
      'Once we receive and inspect your return, your refund will be processed within 5-7 business days to your original payment method.',
  },
];

export default function ReturnsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Returns & Exchanges
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Not the right fit? No problem. We make returns and exchanges easy so you can shop
          with confidence.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Return Policy
        </Typography>
        <Box sx={{ '& > *': { mb: 2 } }}>
          <Typography variant="body1" color="text.secondary">
            We accept returns within <strong>30 days</strong> of delivery for a full refund
            or exchange. Items must be:
          </Typography>
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 1, color: 'text.secondary' } }}>
            <li>Unworn and in original condition</li>
            <li>In original packaging with all tags attached</li>
            <li>Free from scuffs, marks, or damage</li>
            <li>Accompanied by the original packing slip</li>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Final sale items, personalized products, and items marked as non-returnable
            cannot be returned or exchanged.
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          How to Return
        </Typography>
        <Stepper orientation="vertical" sx={{ mt: 3 }}>
          {RETURN_STEPS.map((step) => (
            <Step key={step.label} active>
              <StepLabel>
                <Typography fontWeight={500}>{step.label}</Typography>
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

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Exchanges
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Need a different size or color? Exchanges are free! Follow the return process above
          and select &quot;Exchange&quot; instead of &quot;Refund&quot; when initiating your
          return. We&apos;ll ship your new item as soon as we receive the original.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          If your preferred size or color is out of stock, you&apos;ll receive a full refund
          instead.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Refund Information
        </Typography>
        <Box sx={{ '& > *': { mb: 2 } }}>
          <Typography variant="body1" color="text.secondary">
            <strong>Processing Time:</strong> Refunds are processed within 5-7 business days
            after we receive your return.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Refund Method:</strong> Refunds are issued to your original payment method.
            Please allow an additional 3-5 business days for the refund to appear in your account.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Shipping Costs:</strong> Original shipping costs are non-refundable.
            Return shipping is free for exchanges; a $5.99 fee applies to refunds.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
