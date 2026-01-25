'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ProtectedRoute } from '@/components/auth';
import { api } from '@/lib/api';
import type { WishlistItem, Wishlist } from '@/types';

function WishlistContent() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const fetchWishlist = async () => {
    try {
      const response = await api.get<Wishlist>('/wishlist');
      setWishlist(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemovingIds((prev) => new Set(prev).add(productId));

    try {
      await api.delete(`/wishlist/items/${productId}`);
      setWishlist((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.product_id !== productId),
              total: prev.total - 1,
            }
          : null
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove item');
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Wishlist
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {wishlist?.total || 0} {wishlist?.total === 1 ? 'item' : 'items'} saved
      </Typography>

      {!wishlist || wishlist.items.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <FavoriteIcon
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Save items you love by clicking the heart icon on products.
          </Typography>
          <Button component={Link} href="/catalog" variant="contained">
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlist.items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                {/* Remove button */}
                <IconButton
                  onClick={() => handleRemove(item.product_id)}
                  disabled={removingIds.has(item.product_id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'error.contrastText',
                    },
                  }}
                  size="small"
                >
                  {removingIds.has(item.product_id) ? (
                    <CircularProgress size={18} />
                  ) : (
                    <DeleteOutlineIcon fontSize="small" />
                  )}
                </IconButton>

                {/* Product image */}
                <Link href={`/product/${item.product.slug}`}>
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      bgcolor: 'grey.100',
                      position: 'relative',
                    }}
                  >
                    {item.product.images.find((url) => typeof url === 'string' && url.startsWith('http')) ? (
                      <Image
                        src={
                          item.product.images.find(
                            (url) => typeof url === 'string' && url.startsWith('http')
                          ) as string
                        }
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                          fontWeight: 600,
                          textAlign: 'center',
                          px: 2,
                        }}
                      >
                        {item.product.brand || item.product.name}
                      </Box>
                    )}
                    {!item.product.in_stock && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          py: 0.5,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="caption">Out of Stock</Typography>
                      </Box>
                    )}
                  </Box>
                </Link>

                {/* Product info */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    component={Link}
                    href={`/product/${item.product.slug}`}
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      mb: 0.5,
                      '&:hover': { color: 'primary.main' },
                    }}
                    noWrap
                  >
                    {item.product.name}
                  </Typography>

                  {item.product.brand && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {item.product.brand}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight={700}>
                      {formatPrice(item.product.price)}
                    </Typography>
                    {item.product.compare_at_price && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(item.product.compare_at_price)}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    component={Link}
                    href={`/product/${item.product.slug}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<ShoppingCartOutlinedIcon />}
                    disabled={!item.product.in_stock}
                    sx={{ mt: 2 }}
                  >
                    {item.product.in_stock ? 'View Product' : 'Out of Stock'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
