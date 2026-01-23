'use client';

import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import type { Cart } from '@/types';

interface CartSummaryProps {
  cart: Cart;
  isUpdating?: boolean;
}

export function CartSummary({ cart, isUpdating = false }: CartSummaryProps) {
  const subtotal = cart.total;
  const shipping = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax estimate
  const total = subtotal + shipping + tax;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Order Summary
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="text.secondary">
            Subtotal ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Typography>
          <Typography fontWeight={500}>${subtotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Shipping</Typography>
          <Typography fontWeight={500}>
            {shipping === 0 ? (
              <Box component="span" sx={{ color: 'success.main' }}>
                FREE
              </Box>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Estimated Tax</Typography>
          <Typography fontWeight={500}>${tax.toFixed(2)}</Typography>
        </Box>

        {shipping > 0 && (
          <Typography variant="body2" color="success.main">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" fontWeight={700}>
          ${total.toFixed(2)}
        </Typography>
      </Box>

      <Button
        component={Link}
        href="/checkout"
        variant="contained"
        size="large"
        fullWidth
        disabled={isUpdating || cart.item_count === 0}
        startIcon={<LockOutlinedIcon />}
        sx={{ py: 1.5, mb: 2 }}
      >
        Proceed to Checkout
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
      >
        <LockOutlinedIcon fontSize="small" />
        Secure checkout
      </Typography>
    </Paper>
  );
}
