'use client';

import { Box, Breadcrumbs, Link as MuiLink, Typography, Stack, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion } from 'framer-motion';
import type { Category } from '@/types';

interface CatalogHeaderProps {
  category?: Category;
  resultsCount?: number;
  totalCount?: number;
  viewMode: string;
  sortBy: string;
  onViewModeChange: (mode: string) => void;
  onSortChange: (sort: string) => void;
  children?: React.ReactNode;
}

export function CatalogHeader({
  category,
  resultsCount,
  totalCount,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
  children,
}: CatalogHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const resultsText = resultsCount && totalCount
    ? resultsCount === totalCount
      ? `${totalCount} products`
      : `Showing ${resultsCount} of ${totalCount} products`
    : totalCount
    ? `${totalCount} products`
    : 'Loading...';

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{ mb: 4 }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link href="/" passHref legacyBehavior>
          <MuiLink
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </MuiLink>
        </Link>
        <Link href="/catalog" passHref legacyBehavior>
          <MuiLink
            underline="hover"
            sx={{
              color: category ? 'text.secondary' : 'text.primary',
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
            }}
          >
            Catalog
          </MuiLink>
        </Link>
        {category && (
          <Typography
            color="text.primary"
            sx={{
              fontWeight: 500,
            }}
          >
            {category.name}
          </Typography>
        )}
      </Breadcrumbs>

      {/* Header with title and controls */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* Title */}
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            {category?.name || 'All Products'}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
            }}
          >
            {resultsText}
          </Typography>
        </Box>

        {/* Controls - rendered by parent */}
        {!isMobile && children && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            {children}
          </Stack>
        )}
      </Stack>

      {/* Mobile controls */}
      {isMobile && children && (
        <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          {children}
        </Stack>
      )}
    </Box>
  );
}
