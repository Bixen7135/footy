'use client';

import { Box, Container } from '@mui/material';
import DiagonalHeroSection from '@/components/contact/DiagonalHeroSection';
import OffsetContactForm from '@/components/contact/OffsetContactForm';
import FloatingInfoCards from '@/components/contact/FloatingInfoCards';

export default function ContactPage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <DiagonalHeroSection />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 4,
          }}
        >
          <Box>
            <OffsetContactForm />
          </Box>
          <Box>
            <FloatingInfoCards />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
