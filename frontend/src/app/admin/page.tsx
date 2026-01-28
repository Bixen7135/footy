'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as PendingIcon,
  Inventory as ProductsIcon,
} from '@mui/icons-material';
import { api } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';
import { motion } from 'framer-motion';

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  orders_by_status: Record<OrderStatus, number>;
}

const statusColors: Record<OrderStatus, string> = {
  pending: '#ff9800',
  confirmed: '#2196f3',
  processing: '#9c27b0',
  shipped: '#00bcd4',
  delivered: '#9EFF00',
  cancelled: '#f44336',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  processing: 'PROCESSING',
  shipped: 'SHIPPED',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
};

function CommandCard({
  title,
  value,
  icon,
  color,
  isLoading,
  unit = '',
  code,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
  unit?: string;
  code: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#0a0a0a',
          border: '2px solid',
          borderColor: color,
          p: 3,
          height: '100%',
          overflow: 'hidden',
          boxShadow: `0 0 20px ${color}33`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 0 30px ${color}66, inset 0 0 20px ${color}11`,
          },
        }}
      >
        {/* Background grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${color}15 1px, transparent 1px), linear-gradient(90deg, ${color}15 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header with code */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                bgcolor: color,
                color: '#000',
                border: '2px solid #000',
                boxShadow: `4px 4px 0 ${color}66`,
              }}
            >
              {icon}
            </Box>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: `${color}99`,
                letterSpacing: '0.1em',
                border: `1px solid ${color}44`,
                px: 1,
                py: 0.5,
              }}
            >
              {code}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: `${color}cc`,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              mb: 1.5,
            }}
          >
            /// {title}
          </Typography>

          {/* Value */}
          {isLoading ? (
            <Skeleton
              sx={{
                bgcolor: `${color}22`,
                height: 56,
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-archivo-black)',
                  fontSize: '3rem',
                  color: color,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${color}66`,
                }}
              >
                {value}
              </Typography>
              {unit && (
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: `${color}99`,
                    fontWeight: 700,
                  }}
                >
                  {unit}
                </Typography>
              )}
            </Box>
          )}

          {/* Status bar */}
          <Box
            sx={{
              mt: 2,
              height: 4,
              bgcolor: `${color}22`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.5 }}
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                bgcolor: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<OrderStats>({
    queryKey: ['admin', 'order-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/orders/stats/summary');
      return response.data;
    },
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery<{ items: Order[] }>({
    queryKey: ['admin', 'recent-orders'],
    queryFn: async () => {
      const response = await api.get('/admin/orders?page_size=5');
      return response.data;
    },
  });

  if (statsError) {
    return (
      <Alert
        severity="error"
        sx={{
          bgcolor: 'rgba(244, 67, 54, 0.1)',
          border: '2px solid #f44336',
          color: '#ff6666',
          '& .MuiAlert-icon': { color: '#f44336' },
        }}
      >
        SYSTEM ERROR: Failed to load dashboard data. Ensure admin access is configured.
      </Alert>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: 'rgba(158, 255, 0, 0.6)',
            letterSpacing: '0.15em',
            mb: 1,
          }}
        >
          /// SYSTEM OVERVIEW
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-archivo-black)',
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: '#9EFF00',
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 0 20px rgba(158, 255, 0, 0.4)',
          }}
        >
          COMMAND CENTER
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }} component={motion.div} variants={containerVariants} initial="hidden" animate="show">
        <Grid item xs={12} sm={6} lg={3}>
          <CommandCard
            title="TOTAL REVENUE"
            value={stats ? `$${stats.total_revenue.toFixed(2)}` : '-'}
            icon={<RevenueIcon sx={{ fontSize: 28 }} />}
            color="#9EFF00"
            isLoading={statsLoading}
            code="REV_01"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CommandCard
            title="TOTAL ORDERS"
            value={stats?.total_orders ?? '-'}
            icon={<OrdersIcon sx={{ fontSize: 28 }} />}
            color="#2196f3"
            isLoading={statsLoading}
            code="ORD_01"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CommandCard
            title="PENDING QUEUE"
            value={stats?.pending_orders ?? '-'}
            icon={<PendingIcon sx={{ fontSize: 28 }} />}
            color="#ff9800"
            isLoading={statsLoading}
            code="PND_01"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CommandCard
            title="IN PROCESS"
            value={stats?.orders_by_status?.processing ?? 0}
            icon={<ProductsIcon sx={{ fontSize: 28 }} />}
            color="#9c27b0"
            isLoading={statsLoading}
            code="PRC_01"
          />
        </Grid>
      </Grid>

      {/* Status Matrix */}
      {stats && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          sx={{
            bgcolor: '#0a0a0a',
            border: '2px solid #9EFF00',
            p: 3,
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(158, 255, 0, 0.2)',
          }}
        >
          {/* Background grid */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(158, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(158, 255, 0, 0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.2,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#9EFF00',
                letterSpacing: '0.15em',
                mb: 3,
              }}
            >
              /// ORDER STATUS MATRIX
            </Typography>

            <Grid container spacing={2}>
              {Object.entries(stats.orders_by_status).map(([status, count]) => {
                const color = statusColors[status as OrderStatus];
                const percentage = stats.total_orders > 0 ? (count / stats.total_orders) * 100 : 0;

                return (
                  <Grid item xs={6} sm={4} md={2} key={status}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: `${color}66`,
                        bgcolor: `${color}11`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: color,
                          bgcolor: `${color}22`,
                          boxShadow: `0 0 15px ${color}33`,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                          color: `${color}cc`,
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        {statusLabels[status as OrderStatus]}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-archivo-black)',
                          fontSize: '2rem',
                          color: color,
                          lineHeight: 1,
                          mb: 1,
                        }}
                      >
                        {count}
                      </Typography>
                      <Box
                        sx={{
                          height: 3,
                          bgcolor: `${color}33`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component={motion.div}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            bgcolor: color,
                            boxShadow: `0 0 8px ${color}`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Recent Orders Terminal */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        sx={{
          bgcolor: '#0a0a0a',
          border: '2px solid #9EFF00',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 30px rgba(158, 255, 0, 0.2)',
        }}
      >
        {/* Terminal header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'rgba(158, 255, 0, 0.05)',
            borderBottom: '1px solid rgba(158, 255, 0, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9EFF00' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#9EFF00',
                letterSpacing: '0.15em',
              }}
            >
              /// RECENT_ORDERS.LOG
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: 'rgba(158, 255, 0, 0.6)',
              letterSpacing: '0.1em',
            }}
          >
            LAST 5 ENTRIES
          </Typography>
        </Box>

        {/* Orders table */}
        <TableContainer sx={{ bgcolor: '#000' }}>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(158, 255, 0, 0.15)' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(158, 255, 0, 0.03)' }}>
                {['ORDER_ID', 'CUSTOMER', 'STATUS', 'AMOUNT', 'TIMESTAMP'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: '#9EFF00',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                      py: 1.5,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton sx={{ bgcolor: 'rgba(158, 255, 0, 0.1)' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : recentOrders?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        color: 'rgba(158, 255, 0, 0.5)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      /// NO DATA AVAILABLE
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders?.items.map((order, index) => (
                  <TableRow
                    key={order.id}
                    component={motion.tr}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(158, 255, 0, 0.05)',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: '#9EFF00',
                          fontWeight: 700,
                        }}
                      >
                        {order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {order.shipping_address.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}
                      >
                        {order.shipping_address.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.5,
                          border: '1px solid',
                          borderColor: statusColors[order.status],
                          bgcolor: `${statusColors[order.status]}22`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            bgcolor: statusColors[order.status],
                            boxShadow: `0 0 8px ${statusColors[order.status]}`,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: statusColors[order.status],
                            letterSpacing: '0.05em',
                          }}
                        >
                          {statusLabels[order.status]}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          color: '#9EFF00',
                          fontWeight: 700,
                        }}
                      >
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {new Date(order.created_at).toLocaleString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Terminal footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            bgcolor: 'rgba(158, 255, 0, 0.03)',
            borderTop: '1px solid rgba(158, 255, 0, 0.3)',
          }}
        >
          <Box
            component={motion.div}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            sx={{
              width: 8,
              height: 8,
              bgcolor: '#9EFF00',
              boxShadow: '0 0 10px #9EFF00',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'rgba(158, 255, 0, 0.7)',
              letterSpacing: '0.05em',
            }}
          >
            END OF LOG
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
