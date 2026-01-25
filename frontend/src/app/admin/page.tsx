'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  LocalShipping as PendingIcon,
} from '@mui/icons-material';
import { api } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  orders_by_status: Record<OrderStatus, number>;
}

function StatCard({
  title,
  value,
  icon,
  color,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          {isLoading ? (
            <Skeleton width={100} height={40} />
          ) : (
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: color,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
};

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
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load dashboard data. Please ensure you have admin access.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={stats ? `$${stats.total_revenue.toFixed(2)}` : '-'}
            icon={<RevenueIcon />}
            color="#4caf50"
            isLoading={statsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.total_orders ?? '-'}
            icon={<OrdersIcon />}
            color="#2196f3"
            isLoading={statsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value={stats?.pending_orders ?? '-'}
            icon={<PendingIcon />}
            color="#ff9800"
            isLoading={statsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Processing"
            value={stats?.orders_by_status?.processing ?? 0}
            icon={<ProductsIcon />}
            color="#9c27b0"
            isLoading={statsLoading}
          />
        </Grid>
      </Grid>

      {/* Orders by Status */}
      {stats && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Orders by Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(stats.orders_by_status).map(([status, count]) => (
              <Chip
                key={status}
                label={`${status}: ${count}`}
                color={statusColors[status as OrderStatus] || 'default'}
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : recentOrders?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No orders yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders?.items.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{order.shipping_address.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={statusColors[order.status]}
                      />
                    </TableCell>
                    <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
