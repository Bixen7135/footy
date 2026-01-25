'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Snackbar,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import Link from 'next/link';
import { ProductDetailSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/States';
import type { Product, ProductVariant } from '@/types';

interface ProductDetailProps {
  product?: Product;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onAddToCart?: (variantId: string, quantity: number) => void;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
  isAddingToCart?: boolean;
}

export function ProductDetail({
  product,
  isLoading,
  isError,
  error,
  onRetry,
  onAddToCart,
  onWishlistToggle,
  isInWishlist = false,
  isAddingToCart = false,
}: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mainImage, setMainImage] = useState<number>(0);
  const [sizeError, setSizeError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product not found"
        message={error?.message || "We couldn't find the product you're looking for."}
        onRetry={onRetry}
      />
    );
  }

  const price = Number(product.price);
  const comparePrice =
    product.compare_at_price === null || product.compare_at_price === undefined
      ? null
      : Number(product.compare_at_price);
  const hasComparePrice = Number.isFinite(comparePrice) && (comparePrice as number) > 0;
  const discount =
    hasComparePrice && Number.isFinite(price)
      ? Math.round((((comparePrice as number) - price) / (comparePrice as number)) * 100)
      : 0;

  const formatPrice = (value: number | null) =>
    value === null || !Number.isFinite(value) ? '—' : value.toFixed(2);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    const variant = product.variants.find((v) => v.size === size && v.stock > 0);
    setSelectedVariant(variant || null);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      setSizeError(true);
      return;
    }

    if (onAddToCart) {
      onAddToCart(selectedVariant.id, 1);
      setSnackbarOpen(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    }
  };

  const images = (product.images || []).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );
  const hasImages = images.length > 0;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} href="/catalog" underline="hover" color="inherit">
          Catalog
        </MuiLink>
        {product.category && (
          <MuiLink
            component={Link}
            href={`/catalog?category=${product.category.slug}`}
            underline="hover"
            color="inherit"
          >
            {product.category.name}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Image gallery */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Main image */}
            <Box
              sx={{
                position: 'relative',
                paddingTop: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'grey.100',
              }}
            >
              {hasImages ? (
                <Box
                  component="img"
                  src={images[mainImage]}
                  alt={product.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
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
                  {product.brand || product.name}
                </Box>
              )}
              {/* Badges */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                {discount > 0 && (
                  <Chip label={`-${discount}%`} color="error" />
                )}
                {!product.in_stock && (
                  <Chip label="Out of Stock" sx={{ bgcolor: 'grey.700', color: 'white' }} />
                )}
              </Box>
            </Box>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                {images.map((img, index) => (
                  <Box
                    key={index}
                    onClick={() => setMainImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: 2,
                      borderColor: mainImage === index ? 'primary.main' : 'transparent',
                      opacity: mainImage === index ? 1 : 0.7,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 },
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product info */}
        <Grid item xs={12} md={6}>
          {/* Brand */}
          {product.brand && (
            <Typography
              variant="overline"
              color="primary"
              fontWeight={600}
              sx={{ letterSpacing: 1 }}
            >
              {product.brand}
            </Typography>
          )}

          {/* Title */}
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              ${formatPrice(price)}
            </Typography>
            {hasComparePrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${formatPrice(comparePrice as number)}
              </Typography>
            )}
            {discount > 0 && (
              <Chip label={`Save ${discount}%`} color="success" size="small" />
            )}
          </Box>

          {/* Description */}
          {product.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Size selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Select Size
            </Typography>
            {sizeError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please select a size
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.variants.map((variant) => {
                const isOutOfStock = variant.stock === 0;
                const isSelected = selectedSize === variant.size;

                return (
                  <Button
                    key={variant.id}
                    variant={isSelected ? 'contained' : 'outlined'}
                    disabled={isOutOfStock}
                    onClick={() => handleSizeSelect(variant.size)}
                    sx={{
                      minWidth: 56,
                      height: 48,
                      position: 'relative',
                      ...(isOutOfStock && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: 1,
                          bgcolor: 'text.disabled',
                          transform: 'rotate(-45deg)',
                        },
                      }),
                    }}
                  >
                    {variant.size}
                  </Button>
                );
              })}
            </Box>
            {selectedVariant && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedVariant.stock > 5
                  ? 'In Stock'
                  : `Only ${selectedVariant.stock} left`}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!product.in_stock || isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            {onWishlistToggle && (
              <IconButton
                onClick={() => onWishlistToggle(product.id)}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  width: 56,
                  height: 56,
                }}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            )}
            <IconButton
              onClick={handleShare}
              sx={{ border: 1, borderColor: 'divider', width: 56, height: 56 }}
              aria-label="Share product"
            >
              <ShareIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Product details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {product.material && (
              <Typography variant="body2">
                <strong>Material:</strong> {product.material}
              </Typography>
            )}
            {product.color && (
              <Typography variant="body2">
                <strong>Color:</strong> {product.color}
              </Typography>
            )}
            {product.gender && (
              <Typography variant="body2">
                <strong>Gender:</strong>{' '}
                {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Trust badges */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalShippingOutlinedIcon color="action" />
              <Typography variant="body2">Free shipping on orders over $100</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ReplayOutlinedIcon color="action" />
              <Typography variant="body2">30-day easy returns</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VerifiedUserOutlinedIcon color="action" />
              <Typography variant="body2">Authenticity guaranteed</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Added to cart"
      />
    </Box>
  );
}
