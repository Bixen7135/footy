'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { ProtectedRoute } from '@/components/auth';
import { api } from '@/lib/api';
import { useCheckoutStore } from '@/stores/checkout';
import type { Order } from '@/types';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  useEffect(() => {
    // Reset checkout state
    resetCheckout();

    // Fetch order details
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('Order not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<Order>(`/orders/number/${orderNumber}`);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, resetCheckout]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button component={Link} href="/" variant="contained">
          Go to Homepage
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Success header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleOutlineIcon
          sx={{ fontSize: 72, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order confirmation has been sent to your email.
        </Typography>
      </Box>

      {/* Order details */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Order Number
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {order.order_number}
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Items */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Order Items
        </Typography>
        <Box sx={{ mb: 3 }}>
          {order.items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.5,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  bgcolor: 'grey.100',
                  flexShrink: 0,
                }}
              >
                {item.product_image && item.product_image.startsWith('http') ? (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      fontWeight: 600,
                      textAlign: 'center',
                      px: 1,
                    }}
                  >
                    {item.product_name}
                  </Box>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {item.product_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {item.size} | Qty: {item.quantity}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={500}>
                {formatPrice(Number(item.subtotal))}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Shipping address */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocalShippingOutlinedIcon
                sx={{ color: 'text.secondary', mt: 0.5 }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shipping_address.name}
                  <br />
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 && (
                    <>
                      <br />
                      {order.shipping_address.line2}
                    </>
                  )}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Order summary */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Order Total
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">
                  {formatPrice(Number(order.subtotal))}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {Number(order.shipping_cost) === 0
                    ? 'FREE'
                    : formatPrice(Number(order.shipping_cost))}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Tax
                </Typography>
                <Typography variant="body2">
                  {formatPrice(Number(order.tax))}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {formatPrice(Number(order.total))}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button component={Link} href="/account/orders" variant="outlined">
          View All Orders
        </Button>
        <Button component={Link} href="/catalog" variant="contained">
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}

function ConfirmationPageWrapper() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

export default function ConfirmationPage() {
  return (
    <ProtectedRoute>
      <ConfirmationPageWrapper />
    </ProtectedRoute>
  );
}
