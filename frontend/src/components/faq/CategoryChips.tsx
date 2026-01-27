'use client';

import { useState } from 'react';
import { Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const MotionChip = motion(Chip);

interface CategoryChipsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryChips({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'rgba(158, 255, 0, 0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'secondary.main',
          borderRadius: '3px',
          '&:hover': {
            bgcolor: 'secondary.dark',
          },
        },
      }}
    >
      {categories.map((category, index) => {
        const isActive = category === activeCategory;

        return (
          <MotionChip
            key={category}
            label={category}
            onClick={() => onCategoryChange(category)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              px: 2,
              py: 2.5,
              height: 'auto',
              borderRadius: '8px',
              border: 2,
              borderColor: 'secondary.main',
              bgcolor: isActive ? 'secondary.main' : 'transparent',
              color: isActive ? 'secondary.contrastText' : 'text.primary',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                bgcolor: isActive ? 'secondary.main' : 'rgba(158, 255, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        );
      })}
    </Box>
  );
}
