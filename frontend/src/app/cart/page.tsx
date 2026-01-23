'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCartStore } from '@/stores/cart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCartState } from '@/components/ui/States';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    isUpdating,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleContinueShopping = () => {
    router.push('/catalog');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your cart...</Typography>
      </Container>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Shopping Cart</Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Shopping Cart
        {cart && cart.item_count > 0 && (
          <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '1rem' }}>
            ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Typography>
        )}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isEmpty ? (
        <Box sx={{ py: 4 }}>
          <EmptyCartState onContinueShopping={handleContinueShopping} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Button
              component={Link}
              href="/catalog"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 3 }}
            >
              Continue Shopping
            </Button>

            {cart.items.map((item) => (
              <CartItem
                key={item.variant_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                isUpdating={isUpdating}
              />
            ))}
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: { md: 'sticky' },
                top: { md: 100 },
              }}
            >
              <CartSummary cart={cart} isUpdating={isUpdating} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
