'use client';

import { useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
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
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: ReactNode;
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

const measurementSteps = [
  {
    title: 'Stand on paper',
    body: 'Place a piece of paper on a hard floor against a wall. Stand on the paper with your heel against the wall.',
  },
  {
    title: 'Mark your foot',
    body: 'Have someone mark the longest point of your foot (usually the big toe) on the paper.',
  },
  {
    title: 'Measure',
    body: 'Measure the distance from the wall to the mark in centimeters. This is your foot length.',
  },
  {
    title: 'Find your size',
    body: 'Use the charts below to find your corresponding shoe size. If between sizes, we recommend sizing up.',
  },
];

export default function SizeGuidePage() {
  const [tabValue, setTabValue] = useState(0);

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
              <Box sx={{ maxWidth: 720 }}>
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
                  Fit studio
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
                  Find your perfect fit.
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Sizes can vary between brands. Measure precisely and use the charts below to match your
                  stride.
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                    height: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-satoshi)',
                      mb: 2,
                    }}
                  >
                    Measure your feet
                  </Typography>
                  <Box component="ol" sx={{ pl: 3, '& li': { mb: 2, color: 'text.secondary' } }}>
                    {measurementSteps.map((step) => (
                      <li key={step.title}>
                        <Typography variant="body2">
                          <strong>{step.title}:</strong> {step.body}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Tip: Measure your feet at the end of the day when they are at their largest. Measure
                    both feet as one may be slightly larger.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '22px',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={(_: SyntheticEvent, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab label="Men's sizes" />
                    <Tab label="Women's sizes" />
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
              </motion.div>
            </Grid>
          </Grid>

          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mt: 4,
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
                Need help finding your size?
              </Typography>
              <Typography color="text.secondary">
                Our customer support team is happy to help. Contact us at support@footy.com with your
                foot measurements and the style you are interested in, and we will recommend the best
                size for you.
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
