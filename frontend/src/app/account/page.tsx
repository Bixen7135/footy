'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid2 as Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { ProtectedRoute } from '@/components/auth';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { User } from '@/types';

function AccountContent() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await api.patch<User>('/users/me', {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
      });

      // Update local auth store
      useAuthStore.setState((state) => ({
        ...state,
        user: response.data,
      }));

      setIsEditing(false);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Account
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
            elevation={0}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Profile Information
              </Typography>
              {!isEditing && (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Phone (optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                  size="small"
                  helperText="Email cannot be changed"
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.email}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {user?.phone || 'Not provided'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
            elevation={0}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                component={Link}
                href="/account/orders"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                View Order History
              </Button>
              <Button
                component={Link}
                href="/account/wishlist"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                My Wishlist
              </Button>
              <Button
                component={Link}
                href="/catalog"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
