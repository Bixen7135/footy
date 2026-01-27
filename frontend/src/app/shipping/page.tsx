'use client';

import { Box } from '@mui/material';
import VelocityHeroSection from '@/components/shipping/VelocityHeroSection';
import SizeHierarchyCards from '@/components/shipping/SizeHierarchyCards';
import OffsetInfoGrid from '@/components/shipping/OffsetInfoGrid';

export default function ShippingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <VelocityHeroSection />
      <SizeHierarchyCards />
      <OffsetInfoGrid />
    </Box>
  );
}
