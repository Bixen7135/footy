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
        p: { xs: 3, md: 4 },
        bgcolor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
        color: (theme) => theme.palette.mode === 'light' ? '#fff' : '#000',
        border: '3px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
        boxShadow: '8px 8px 0px rgba(158, 255, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(158, 255, 0, 0.05) 20px, rgba(158, 255, 0, 0.05) 40px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          fontFamily: 'var(--font-archivo-black)',
          fontSize: { xs: '1.8rem', md: '2.2rem' },
          fontWeight: 400,
          textTransform: 'uppercase',
          lineHeight: 0.9,
          letterSpacing: '-0.01em',
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        ORDER
        <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>
          SUMMARY
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
            }}
          >
            Subtotal ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Box>
          <Box sx={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-satoshi)' }}>
            ${subtotal.toFixed(2)}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
            }}
          >
            Shipping
          </Box>
          <Box sx={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-satoshi)' }}>
            {shipping === 0 ? (
              <Box
                component="span"
                sx={{
                  color: 'secondary.main',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: (theme) => theme.palette.mode === 'light' ? '#9EFF00' : '#000',
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                }}
              >
                FREE
              </Box>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
            }}
          >
            Est. Tax
          </Box>
          <Box sx={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-satoshi)' }}>
            ${tax.toFixed(2)}
          </Box>
        </Box>

        {shipping > 0 && freeShippingRemaining > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              bgcolor: 'secondary.main',
              color: '#000',
              border: '3px solid',
              borderColor: (theme) => theme.palette.mode === 'light' ? '#9EFF00' : '#000',
              mt: 1,
              boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
            }}
          >
            <TruckIcon />
            <Box sx={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Add ${freeShippingRemaining.toFixed(2)} for free ship!
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          height: '3px',
          bgcolor: 'secondary.main',
          mb: 3,
          position: 'relative',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            fontFamily: 'var(--font-archivo-black)',
            fontSize: { xs: '1.5rem', md: '1.8rem' },
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}
        >
          TOTAL
        </Box>
        <Box
          sx={{
            fontFamily: 'var(--font-archivo-black)',
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 400,
            color: 'secondary.main',
            lineHeight: 1,
            letterSpacing: '-0.02em',
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
          gap: 2,
          py: 2.5,
          px: 4,
          bgcolor: isUpdating || cart.item_count === 0 ? 'grey.400' : 'secondary.main',
          color: '#000',
          border: '3px solid',
          borderColor: isUpdating || cart.item_count === 0 ? 'grey.400' : 'secondary.main',
          fontSize: { xs: '1rem', md: '1.1rem' },
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: isUpdating || cart.item_count === 0 ? 'not-allowed' : 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isUpdating || cart.item_count === 0 ? 'none' : 'auto',
          position: 'relative',
          zIndex: 1,
          boxShadow: isUpdating || cart.item_count === 0 ? 'none' : '6px 6px 0px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            transform: isUpdating || cart.item_count === 0 ? 'none' : 'translate(-2px, -2px)',
            boxShadow: isUpdating || cart.item_count === 0 ? 'none' : '8px 8px 0px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <LockIcon />
        CHECKOUT NOW
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mt: 3,
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secure Checkout
      </Box>
    </Box>
  );
}
