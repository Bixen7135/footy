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
    (url) =>
      typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'))
  );
  const unitPrice = Number(item.unit_price);
  const subtotal = Number(item.subtotal);
  const formatPrice = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '--');

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isRemoving ? 0.3 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 3 },
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        bgcolor: 'background.paper',
        border: '3px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
        boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isRemoving ? 'none' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          bgcolor: 'secondary.main',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        '&:hover': {
          transform: 'translate(-2px, -2px)',
          boxShadow: '8px 8px 0px rgba(158, 255, 0, 0.4)',
          '&::before': {
            transform: 'scaleX(1)',
          },
        },
      }}
    >
      {/* Product Image */}
      <Link href={`/product/${item.product?.slug || item.product_id}`}>
        <Box
          sx={{
            width: { xs: 100, md: 140 },
            height: { xs: 100, md: 140 },
            overflow: 'hidden',
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#1a1a1a',
            border: '2px solid',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            '&:hover': {
              transform: 'translate(-2px, -2px)',
              boxShadow: '4px 4px 0px rgba(158, 255, 0, 0.8)',
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
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                  color: (theme) => theme.palette.mode === 'light' ? '#fff' : '#000',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  mb: 1,
                  border: '2px solid',
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
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
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                bgcolor: 'transparent',
                border: '2px solid',
                borderColor: 'divider',
                fontSize: '0.75rem',
                color: 'text.primary',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
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
              width: 40,
              height: 40,
              bgcolor: isRemoving || isUpdating ? 'grey.300' : 'transparent',
              border: '3px solid',
              borderColor: isRemoving || isUpdating ? 'grey.400' : (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
              color: isRemoving || isUpdating ? 'grey.500' : 'error.main',
              cursor: isRemoving || isUpdating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0,
              '&:hover': {
                transform: isRemoving || isUpdating ? 'none' : 'translate(-2px, -2px)',
                boxShadow: isRemoving || isUpdating ? 'none' : '4px 4px 0px rgba(255, 0, 0, 0.6)',
                bgcolor: isRemoving || isUpdating ? 'grey.300' : '#ff0000',
                color: isRemoving || isUpdating ? 'grey.500' : '#fff',
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
                px: 2.5,
                py: 1.25,
                bgcolor: isQtyOpen ? 'secondary.main' : 'transparent',
                border: '3px solid',
                borderColor: isQtyOpen ? 'secondary.main' : (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                color: isQtyOpen ? '#000' : 'text.primary',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: isUpdating || isRemoving ? 'not-allowed' : 'pointer',
                opacity: isUpdating || isRemoving ? 0.5 : 1,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                minWidth: 90,
                '&:hover': {
                  transform: isUpdating || isRemoving ? 'none' : 'translate(-2px, -2px)',
                  boxShadow: isUpdating || isRemoving ? 'none' : '4px 4px 0px rgba(158, 255, 0, 0.8)',
                  borderColor: isUpdating || isRemoving ? (theme) => theme.palette.mode === 'light' ? '#000' : '#fff' : 'secondary.main',
                },
              }}
            >
              Qty: {item.quantity}
              <ChevronIcon isOpen={isQtyOpen} />
            </Box>

            {/* Dropdown */}
            {isQtyOpen && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  zIndex: 10,
                  bgcolor: 'background.paper',
                  border: '3px solid',
                  borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff',
                  overflow: 'hidden',
                  boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)',
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
                      bgcolor: item.quantity === qty ? 'secondary.main' : 'transparent',
                      border: 'none',
                      borderBottom: '2px solid',
                      borderBottomColor: 'divider',
                      color: item.quantity === qty ? '#000' : 'text.primary',
                      fontSize: '0.85rem',
                      fontWeight: item.quantity === qty ? 900 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        bgcolor: item.quantity === qty ? 'secondary.main' : (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.2)'
                            : 'rgba(158, 255, 0, 0.3)',
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
                fontFamily: 'var(--font-archivo-black)',
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                fontWeight: 400,
                color: 'text.primary',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              ${formatPrice(subtotal)}
            </Box>
            {item.quantity > 1 && (
              <Box
                sx={{
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  mt: 0.75,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ${formatPrice(unitPrice)} each
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
