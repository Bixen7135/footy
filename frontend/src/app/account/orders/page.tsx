'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { api } from '@/lib/api';
import { useAuthStore, initializeAuth, getAccessToken } from '@/stores/auth';
import type { Order, OrderListResponse, OrderStatus } from '@/types';

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

function OrdersContent() {
  const { isAuthenticated } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsAuthReady(true);
    };
    init();
  }, []);

  const fetchOrders = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const token = getAccessToken();
      const response = await api.get<OrderListResponse>('/orders', {
        params: { page: pageNum, page_size: 10 },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        withCredentials: true,
      });
      setOrders(response.data.items);
      setTotalPages(response.data.pages);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      setError(null);
      setIsLoading(false);
      return;
    }
    fetchOrders(page);
  }, [page, isAuthenticated, isAuthReady]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthReady || isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to view your orders.
        </Alert>
        <Button component={Link} href="/login?redirect=%2Faccount%2Forders" variant="contained">
          Log In
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAF7' : '#0a0a0a'),
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header - Brutalist */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          <Typography
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
            }}
          >
            ORDER
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
              HISTORY
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Track your purchases
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '3px solid',
              borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
              boxShadow: '8px 8px 0px rgba(158, 255, 0, 0.3)',
            }}
          >
            <ReceiptLongIcon
              sx={{
                fontSize: { xs: 80, md: 100 },
                color: 'text.secondary',
                mb: 3,
                opacity: 0.5,
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-archivo-black)',
                fontSize: { xs: '2rem', md: '3rem' },
                textTransform: 'uppercase',
                mb: 2,
                lineHeight: 1,
              }}
            >
              NO ORDERS YET
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: 'text.secondary',
                mb: 4,
                fontWeight: 600,
              }}
            >
              When you place an order, it will appear here.
            </Typography>
            <Button
              component={Link}
              href="/catalog"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'secondary.main',
                color: '#000',
                px: 5,
                py: 2,
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '3px solid',
                borderColor: 'secondary.main',
                boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  bgcolor: '#B8FF33',
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <>
            {/* Orders Grid - Card-based */}
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
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {orders.map((order, index) => (
                <Box
                  key={order.id}
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: index * 0.05,
                      },
                    },
                  }}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    border: '3px solid',
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '6px',
                      bgcolor: order.status === 'delivered' ? 'secondary.main' : order.status === 'cancelled' ? 'error.main' : 'primary.main',
                    },
                    '&:hover': {
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '8px 8px 0px rgba(158, 255, 0, 0.4)',
                    },
                  }}
                >
                  {/* Order Number & Date */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        Order
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-satoshi)',
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        #{order.order_number}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.75,
                        bgcolor: order.status === 'delivered' ? 'secondary.main' : order.status === 'cancelled' ? 'error.main' : (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                        color: order.status === 'delivered' ? '#000' : order.status === 'cancelled' ? '#fff' : (theme) => theme.palette.mode === 'light' ? '#fff' : '#000',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        border: '2px solid',
                        borderColor: order.status === 'delivered' ? 'secondary.main' : order.status === 'cancelled' ? 'error.main' : (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                      }}
                    >
                      {STATUS_LABELS[order.status]}
                    </Box>
                  </Box>

                  {/* Date & Items */}
                  <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        Date
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {formatDate(order.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        Items
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Total & Action */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        Total
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-archivo-black)',
                          fontSize: '1.8rem',
                          fontWeight: 400,
                          lineHeight: 1,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {formatPrice(Number(order.total))}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/account/orders/${order.id}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: 'transparent',
                        color: 'text.primary',
                        px: 3,
                        py: 1.25,
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: '3px solid',
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                        '&:hover': {
                          bgcolor: 'secondary.main',
                          color: '#000',
                          borderColor: 'secondary.main',
                          transform: 'translate(-2px, -2px)',
                          boxShadow: '4px 4px 0px rgba(158, 255, 0, 0.8)',
                        },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>

            {totalPages > 1 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: '2px solid',
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        bgcolor: 'secondary.main',
                        color: '#000',
                        borderColor: 'secondary.main',
                        fontWeight: 900,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default function OrdersPage() {
  return <OrdersContent />;
}
