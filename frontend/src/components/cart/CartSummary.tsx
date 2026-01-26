'use client';

import Link from 'next/link';
import { Box } from '@mui/material';
import type { Cart } from '@/types';

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

interface CartSummaryProps {
  cart: Cart;
  isUpdating?: boolean;
}

export function CartSummary({ cart, isUpdating = false }: CartSummaryProps) {
  const parsedSubtotal = Number(cart.total);
  const subtotal = Number.isFinite(parsedSubtotal) ? parsedSubtotal : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax estimate
  const total = subtotal + shipping + tax;
  const freeShippingRemaining = Math.max(0, 100 - subtotal);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: '14px',
      }}
    >
      <Box
        sx={{
          fontSize: '1.25rem',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          color: 'text.primary',
          mb: 3,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        Order Summary
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
            Subtotal ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Box>
          <Box sx={{ fontSize: '0.95rem', fontWeight: 600 }}>${subtotal.toFixed(2)}</Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>Shipping</Box>
          <Box sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
            {shipping === 0 ? (
              <Box component="span" sx={{ color: 'secondary.main' }}>
                FREE
              </Box>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>Estimated Tax</Box>
          <Box sx={{ fontSize: '0.95rem', fontWeight: 600 }}>${tax.toFixed(2)}</Box>
        </Box>

        {shipping > 0 && freeShippingRemaining > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(158, 255, 0, 0.08)'
                  : 'rgba(158, 255, 0, 0.12)',
              borderRadius: '10px',
              mt: 1,
            }}
          >
            <TruckIcon />
            <Box sx={{ fontSize: '0.8rem', color: 'secondary.main', fontWeight: 600 }}>
              Add ${freeShippingRemaining.toFixed(2)} more for free shipping!
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          height: '1px',
          bgcolor: 'divider',
          mb: 3,
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'text.primary',
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          Total
        </Box>
        <Box
          sx={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'text.primary',
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          ${total.toFixed(2)}
        </Box>
      </Box>

      <Box
        component={Link}
        href="/checkout"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 2,
          px: 3,
          bgcolor: isUpdating || cart.item_count === 0 ? 'grey.400' : 'secondary.main',
          color: 'secondary.contrastText',
          border: 'none',
          borderRadius: '14px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: isUpdating || cart.item_count === 0 ? 'not-allowed' : 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: isUpdating || cart.item_count === 0 ? 'none' : 'auto',
          '&:hover': {
            transform: isUpdating || cart.item_count === 0 ? 'none' : 'translateY(-2px)',
            boxShadow: isUpdating || cart.item_count === 0 ? 'none' : '0 8px 24px rgba(158, 255, 0, 0.3)',
          },
        }}
      >
        <LockIcon />
        Proceed to Checkout
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          mt: 2,
          fontSize: '0.8rem',
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secure checkout
      </Box>
    </Box>
  );
}
