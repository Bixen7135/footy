'use client';

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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

// Custom SVG Icons
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ShippingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

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
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
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
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const images = (product.images || []).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );
  const hasImages = images.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 15% 20%, rgba(158, 255, 0, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(24, 24, 24, 0.05) 0%, transparent 45%)'
              : 'radial-gradient(circle at 15% 20%, rgba(158, 255, 0, 0.1) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 45%)',
          opacity: 0.85,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 8 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Breadcrumbs */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 5, flexWrap: 'wrap' }}>
              <Box
                component={Link}
                href="/"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Home
              </Box>
              <ChevronIcon />
              <Box
                component={Link}
                href="/catalog"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Catalog
              </Box>
              {product.category && (
                <>
                  <ChevronIcon />
                  <Box
                    component={Link}
                    href={`/catalog?category=${product.category.slug}`}
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {product.category.name}
                  </Box>
                </>
              )}
              <ChevronIcon />
              <Box sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
                {product.name}
              </Box>
            </Box>
          </motion.div>

          {/* Main product grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 0.85fr' },
              gap: { xs: 5, md: 8 },
            }}
          >
            {/* Image gallery */}
            <motion.div variants={itemVariants}>
              <Box>
                {/* Main image */}
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? 'grey.100' : 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid',
                    borderColor: 'divider',
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
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        px: 3,
                        fontFamily: 'var(--font-satoshi)',
                      }}
                    >
                      {product.brand || product.name}
                    </Box>
                  )}

                  {/* Badges */}
                  <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 1.5 }}>
                    {discount > 0 && (
                      <Box
                        sx={{
                          px: 2,
                          py: 0.75,
                          borderRadius: '999px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light'
                              ? '#ff3b30'
                              : 'rgba(255, 59, 48, 0.9)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          letterSpacing: '0.02em',
                        }}
                      >
                        -{discount}%
                      </Box>
                    )}
                    {!product.in_stock && (
                      <Box
                        sx={{
                          px: 2,
                          py: 0.75,
                          borderRadius: '999px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light'
                              ? 'rgba(0, 0, 0, 0.8)'
                              : 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          letterSpacing: '0.02em',
                        }}
                      >
                        Out of Stock
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Thumbnail gallery */}
                {images.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 3, overflowX: 'auto', pb: 1 }}>
                    {images.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() => setMainImage(index)}
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: mainImage === index ? 'secondary.main' : 'divider',
                          opacity: mainImage === index ? 1 : 0.6,
                          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                          flexShrink: 0,
                          '&:hover': {
                            opacity: 1,
                            transform: 'scale(1.05)',
                          },
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
            </motion.div>

            {/* Product info */}
            <motion.div variants={itemVariants}>
              <Box>
                {/* Brand */}
                {product.brand && (
                  <Box
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    {product.brand}
                  </Box>
                )}

                {/* Title */}
                <Box
                  component="h1"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: 'text.primary',
                    fontFamily: 'var(--font-satoshi)',
                    mb: 3,
                  }}
                >
                  {product.name}
                </Box>

                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
                  <Box
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontWeight: 800,
                      color: 'text.primary',
                      fontFamily: 'var(--font-satoshi)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ${formatPrice(price)}
                  </Box>
                  {hasComparePrice && (
                    <Box
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                      }}
                    >
                      ${formatPrice(comparePrice as number)}
                    </Box>
                  )}
                  {discount > 0 && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(52, 199, 89, 0.15)'
                            : 'rgba(52, 199, 89, 0.2)',
                        color: (theme) =>
                          theme.palette.mode === 'light' ? '#34c759' : '#30d158',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    >
                      Save {discount}%
                    </Box>
                  )}
                </Box>

                {/* Description */}
                {product.description && (
                  <Box
                    sx={{
                      fontSize: '1rem',
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 4,
                    }}
                  >
                    {product.description}
                  </Box>
                )}

                {/* Size selection */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    Select Size
                  </Box>

                  <AnimatePresence>
                    {sizeError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: (theme) =>
                              theme.palette.mode === 'light'
                                ? 'rgba(255, 59, 48, 0.1)'
                                : 'rgba(255, 59, 48, 0.15)',
                            color: (theme) =>
                              theme.palette.mode === 'light' ? '#d32f2f' : '#ff453a',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                          }}
                        >
                          Please select a size
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {product.variants.map((variant) => {
                      const isOutOfStock = variant.stock === 0;
                      const isSelected = selectedSize === variant.size;

                      return (
                        <Box
                          key={variant.id}
                          component="button"
                          onClick={() => !isOutOfStock && handleSizeSelect(variant.size)}
                          disabled={isOutOfStock}
                          sx={{
                            minWidth: 64,
                            height: 56,
                            px: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: isSelected ? 'secondary.contrastText' : 'text.primary',
                            bgcolor: isSelected ? 'secondary.main' : 'transparent',
                            border: '2px solid',
                            borderColor: isSelected ? 'secondary.main' : 'divider',
                            borderRadius: '14px',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            opacity: isOutOfStock ? 0.4 : 1,
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                            '&:hover': {
                              transform: isOutOfStock ? 'none' : 'translateY(-2px)',
                              borderColor: isOutOfStock
                                ? 'divider'
                                : isSelected
                                ? 'secondary.main'
                                : 'text.primary',
                            },
                            '&:active': {
                              transform: 'translateY(0)',
                            },
                            ...(isOutOfStock && {
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: 8,
                                right: 8,
                                height: 2,
                                bgcolor: 'text.disabled',
                                transform: 'rotate(-15deg)',
                              },
                            }),
                          }}
                        >
                          {variant.size}
                        </Box>
                      );
                    })}
                  </Box>

                  {selectedVariant && (
                    <Box
                      sx={{
                        mt: 2,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: selectedVariant.stock > 5 ? 'text.secondary' : '#ff9500',
                      }}
                    >
                      {selectedVariant.stock > 5
                        ? 'In Stock'
                        : `Only ${selectedVariant.stock} left`}
                    </Box>
                  )}
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Box
                    component="button"
                    onClick={handleAddToCart}
                    disabled={!product.in_stock || isAddingToCart}
                    sx={{
                      flex: 1,
                      px: 4,
                      py: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'primary.contrastText',
                      bgcolor: 'primary.main',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: !product.in_stock || isAddingToCart ? 'not-allowed' : 'pointer',
                      opacity: !product.in_stock || isAddingToCart ? 0.5 : 1,
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                      '&:hover': {
                        transform:
                          !product.in_stock || isAddingToCart ? 'none' : 'translateY(-2px)',
                        boxShadow:
                          !product.in_stock || isAddingToCart
                            ? 'none'
                            : '0 12px 28px rgba(24, 24, 24, 0.25)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Box>

                  {onWishlistToggle && (
                    <Box
                      component="button"
                      onClick={() => onWishlistToggle(product.id)}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      sx={{
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'transparent',
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: '16px',
                        color: isInWishlist ? '#ff3b30' : 'text.primary',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          borderColor: isInWishlist ? '#ff3b30' : 'secondary.main',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      <HeartIcon filled={isInWishlist} />
                    </Box>
                  )}

                  <Box
                    component="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    sx={{
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'transparent',
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: '16px',
                      color: 'text.primary',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'secondary.main',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    <ShareIcon />
                  </Box>
                </Box>

                {/* Product details */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '18px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.02)'
                        : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {product.material && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 80 }}>
                          Material:
                        </Box>
                        <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {product.material}
                        </Box>
                      </Box>
                    )}
                    {product.color && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 80 }}>
                          Color:
                        </Box>
                        <Box sx={{ fontWeight: 600, color: 'text.primary' }}>{product.color}</Box>
                      </Box>
                    )}
                    {product.gender && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 80 }}>
                          Gender:
                        </Box>
                        <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Trust badges */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.12)'
                            : 'rgba(158, 255, 0, 0.15)',
                        color: 'secondary.main',
                      }}
                    >
                      <ShippingIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 0.25,
                        }}
                      >
                        Free Shipping
                      </Box>
                      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        On orders over $100
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.12)'
                            : 'rgba(158, 255, 0, 0.15)',
                        color: 'secondary.main',
                      }}
                    >
                      <ReturnIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 0.25,
                        }}
                      >
                        Easy Returns
                      </Box>
                      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        30-day return policy
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.12)'
                            : 'rgba(158, 255, 0, 0.15)',
                        color: 'secondary.main',
                      }}
                    >
                      <ShieldIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 0.25,
                        }}
                      >
                        Authentic Guarantee
                      </Box>
                      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        100% verified products
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2000,
            }}
          >
            <Box
              sx={{
                px: 4,
                py: 2.5,
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(24, 24, 24, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'white' : 'rgba(0, 0, 0, 0.87)',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              <CheckIcon />
              Added to cart!
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
