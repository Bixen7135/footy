'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { ProtectedRoute } from '@/components/auth';
import { api } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const ORDER_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

function getStepIndex(status: OrderStatus): number {
  const stepMap: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };
  return stepMap[status];
}

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get<Order>(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          component={Link}
          href="/account/orders"
          startIcon={<ArrowBackIcon />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  const stepIndex = getStepIndex(order.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/account/orders"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Order {order.order_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.created_at)}
            </Typography>
          </Box>
          <Chip
            label={STATUS_LABELS[order.status]}
            color={STATUS_COLORS[order.status]}
            size="medium"
          />
        </Box>
      </Box>

      {/* Order Progress (if not cancelled) */}
      {order.status !== 'cancelled' && (
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider' }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Order Progress
          </Typography>
          <Stepper activeStep={stepIndex} alternativeLabel sx={{ mt: 2 }}>
            {ORDER_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: 1, borderColor: 'divider' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ReceiptOutlinedIcon />
              <Typography variant="h6" fontWeight={600}>
                Order Items
              </Typography>
            </Box>

            {order.items.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
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
                        width={80}
                        height={80}
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
                    <Typography variant="body1" fontWeight={500}>
                      {item.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unit Price: {formatPrice(Number(item.unit_price))}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {formatPrice(Number(item.subtotal))}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary & Shipping */}
        <Grid xs={12} md={4}>
          {/* Shipping Address */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalShippingOutlinedIcon />
              <Typography variant="h6" fontWeight={600}>
                Shipping Address
              </Typography>
            </Box>
            <Typography variant="body2">
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
              <br />
              {order.shipping_address.country}
              <br />
              <br />
              Phone: {order.shipping_address.phone}
            </Typography>
          </Paper>

          {/* Order Summary */}
          <Paper
            elevation={0}
            sx={{ p: 3, border: 1, borderColor: 'divider' }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

            {order.notes && (
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Order Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
