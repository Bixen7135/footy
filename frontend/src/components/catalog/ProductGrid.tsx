'use client';

import { Grid, Box, Pagination, Typography } from '@mui/material';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { EmptyState, ErrorState } from '../ui/States';
import type { Product, ProductListResponse } from '@/types';

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
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={12} />;
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
      <EmptyState
        title="No products found"
        message="Try adjusting your filters or search terms."
        action={
          onRetry
            ? { label: 'Clear Filters', onClick: onRetry }
            : undefined
        }
      />
    );
  }

  return (
    <Box>
      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {products.items.length} of {products.total} products
      </Typography>

      {/* Product grid */}
      <Grid container spacing={3}>
        {products.items.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard
              product={product}
              isInWishlist={wishlistIds.includes(product.id)}
              onWishlistToggle={onWishlistToggle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {products.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={products.pages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
