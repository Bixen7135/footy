'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  onWishlistToggle,
  isInWishlist = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const images = (product.images || []).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );
  const primaryImage = images[0] || '';
  const hoverImage = images[1] || primaryImage;
  const hasImage = Boolean(primaryImage) && !imageError;

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

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1, display: 'flex', gap: 0.5 }}>
        {discount > 0 && (
          <Chip
            label={`-${discount}%`}
            size="small"
            color="error"
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          />
        )}
        {product.is_featured && (
          <Chip
            label="Featured"
            size="small"
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          />
        )}
        {!product.in_stock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              bgcolor: 'grey.700',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>

      {/* Wishlist button */}
      {onWishlistToggle && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product.id);
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

      {/* Product image */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
          {hasImage ? (
            <CardMedia
              component="img"
              image={isHovered ? hoverImage : primaryImage}
              alt={product.name}
              onError={() => setImageError(true)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
                ...(isHovered && { transform: 'scale(1.05)' }),
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'grey.100',
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
        </Box>
      </Link>

      {/* Product info */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {product.brand && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {product.brand}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 500,
              lineHeight: 1.3,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            ${formatPrice(price)}
          </Typography>
          {hasComparePrice && (
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ${formatPrice(comparePrice as number)}
            </Typography>
          )}
        </Box>

        {/* Available sizes */}
        {product.available_sizes?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {product.available_sizes.slice(0, 6).map((size) => (
              <Chip
                key={size}
                label={size}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            ))}
            {product.available_sizes.length > 6 && (
              <Chip
                label={`+${product.available_sizes.length - 6}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
