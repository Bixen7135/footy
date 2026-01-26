'use client';

import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import type { ShippingAddress, Cart } from '@/types';

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LoadingSpinner = () => (
  <Box
    component={motion.div}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  </Box>
);

interface ReviewStepProps {
  shippingAddress: ShippingAddress;
  cart: Cart;
  onBack: () => void;
  onSubmit: (notes?: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function ReviewStep({
  shippingAddress,
  cart,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: ReviewStepProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    await onSubmit(notes || undefined);
  };

  return (
    <Box>
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
        Review Your Order
      </Box>

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

      {/* Shipping address summary */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(158, 255, 0, 0.04)'
              : 'rgba(158, 255, 0, 0.08)',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: '14px',
        }}
      >
        <Box
          sx={{
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.primary',
            mb: 2,
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          Shipping Address
        </Box>
        <Box sx={{ fontSize: '0.95rem', color: 'text.primary', lineHeight: 1.8, mb: 2 }}>
          {shippingAddress.name}
          <br />
          {shippingAddress.line1}
          {shippingAddress.line2 && (
            <>
              <br />
              {shippingAddress.line2}
            </>
          )}
          <br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
          <br />
          {shippingAddress.country}
          <br />
          Phone: {shippingAddress.phone}
        </Box>
        <Box
          component="button"
          onClick={onBack}
          disabled={isSubmitting}
          sx={{
            px: 2.5,
            py: 1,
            bgcolor: 'transparent',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: '10px',
            color: 'text.primary',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.5 : 1,
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              borderColor: isSubmitting ? 'divider' : 'secondary.main',
              bgcolor: isSubmitting
                ? 'transparent'
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(158, 255, 0, 0.04)'
                      : 'rgba(158, 255, 0, 0.08)',
            },
          }}
        >
          Edit Address
        </Box>
      </Box>

      {/* Order notes */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Order Notes (optional)"
        placeholder="Any special instructions for your order..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isSubmitting}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'secondary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'secondary.main',
            },
          },
        }}
      />

      {/* Action buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          component="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            py: 2.5,
            px: 3,
            bgcolor: isSubmitting ? 'grey.400' : 'secondary.main',
            color: 'secondary.contrastText',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              transform: isSubmitting ? 'none' : 'translateY(-2px)',
              boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(158, 255, 0, 0.3)',
            },
          }}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            <>
              <LockIcon />
              Place Order
            </>
          )}
        </Box>

        <Box
          component="button"
          onClick={onBack}
          disabled={isSubmitting}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 2,
            px: 3,
            bgcolor: 'transparent',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: '14px',
            color: 'text.primary',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.5 : 1,
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              borderColor: isSubmitting ? 'divider' : 'secondary.main',
              transform: isSubmitting ? 'none' : 'translateY(-2px)',
              bgcolor: isSubmitting
                ? 'transparent'
                : (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(158, 255, 0, 0.04)'
                      : 'rgba(158, 255, 0, 0.08)',
            },
          }}
        >
          <ArrowLeftIcon />
          Back to Shipping
        </Box>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          mt: 3,
          fontSize: '0.75rem',
          color: 'text.secondary',
          lineHeight: 1.6,
        }}
      >
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </Box>
    </Box>
  );
}
