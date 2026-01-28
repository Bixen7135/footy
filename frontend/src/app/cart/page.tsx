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
    if (!cart) {
      fetchCart();
    }
  }, [fetchCart, cart]);

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

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAF7' : '#0a0a0a'),
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            component={Link}
            href="/"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              textDecoration: 'none',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'color 0.2s',
              '&:hover': { color: 'secondary.main' },
            }}
          >
            Home
          </Box>
          <Box sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>/</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'secondary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cart</Box>
        </Box>

        {/* Page Title - Brutalist Style */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          sx={{ mb: { xs: 4, md: 6 }, position: 'relative' }}
        >
          <Box
            component="h1"
            sx={{
              fontFamily: 'var(--font-archivo-black)',
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
              fontWeight: 400,
              textTransform: 'uppercase',
              lineHeight: 0.85,
              letterSpacing: '-0.02em',
              color: 'text.primary',
              mb: 2,
              display: 'inline-block',
              position: 'relative',
            }}
          >
            YOUR
            <Box
              component="span"
              sx={{
                display: 'block',
                color: 'secondary.main',
                WebkitTextStroke: { xs: '1px', md: '2px' },
                WebkitTextStrokeColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#9EFF00',
                paintOrder: 'stroke fill',
              }}
            >
              CART
            </Box>
          </Box>
          {cart && cart.item_count > 0 && (
            <Box
              sx={{
                display: 'inline-block',
                px: 2.5,
                py: 1,
                ml: { xs: 0, md: 3 },
                bgcolor: 'secondary.main',
                color: '#000',
                fontWeight: 900,
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
                transform: 'rotate(-2deg)',
              }}
            >
              {cart.item_count} {cart.item_count === 1 ? 'ITEM' : 'ITEMS'}
            </Box>
          )}
        </Box>

        {/* Error Alert - Brutalist Style */}
        {error && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#ff0000',
              color: '#fff',
              border: '3px solid #000',
              boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.4)',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ⚠ {error}
          </Box>
        )}

        {isEmpty ? (
          <Box sx={{ py: 4 }}>
            <EmptyCartState onContinueShopping={handleContinueShopping} />
          </Box>
        ) : (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 420px' }, gap: 4 }}
          >
            {/* Cart Items */}
            <Box>
              <Box
                component={Link}
                href="/catalog"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  mb: 4,
                  bgcolor: 'transparent',
                  border: '3px solid',
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                  color: 'text.primary',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translate(-2px, -2px)',
                    boxShadow: '4px 4px 0px rgba(158, 255, 0, 0.8)',
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                  },
                }}
              >
                <ArrowLeftIcon />
                Continue Shopping
              </Box>

              <Box
                component={motion.div}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.variant_id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                          delay: index * 0.05,
                        },
                      },
                    }}
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      isUpdating={isUpdating}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Order Summary - Sticky */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 100 },
                height: 'fit-content',
              }}
            >
              <CartSummary cart={cart} isUpdating={isUpdating} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
