'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import type { ShippingAddress, Cart } from '@/types';

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
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Review Your Order
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Shipping address summary */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Shipping Address
        </Typography>
        <Typography variant="body2">
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
          {shippingAddress.city}, {shippingAddress.state}{' '}
          {shippingAddress.postal_code}
          <br />
          {shippingAddress.country}
          <br />
          Phone: {shippingAddress.phone}
        </Typography>
        <Button
          size="small"
          onClick={onBack}
          sx={{ mt: 1 }}
        >
          Edit Address
        </Button>
      </Paper>

      {/* Order notes */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Order Notes (optional)"
        placeholder="Any special instructions for your order..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Action buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LockIcon />
            )
          }
          sx={{ height: 56 }}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          disabled={isSubmitting}
          startIcon={<ArrowBackIcon />}
        >
          Back to Shipping
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', mt: 2 }}
      >
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </Typography>
    </Box>
  );
}
