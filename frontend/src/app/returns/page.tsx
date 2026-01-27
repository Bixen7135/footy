'use client';

import { Box, Container } from '@mui/material';
import CircularHeroSection from '@/components/returns/CircularHeroSection';
import TiltedPolicyPanel from '@/components/returns/TiltedPolicyPanel';
import HorizontalTimeline from '@/components/returns/HorizontalTimeline';
import ExpandableInfoBlocks from '@/components/returns/ExpandableInfoBlocks';

export default function ReturnsPage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CircularHeroSection />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <TiltedPolicyPanel />
      </Container>

      <HorizontalTimeline />

      <ExpandableInfoBlocks />
    </Box>
  );
}
