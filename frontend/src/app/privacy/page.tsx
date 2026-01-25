'use client';

import { Container, Typography, Box, Paper } from '@mui/material';

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: 1, borderColor: 'divider' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: January 2026
        </Typography>

        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, or contact us for support. This includes your name, email address,
              shipping address, payment information, and phone number.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We also automatically collect certain information when you visit our website, including
              your IP address, browser type, operating system, referring URLs, and information about
              how you interact with our website.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We use the information we collect to process transactions, send order confirmations,
              respond to your requests, improve our services, and send promotional communications
              (with your consent).
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We do not sell your personal information. We may share your information with service
              providers who assist us in operating our website and conducting our business, such as
              payment processors and shipping carriers.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              4. Data Security
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              5. Cookies
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We use cookies and similar technologies to enhance your browsing experience, analyze
              site traffic, and understand where our visitors come from. You can control cookies
              through your browser settings.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              6. Your Rights
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You have the right to access, correct, or delete your personal information. You may
              also opt out of receiving promotional communications at any time by clicking the
              unsubscribe link in our emails or contacting us directly.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              7. Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you have questions about this Privacy Policy, please contact us at privacy@footy.com.
            </Typography>
          </section>
        </Box>
      </Paper>
    </Container>
  );
}
