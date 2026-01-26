'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { CartItem as CartItemType } from '@/types';

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  isUpdating?: boolean;
}

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isQtyOpen, setIsQtyOpen] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(item.variant_id, newQuantity);
    setIsQtyOpen(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.variant_id);
    } finally {
      setIsRemoving(false);
    }
  };

  const productImage = (item.product?.images || []).find(
    (url) => typeof url === 'string' && url.startsWith('http')
  );
  const unitPrice = Number(item.unit_price);
  const subtotal = Number(item.subtotal);
  const formatPrice = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '—');

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 3 },
        p: { xs: 2, md: 3 },
        mb: 2,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isRemoving ? 'none' : 'auto',
        '&:hover': {
          borderColor: 'secondary.main',
        },
      }}
    >
      {/* Product Image */}
      <Link href={`/product/${item.product?.slug || item.product_id}`}>
        <Box
          sx={{
            width: { xs: 100, md: 140 },
            height: { xs: 100, md: 140 },
            borderRadius: '12px',
            overflow: 'hidden',
            bgcolor: 'grey.100',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={item.product?.name || 'Product'}
              width={140}
              height={140}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontWeight: 600,
                textAlign: 'center',
                px: 1,
                fontSize: '0.85rem',
              }}
            >
              {item.product?.brand || item.product?.name || 'Product'}
            </Box>
          )}
        </Box>
      </Link>

      {/* Product Details */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
            {item.product?.brand && (
              <Box
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  mb: 0.5,
                  fontFamily: 'var(--font-satoshi)',
                }}
              >
                {item.product.brand}
              </Box>
            )}
            <Box
              component={Link}
              href={`/product/${item.product?.slug || item.product_id}`}
              sx={{
                display: 'block',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              {item.product?.name || 'Product'}
            </Box>
            <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 500 }}>
              Size: {item.variant?.size}
            </Box>
          </Box>

          {/* Remove Button */}
          <Box
            component="button"
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
            aria-label="Remove item"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              color: 'text.secondary',
              cursor: isRemoving || isUpdating ? 'not-allowed' : 'pointer',
              opacity: isRemoving || isUpdating ? 0.5 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              flexShrink: 0,
              '&:hover': {
                borderColor: isRemoving || isUpdating ? 'divider' : 'error.main',
                color: isRemoving || isUpdating ? 'text.secondary' : 'error.main',
                bgcolor: isRemoving || isUpdating
                  ? 'transparent'
                  : (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(255, 0, 0, 0.04)'
                        : 'rgba(255, 0, 0, 0.08)',
              },
            }}
          >
            <TrashIcon />
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          {/* Quantity Selector */}
          <Box sx={{ position: 'relative' }}>
            <Box
              component="button"
              onClick={() => setIsQtyOpen(!isQtyOpen)}
              disabled={isUpdating || isRemoving}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                bgcolor: 'transparent',
                border: '2px solid',
                borderColor: isQtyOpen ? 'secondary.main' : 'divider',
                borderRadius: '10px',
                color: 'text.primary',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: isUpdating || isRemoving ? 'not-allowed' : 'pointer',
                opacity: isUpdating || isRemoving ? 0.5 : 1,
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                minWidth: 80,
                '&:hover': {
                  borderColor: isUpdating || isRemoving ? 'divider' : 'secondary.main',
                  bgcolor: isUpdating || isRemoving
                    ? 'transparent'
                    : (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(158, 255, 0, 0.04)'
                          : 'rgba(158, 255, 0, 0.08)',
                },
              }}
            >
              Qty: {item.quantity}
              <ChevronIcon isOpen={isQtyOpen} />
            </Box>

            {/* Dropdown */}
            {isQtyOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  zIndex: 10,
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 8px 24px rgba(0, 0, 0, 0.1)'
                      : '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
              >
                {QUANTITY_OPTIONS.map((qty) => (
                  <Box
                    key={qty}
                    component="button"
                    onClick={() => handleQuantityChange(qty)}
                    sx={{
                      width: '100%',
                      px: 2.5,
                      py: 1.25,
                      bgcolor: item.quantity === qty
                        ? (theme) =>
                            theme.palette.mode === 'light'
                              ? 'rgba(158, 255, 0, 0.12)'
                              : 'rgba(158, 255, 0, 0.15)'
                        : 'transparent',
                      border: 'none',
                      color: 'text.primary',
                      fontSize: '0.9rem',
                      fontWeight: item.quantity === qty ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.08)'
                            : 'rgba(158, 255, 0, 0.1)',
                      },
                    }}
                  >
                    {qty}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Price */}
          <Box sx={{ textAlign: 'right' }}>
            <Box
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 800,
                color: 'text.primary',
                fontFamily: 'var(--font-satoshi)',
              }}
            >
              ${formatPrice(subtotal)}
            </Box>
            {item.quantity > 1 && (
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                ${formatPrice(unitPrice)} each
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
