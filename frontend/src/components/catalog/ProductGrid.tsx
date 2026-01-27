'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { EmptyProductsState, ErrorState } from '../ui/States';
import type { ProductListResponse } from '@/types';

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronsLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);

const ChevronsRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

interface ProductGridProps {
  products?: ProductListResponse;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  page: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  wishlistIds?: string[];
  onWishlistToggle?: (productId: string) => void;
  viewMode?: 'grid2' | 'grid3' | 'grid4' | 'list';
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  error,
  page,
  onPageChange,
  onRetry,
  wishlistIds = [],
  onWishlistToggle,
  viewMode = 'grid4',
}: ProductGridProps) {
  // Determine grid columns based on view mode
  const getGridTemplate = () => {
    switch (viewMode) {
      case 'grid2':
        return { xs: '1fr', sm: 'repeat(2, 1fr)' };
      case 'grid3':
        return { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' };
      case 'grid4':
        return { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' };
      case 'list':
        return { xs: '1fr' };
      default:
        return { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' };
    }
  };

  const gridTemplate = getGridTemplate();

  // Scroll to top on page change
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange(newPage);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (isLoading) {
    return <ProductGridSkeleton count={12} viewMode={viewMode} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || 'Failed to load products'}
        onRetry={onRetry}
      />
    );
  }

  if (!products || products.items.length === 0) {
    return (
      <EmptyProductsState
        hasFilters={true}
        onClearFilters={onRetry}
      />
    );
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPages = products.pages;
    const current = page;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Box>
      {/* Product grid */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        sx={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap: viewMode === 'list' ? 2 : 3,
        }}
      >
        {products.items.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              product={product}
              isInWishlist={wishlistIds.includes(product.id)}
              onWishlistToggle={onWishlistToggle}
              variant={viewMode === 'list' ? 'list' : 'grid'}
            />
          </motion.div>
        ))}
      </Box>

      {/* Pagination */}
      {products.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 8 }}>
          {/* First page */}
          <Box
            component="button"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              color: 'text.primary',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                borderColor: page === 1 ? 'divider' : 'secondary.main',
                transform: page === 1 ? 'none' : 'translateY(-2px)',
                bgcolor: page === 1
                  ? 'transparent'
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(158, 255, 0, 0.08)'
                        : 'rgba(158, 255, 0, 0.12)',
              },
            }}
          >
            <ChevronsLeftIcon />
          </Box>

          {/* Previous page */}
          <Box
            component="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              color: 'text.primary',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                borderColor: page === 1 ? 'divider' : 'secondary.main',
                transform: page === 1 ? 'none' : 'translateY(-2px)',
                bgcolor: page === 1
                  ? 'transparent'
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(158, 255, 0, 0.08)'
                        : 'rgba(158, 255, 0, 0.12)',
              },
            }}
          >
            <ChevronLeftIcon />
          </Box>

          {/* Page numbers */}
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === '...' ? (
              <Box
                key={`ellipsis-${idx}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  color: 'text.disabled',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                ...
              </Box>
            ) : (
              <Box
                key={pageNum}
                component="button"
                onClick={() => handlePageChange(pageNum as number)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 44,
                  height: 44,
                  px: 1.5,
                  bgcolor: page === pageNum ? 'secondary.main' : 'transparent',
                  color: page === pageNum ? 'secondary.contrastText' : 'text.primary',
                  border: '2px solid',
                  borderColor: page === pageNum ? 'secondary.main' : 'divider',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    transform: 'translateY(-2px)',
                    ...(page !== pageNum && {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(158, 255, 0, 0.08)'
                          : 'rgba(158, 255, 0, 0.12)',
                    }),
                  },
                }}
              >
                {pageNum}
              </Box>
            )
          )}

          {/* Next page */}
          <Box
            component="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === products.pages}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              color: 'text.primary',
              cursor: page === products.pages ? 'not-allowed' : 'pointer',
              opacity: page === products.pages ? 0.4 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                borderColor: page === products.pages ? 'divider' : 'secondary.main',
                transform: page === products.pages ? 'none' : 'translateY(-2px)',
                bgcolor: page === products.pages
                  ? 'transparent'
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(158, 255, 0, 0.08)'
                        : 'rgba(158, 255, 0, 0.12)',
              },
            }}
          >
            <ChevronRightIcon />
          </Box>

          {/* Last page */}
          <Box
            component="button"
            onClick={() => handlePageChange(products.pages)}
            disabled={page === products.pages}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              color: 'text.primary',
              cursor: page === products.pages ? 'not-allowed' : 'pointer',
              opacity: page === products.pages ? 0.4 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                borderColor: page === products.pages ? 'divider' : 'secondary.main',
                transform: page === products.pages ? 'none' : 'translateY(-2px)',
                bgcolor: page === products.pages
                  ? 'transparent'
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(158, 255, 0, 0.08)'
                        : 'rgba(158, 255, 0, 0.12)',
              },
            }}
          >
            <ChevronsRightIcon />
          </Box>
        </Box>
      )}
    </Box>
  );
}
