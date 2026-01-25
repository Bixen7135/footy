'use client';

import { Container, Typography, Box, Paper } from '@mui/material';

export default function TermsOfServicePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: 1, borderColor: 'divider' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: January 2026
        </Typography>

        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              By accessing and using the Footy website, you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our website.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              2. Use of Website
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You may use our website for lawful purposes only. You agree not to use the website
              in any way that could damage, disable, or impair the site or interfere with any other
              party&apos;s use of the website.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              3. Account Registration
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              To make purchases, you may need to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities
              that occur under your account.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              4. Product Information
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We strive to display product colors and images as accurately as possible. However,
              we cannot guarantee that your device&apos;s display will accurately reflect the actual
              colors of products.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              5. Pricing and Payment
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              All prices are displayed in USD and are subject to change without notice. We reserve
              the right to refuse or cancel any order if pricing errors occur. Payment must be
              received before orders are processed.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              6. Intellectual Property
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              All content on this website, including text, graphics, logos, and images, is the
              property of Footy and is protected by intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our written permission.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              7. Limitation of Liability
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Footy shall not be liable for any indirect, incidental, special, or consequential
              damages arising from your use of the website or purchase of products.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              8. Changes to Terms
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the website constitutes acceptance
              of the modified terms.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              9. Contact
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              For questions about these Terms of Service, please contact us at legal@footy.com.
            </Typography>
          </section>
        </Box>
      </Paper>
    </Container>
  );
}
