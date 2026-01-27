'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTableRow = motion(TableRow);

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

export default function SlidingTabTable() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [direction, setDirection] = useState(1);

  const handleTabChange = (newTab: 'men' | 'women') => {
    if (newTab !== activeTab) {
      setDirection(newTab === 'women' ? 1 : -1);
      setActiveTab(newTab);
    }
  };

  const sizes = activeTab === 'men' ? MEN_SIZES : WOMEN_SIZES;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            textAlign: 'center',
            mb: 4,
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          Size Conversion Charts
        </Typography>

        {/* Tab buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            mb: 4,
          }}
        >
          {['men', 'women'].map((tab) => (
            <MotionBox
              key={tab}
              onClick={() => handleTabChange(tab as 'men' | 'women')}
              whileTap={{ scale: 0.95 }}
              sx={{
                px: 4,
                py: 2,
                border: 3,
                borderColor: 'secondary.main',
                borderRadius: '12px',
                bgcolor: activeTab === tab ? 'secondary.main' : 'transparent',
                color: activeTab === tab ? 'secondary.contrastText' : 'text.primary',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                transform: activeTab === tab ? 'scale(1.1)' : 'scale(1)',
                fontFamily: 'var(--font-satoshi)',
              }}
            >
              {tab}&apos;s
            </MotionBox>
          ))}
        </Box>

        {/* Table with slide animation */}
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <MotionBox
              key={activeTab}
              initial={{ x: direction * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              sx={{ position: 'absolute', width: '100%' }}
            >
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.900' }}>
                      {['US', 'UK', 'EU', 'CM'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: 'secondary.main',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontFamily: 'var(--font-satoshi)',
                            py: 2,
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sizes.map((size, index) => (
                      <MotionTableRow
                        key={`${activeTab}-${size.us}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        sx={{
                          bgcolor: index % 2 === 0 ? 'background.paper' : 'rgba(158, 255, 0, 0.05)',
                          '&:hover': {
                            bgcolor: 'rgba(158, 255, 0, 0.2)',
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s ease',
                          },
                          '@media (prefers-reduced-motion: reduce)': {
                            '&:hover': {
                              transform: 'none',
                            },
                          },
                        }}
                      >
                        <TableCell sx={{ fontSize: '1.125rem', fontFamily: 'var(--font-inter)' }}>
                          {size.us}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.125rem', fontFamily: 'var(--font-inter)' }}>
                          {size.uk}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.125rem', fontFamily: 'var(--font-inter)' }}>
                          {size.eu}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.125rem', fontFamily: 'var(--font-inter)' }}>
                          {size.cm}
                        </TableCell>
                      </MotionTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
