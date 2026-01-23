'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid2 as Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ProtectedRoute } from '@/components/auth';
import { ShippingForm, CheckoutSummary, ReviewStep } from '@/components/checkout';
import { useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';
import type { ShippingAddress } from '@/types';

const STEPS = ['Shipping', 'Review', 'Complete'];

function CheckoutContent() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const {
    step,
    shippingAddress,
    order,
    isSubmitting,
    error,
    setShippingAddress,
    setStep,
    submitOrder,
    resetCheckout,
    clearError,
  } = useCheckoutStore();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Reset checkout when component unmounts
  useEffect(() => {
    return () => {
      // Only reset if not completed
      if (step !== 'complete') {
        resetCheckout();
      }
    };
  }, []);

  const stepIndex =
    step === 'shipping' ? 0 : step === 'review' ? 1 : 2;

  const handleShippingSubmit = (address: ShippingAddress) => {
    clearError();
    setShippingAddress(address);
  };

  const handleBack = () => {
    clearError();
    setStep('shipping');
  };

  const handleSubmitOrder = async (notes?: string) => {
    try {
      const createdOrder = await submitOrder(notes);
      // Refresh cart (should be empty now)
      await fetchCart();
      // Navigate to confirmation
      router.push(`/checkout/confirmation?order=${createdOrder.order_number}`);
    } catch {
      // Error is handled in store
    }
  };

  // Empty cart check
  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some items to your cart before checking out.
          </Typography>
          <Button
            component={Link}
            href="/catalog"
            variant="contained"
            size="large"
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Checkout
      </Typography>

      {/* Progress stepper */}
      <Stepper activeStep={stepIndex} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Main content */}
        <Grid size={{ xs: 12, md: 7 }}>
          {step === 'shipping' && (
            <ShippingForm
              onSubmit={handleShippingSubmit}
              initialValues={shippingAddress || undefined}
            />
          )}

          {step === 'review' && shippingAddress && (
            <ReviewStep
              shippingAddress={shippingAddress}
              cart={cart}
              onBack={handleBack}
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </Grid>

        {/* Order summary sidebar */}
        <Grid size={{ xs: 12, md: 5 }}>
          <CheckoutSummary
            cart={cart}
            shippingAddress={step === 'review' ? shippingAddress : null}
            showItems={true}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
