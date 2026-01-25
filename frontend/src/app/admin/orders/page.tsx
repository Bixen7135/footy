'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Alert,
  Snackbar,
  MenuItem,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { api } from '@/lib/api';
import type { Order, OrderStatus, OrderListResponse } from '@/types';

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
};

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data, isLoading, error } = useQuery<OrderListResponse>({
    queryKey: ['admin', 'orders', page, pageSize, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page + 1),
        page_size: String(pageSize),
      });
      if (statusFilter) params.append('status', statusFilter);
      const response = await api.get(`/admin/orders?${params}`);
      return response.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order-stats'] });
      setSnackbar({ open: true, message: 'Order status updated successfully', severity: 'success' });
      setStatusDialogOpen(false);
      setSelectedOrder(null);
    },
    onError: (err: any) => {
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Failed to update order status',
        severity: 'error',
      });
    },
  });

  const handleOpenStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      statusMutation.mutate({ orderId: selectedOrder.id, status: newStatus });
    }
  };
  const formatMoney = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '—');

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load orders. Please ensure you have admin access.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All Orders</MenuItem>
          {Object.keys(statusColors).map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={60} /></TableCell>
                  </TableRow>
                ))
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.shipping_address.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.shipping_address.city}, {order.shipping_address.state}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell align="right">${formatMoney(Number(order.total))}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={statusColors[order.status]}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      {validTransitions[order.status].length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenStatusDialog(order)}
                          title="Update Status"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.total || 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder && !statusDialogOpen}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order {selectedOrder.order_number}
              <Chip
                label={selectedOrder.status}
                size="small"
                color={statusColors[selectedOrder.status]}
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography>{selectedOrder.shipping_address.name}</Typography>
                  <Typography>{selectedOrder.shipping_address.line1}</Typography>
                  {selectedOrder.shipping_address.line2 && (
                    <Typography>{selectedOrder.shipping_address.line2}</Typography>
                  )}
                  <Typography>
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                    {selectedOrder.shipping_address.postal_code}
                  </Typography>
                  <Typography>{selectedOrder.shipping_address.country}</Typography>
                  <Typography sx={{ mt: 1 }}>
                    Phone: {selectedOrder.shipping_address.phone}
                  </Typography>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${formatMoney(Number(selectedOrder.subtotal))}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Shipping:</Typography>
                    <Typography>${formatMoney(Number(selectedOrder.shipping_cost))}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax:</Typography>
                    <Typography>${formatMoney(Number(selectedOrder.tax))}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={600}>Total:</Typography>
                    <Typography fontWeight={600}>${formatMoney(Number(selectedOrder.total))}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Ordered: {new Date(selectedOrder.created_at).toLocaleString()}
                  </Typography>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Items
                  </Typography>
                  <List disablePadding>
                    {selectedOrder.items.map((item) => (
                      <ListItem key={item.id} disableGutters>
                        <Avatar
                          variant="rounded"
                          src={
                            item.product_image && item.product_image.startsWith('http')
                              ? item.product_image
                              : undefined
                          }
                          sx={{ width: 50, height: 50, mr: 2 }}
                        >
                          {item.product_name[0]}
                        </Avatar>
                        <ListItemText
                          primary={item.product_name}
                          secondary={`Size: ${item.size} | Qty: ${item.quantity}`}
                        />
                        <Typography>${formatMoney(Number(item.subtotal))}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {selectedOrder.notes && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Notes
                    </Typography>
                    <Typography>{selectedOrder.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              {validTransitions[selectedOrder.status].length > 0 && (
                <Button
                  variant="contained"
                  onClick={() => handleOpenStatusDialog(selectedOrder)}
                >
                  Update Status
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography gutterBottom>
                Order: <strong>{selectedOrder.order_number}</strong>
              </Typography>
              <Typography gutterBottom>
                Current Status:{' '}
                <Chip
                  label={selectedOrder.status}
                  size="small"
                  color={statusColors[selectedOrder.status]}
                />
              </Typography>
              <TextField
                select
                fullWidth
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                sx={{ mt: 2 }}
              >
                {validTransitions[selectedOrder.status].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={!newStatus || statusMutation.isPending}
          >
            {statusMutation.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
