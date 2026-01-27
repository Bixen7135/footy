'use client';

import { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function ConversionHelper() {
  const [cmValue, setCmValue] = useState('');
  const [convertedSizes, setConvertedSizes] = useState<{
    us: string;
    uk: string;
    eu: string;
  } | null>(null);

  const handleConversion = (cm: string) => {
    setCmValue(cm);
    const cmNum = parseFloat(cm);

    if (!cmNum || cmNum < 20 || cmNum > 35) {
      setConvertedSizes(null);
      return;
    }

    // Simplified conversion logic
    const usSize = (cmNum - 22) * 1.5 + 5;
    const ukSize = usSize - 2;
    const euSize = cmNum + 12;

    setConvertedSizes({
      us: usSize.toFixed(1),
      uk: ukSize.toFixed(1),
      eu: euSize.toFixed(1),
    });
  };

  return (
    <MotionBox
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.6 }}
      sx={{
        position: 'sticky',
        top: 100,
        bgcolor: 'secondary.main',
        color: 'secondary.contrastText',
        p: 3,
        borderRadius: '12px',
        maxWidth: 250,
        ml: 'auto',
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          mb: 2,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        Quick Converter
      </Typography>

      <TextField
        label="Foot Length (CM)"
        type="number"
        value={cmValue}
        onChange={(e) => handleConversion(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'secondary.contrastText',
          },
          '& .MuiInputBase-input': {
            color: 'secondary.contrastText',
          },
        }}
      />

      {convertedSizes && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>US:</strong> {convertedSizes.us}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>UK:</strong> {convertedSizes.uk}
          </Typography>
          <Typography variant="body2">
            <strong>EU:</strong> {convertedSizes.eu}
          </Typography>
        </MotionBox>
      )}
    </MotionBox>
  );
}
