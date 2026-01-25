'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardMedia,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { CartItem as CartItemType } from '@/types';

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

  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(item.variant_id, newQuantity);
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
    <Card
      sx={{
        display: 'flex',
        p: 2,
        mb: 2,
        opacity: isRemoving ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Product Image */}
      <Link href={`/product/${item.product?.slug || item.product_id}`}>
        {productImage ? (
          <CardMedia
            component="img"
            image={productImage}
            alt={item.product?.name || 'Product'}
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              cursor: 'pointer',
            }}
          />
        ) : (
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: 1,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontWeight: 600,
              textAlign: 'center',
              px: 1,
            }}
          >
            {item.product?.brand || item.product?.name || 'Product'}
          </Box>
        )}
      </Link>

      {/* Product Details */}
      <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            {item.product?.brand && (
              <Typography variant="caption" color="text.secondary">
                {item.product.brand}
              </Typography>
            )}
            <Typography
              component={Link}
              href={`/product/${item.product?.slug || item.product_id}`}
              variant="subtitle1"
              fontWeight={500}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {item.product?.name || 'Product'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {item.variant?.size}
            </Typography>
          </Box>

          <IconButton
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
            size="small"
            aria-label="Remove item"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Quantity Selector */}
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              disabled={isUpdating || isRemoving}
            >
              {QUANTITY_OPTIONS.map((qty) => (
                <MenuItem key={qty} value={qty}>
                  {qty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              ${formatPrice(subtotal)}
            </Typography>
            {item.quantity > 1 && (
              <Typography variant="caption" color="text.secondary">
                ${formatPrice(unitPrice)} each
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
