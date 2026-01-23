'use client';

import { use, useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import { useProductBySlug } from '@/lib/queries';
import { ProductDetail } from '@/components/catalog/ProductDetail';
import { useCartStore } from '@/stores/cart';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductBySlug(slug);

  const { addItem, isUpdating } = useCartStore();

  const handleAddToCart = async (variantId: string, quantity: number) => {
    if (!product) return;

    try {
      await addItem(product.id, variantId, quantity);
      setSnackbar({
        open: true,
        message: 'Added to cart!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Failed to add to cart',
        severity: 'error',
      });
    }
  };

  // TODO: Integrate with wishlist in Batch 6
  const handleWishlistToggle = (productId: string) => {
    console.log('Toggle wishlist:', productId);
    // Will be implemented in Batch 6
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProductDetail
        product={product}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
        isInWishlist={false}
        isAddingToCart={isUpdating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
