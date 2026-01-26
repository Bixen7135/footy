'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
  variant?: 'grid' | 'list';
}

export function ProductCard({
  product,
  onWishlistToggle,
  isInWishlist = false,
  variant = 'grid',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const images = (product.images || []).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );
  const primaryImage = images[0] || '';
  const hoverImage = images[1] || primaryImage;
  const hasImage = Boolean(primaryImage) && !imageError;
  const productHref = `/product/${product.slug}`;
  const sizes = product.available_sizes ?? [];
  const visibleSizes = sizes.slice(0, 6);
  const extraSizes = Math.max(sizes.length - visibleSizes.length, 0);

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
    value === null || !Number.isFinite(value) ? '--' : value.toFixed(2);

  // List variant styling
  const isListView = variant === 'list';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isListView ? { xs: 'column', sm: 'row' } : 'column',
        position: 'relative',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        '&:hover': {
          boxShadow: isListView ? 4 : 6,
          transform: isListView ? 'none' : 'translateY(-2px)',
          borderColor: 'accent.main',
        },
        '&:focus-within': {
          boxShadow: isListView ? 4 : 6,
          transform: isListView ? 'none' : 'translateY(-2px)',
          borderColor: 'accent.main',
        },
        '&:hover .product-card-actions, &:focus-within .product-card-actions': {
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
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
      <Link href={productHref} style={{ textDecoration: 'none', flex: isListView ? '0 0 200px' : 'auto' }}>
        <Box
          sx={{
            position: 'relative',
            paddingTop: isListView ? '0' : '100%',
            height: isListView ? { xs: '200px', sm: '200px' } : 'auto',
            width: isListView ? '100%' : 'auto',
            overflow: 'hidden',
            borderRadius: isListView ? { xs: '20px 20px 0 0', sm: '20px 0 0 20px' } : '20px 20px 0 0',
          }}
        >
          {hasImage ? (
            <CardMedia
              component="img"
              image={isHovered ? hoverImage : primaryImage}
              alt={product.name}
              onError={() => setImageError(true)}
              sx={{
                position: isListView ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 220ms ease',
                ...(isHovered && { transform: 'scale(1.05)' }),
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            />
          ) : (
            <Box
              sx={{
                position: isListView ? 'relative' : 'absolute',
                inset: isListView ? 'auto' : 0,
                height: isListView ? '100%' : 'auto',
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
      <CardContent
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 2,
          px: isListView ? 3 : 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isListView ? 'space-between' : 'flex-start',
        }}
      >
        <Box>
          <Link href={productHref} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant={isListView ? 'h6' : 'subtitle1'}
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: isListView ? 3 : 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.name}
            </Typography>
          </Link>

          {product.brand && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5, display: 'block' }}
            >
              {product.brand}
            </Typography>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
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
        </Box>

        {/* Sizes + quick add */}
        <Box sx={{ position: 'relative', mt: 2, minHeight: isListView ? 'auto' : 64 }}>
          <Box
            className="product-card-actions"
            sx={{
              position: isListView ? 'relative' : 'absolute',
              inset: isListView ? 'auto' : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: isListView ? 1 : 0,
              transform: isListView ? 'none' : 'translateY(8px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              pointerEvents: isListView ? 'auto' : 'none',
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                transform: 'none',
              },
            }}
          >
            {visibleSizes.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {visibleSizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderRadius: '6px',
                    }}
                  />
                ))}
                {extraSizes > 0 && (
                  <Chip
                    label={`+${extraSizes}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderRadius: '6px',
                    }}
                  />
                )}
              </Box>
            )}
            <Button
              size="small"
              variant="contained"
              component={Link}
              href={productHref}
              aria-label={`Quick add ${product.name}`}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'none',
                bgcolor: 'accent.main',
                color: 'accent.contrastText',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: 'accent.dark',
                },
              }}
            >
              Quick Add
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

