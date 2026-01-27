'use client';

import { Box } from '@mui/material';
import GridMeasurementHero from '@/components/size-guide/GridMeasurementHero';
import IllustratedSteps from '@/components/size-guide/IllustratedSteps';
import SlidingTabTable from '@/components/size-guide/SlidingTabTable';
import ConversionHelper from '@/components/size-guide/ConversionHelper';

export default function SizeGuidePage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <GridMeasurementHero />
      <IllustratedSteps />
      <Box sx={{ position: 'relative' }}>
        <SlidingTabTable />
        <Box sx={{ position: 'absolute', right: 20, top: 20 }}>
          <ConversionHelper />
        </Box>
      </Box>
    </Box>
  );
}
