'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MEN_SIZES = [
  { us: '7', uk: '6', eu: '40', cm: '25' },
  { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5' },
  { us: '8', uk: '7', eu: '41', cm: '26' },
  { us: '8.5', uk: '7.5', eu: '42', cm: '26.5' },
  { us: '9', uk: '8', eu: '42.5', cm: '27' },
  { us: '9.5', uk: '8.5', eu: '43', cm: '27.5' },
  { us: '10', uk: '9', eu: '44', cm: '28' },
  { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5' },
  { us: '11', uk: '10', eu: '45', cm: '29' },
  { us: '11.5', uk: '10.5', eu: '45.5', cm: '29.5' },
  { us: '12', uk: '11', eu: '46', cm: '30' },
  { us: '13', uk: '12', eu: '47', cm: '31' },
];

const WOMEN_SIZES = [
  { us: '5', uk: '3', eu: '35.5', cm: '22' },
  { us: '5.5', uk: '3.5', eu: '36', cm: '22.5' },
  { us: '6', uk: '4', eu: '36.5', cm: '23' },
  { us: '6.5', uk: '4.5', eu: '37', cm: '23.5' },
  { us: '7', uk: '5', eu: '37.5', cm: '24' },
  { us: '7.5', uk: '5.5', eu: '38', cm: '24.5' },
  { us: '8', uk: '6', eu: '38.5', cm: '25' },
  { us: '8.5', uk: '6.5', eu: '39', cm: '25.5' },
  { us: '9', uk: '7', eu: '40', cm: '26' },
  { us: '9.5', uk: '7.5', eu: '40.5', cm: '26.5' },
  { us: '10', uk: '8', eu: '41', cm: '27' },
  { us: '11', uk: '9', eu: '42', cm: '28' },
];

export default function SizeGuidePage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Size Guide
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Find your perfect fit with our comprehensive size guide. Sizes may vary between
          brands, so we recommend measuring your feet for the most accurate fit.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          How to Measure Your Feet
        </Typography>
        <Box component="ol" sx={{ pl: 3, '& li': { mb: 2, color: 'text.secondary' } }}>
          <li>
            <Typography variant="body1">
              <strong>Stand on paper:</strong> Place a piece of paper on a hard floor against
              a wall. Stand on the paper with your heel against the wall.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Mark your foot:</strong> Have someone mark the longest point of your
              foot (usually the big toe) on the paper.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Measure:</strong> Measure the distance from the wall to the mark in
              centimeters. This is your foot length.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Find your size:</strong> Use the charts below to find your corresponding
              shoe size. If between sizes, we recommend sizing up.
            </Typography>
          </li>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Tip: Measure your feet at the end of the day when they&apos;re at their largest.
          Measure both feet, as one may be slightly larger than the other.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Men's Sizes" />
          <Tab label="Women's Sizes" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>US</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>UK</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>EU</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>CM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MEN_SIZES.map((size) => (
                  <TableRow key={size.us}>
                    <TableCell>{size.us}</TableCell>
                    <TableCell>{size.uk}</TableCell>
                    <TableCell>{size.eu}</TableCell>
                    <TableCell>{size.cm}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>US</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>UK</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>EU</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>CM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {WOMEN_SIZES.map((size) => (
                  <TableRow key={size.us}>
                    <TableCell>{size.us}</TableCell>
                    <TableCell>{size.uk}</TableCell>
                    <TableCell>{size.eu}</TableCell>
                    <TableCell>{size.cm}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 4,
          bgcolor: 'grey.50',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Need Help Finding Your Size?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our customer support team is happy to help. Contact us at support@footy.com with
          your foot measurements and the style you&apos;re interested in, and we&apos;ll
          recommend the best size for you.
        </Typography>
      </Paper>
    </Container>
  );
}
