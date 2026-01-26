'use client';

import { Box, Chip, Button, Stack, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductFilters, Category } from '@/types';

interface ActiveFiltersProps {
  filters: ProductFilters;
  categories?: Category[];
  onFilterRemove: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

const MotionChip = motion(Chip);

export function ActiveFilters({
  filters,
  categories = [],
  onFilterRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters: Array<{ key: string; label: string; filterType: string; value?: string }> = [];

  // Category filter
  if (filters.category_slug) {
    const category = categories.find((c) => c.slug === filters.category_slug);
    activeFilters.push({
      key: 'category',
      label: `Category: ${category?.name || filters.category_slug}`,
      filterType: 'category',
    });
  }

  // Brand filter
  if (filters.brand) {
    activeFilters.push({
      key: 'brand',
      label: `Brand: ${filters.brand}`,
      filterType: 'brand',
    });
  }

  // Gender filter
  if (filters.gender) {
    const genderLabel = filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1);
    activeFilters.push({
      key: 'gender',
      label: `Gender: ${genderLabel}`,
      filterType: 'gender',
    });
  }

  // Price range filter
  if (filters.min_price !== undefined || filters.max_price !== undefined) {
    const minPrice = filters.min_price || 0;
    const maxPrice = filters.max_price || 300;
    activeFilters.push({
      key: 'price',
      label: `Price: $${minPrice} - $${maxPrice}`,
      filterType: 'price',
    });
  }

  // Size filters (one chip per size)
  if (filters.sizes && filters.sizes.length > 0) {
    filters.sizes.forEach((size) => {
      activeFilters.push({
        key: `size-${size}`,
        label: `Size: ${size}`,
        filterType: 'size',
        value: size,
      });
    });
  }

  // Stock filter
  if (filters.in_stock) {
    activeFilters.push({
      key: 'in_stock',
      label: 'In Stock Only',
      filterType: 'in_stock',
    });
  }

  // Search filter
  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      filterType: 'search',
    });
  }

  // Featured filter
  if (filters.is_featured) {
    activeFilters.push({
      key: 'featured',
      label: 'Featured Only',
      filterType: 'featured',
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Active Filters ({activeFilters.length})
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              maxWidth: '100%',
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'divider',
                borderRadius: 3,
              },
            }}
          >
            <AnimatePresence mode="popLayout">
              {activeFilters.map((filter) => (
                <MotionChip
                  key={filter.key}
                  label={filter.label}
                  onDelete={() => onFilterRemove(filter.filterType, filter.value)}
                  size="medium"
                  variants={chipVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'accent.main',
                      bgcolor: 'rgba(158, 255, 0, 0.04)',
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'accent.main',
                      },
                    },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </AnimatePresence>
          </Stack>
        </Box>

        {activeFilters.length >= 2 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearAll}
            sx={{
              whiteSpace: 'nowrap',
              flexShrink: 0,
              borderRadius: '8px',
              '&:hover': {
                borderColor: 'accent.main',
                color: 'accent.dark',
              },
            }}
          >
            Clear All
          </Button>
        )}
      </Stack>
    </Box>
  );
}
