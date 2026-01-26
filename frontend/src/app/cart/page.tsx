'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCartState } from '@/components/ui/States';

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LoadingDots = () => (
  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', py: 8 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: 'secondary.main',
        }}
      />
    ))}
  </Box>
);

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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <LoadingDots />
        <Box sx={{ textAlign: 'center', mt: 2, fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
          Loading your cart...
        </Box>
      </Container>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          component={Link}
          href="/"
          sx={{
            fontSize: '0.9rem',
            color: 'text.secondary',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s',
            '&:hover': { color: 'secondary.main' },
          }}
        >
          Home
        </Box>
        <Box sx={{ color: 'text.disabled', fontSize: '0.9rem' }}>/</Box>
        <Box sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 600 }}>Shopping Cart</Box>
      </Box>

      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Box
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'text.primary',
            mb: 1,
            fontFamily: 'var(--font-satoshi)',
            display: 'inline-block',
          }}
        >
          Shopping Cart
          {cart && cart.item_count > 0 && (
            <Box
              component="span"
              sx={{
                ml: 2,
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                color: 'text.secondary',
                fontFamily: 'inherit',
              }}
            >
              ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
            </Box>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(255, 0, 0, 0.08)'
                : 'rgba(255, 0, 0, 0.15)',
            borderLeft: '4px solid',
            borderLeftColor: 'error.main',
            borderRadius: '12px',
            color: (theme) => (theme.palette.mode === 'light' ? '#d32f2f' : '#ff5252'),
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          {error}
        </Box>
      )}

      {isEmpty ? (
        <Box sx={{ py: 4 }}>
          <EmptyCartState onContinueShopping={handleContinueShopping} />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: 4 }}>
          {/* Cart Items */}
          <Box>
            <Box
              component={Link}
              href="/catalog"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1.5,
                mb: 3,
                bgcolor: 'transparent',
                border: '2px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                color: 'text.primary',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                '&:hover': {
                  borderColor: 'secondary.main',
                  transform: 'translateY(-2px)',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(158, 255, 0, 0.04)'
                      : 'rgba(158, 255, 0, 0.08)',
                },
              }}
            >
              <ArrowLeftIcon />
              Continue Shopping
            </Box>

            {cart.items.map((item) => (
              <CartItem
                key={item.variant_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                isUpdating={isUpdating}
              />
            ))}
          </Box>

          {/* Order Summary */}
          <Box
            sx={{
              position: { md: 'sticky' },
              top: { md: 100 },
              height: 'fit-content',
            }}
          >
            <CartSummary cart={cart} isUpdating={isUpdating} />
          </Box>
        </Box>
      )}
    </Container>
  );
}
