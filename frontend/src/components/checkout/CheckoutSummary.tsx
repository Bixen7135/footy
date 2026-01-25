'use client';

import Image from 'next/image';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import type { Cart, ShippingAddress } from '@/types';

// Constants matching backend
const TAX_RATE = 0.08; // 8%
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

interface CheckoutSummaryProps {
  cart: Cart;
  shippingAddress?: ShippingAddress | null;
  showItems?: boolean;
}

export function CheckoutSummary({
  cart,
  shippingAddress,
  showItems = true,
}: CheckoutSummaryProps) {
  const subtotal = cart.total;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const freeShippingRemaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        position: { md: 'sticky' },
        top: { md: 90 },
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Order Summary
      </Typography>

      {/* Items list */}
      {showItems && (
        <>
          <List disablePadding sx={{ mb: 2 }}>
            {cart.items.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{ py: 1.5, alignItems: 'flex-start' }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'grey.100',
                    mr: 2,
                    flexShrink: 0,
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
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover' }}
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
                      }}
                    >
                      {item.product.brand || item.product.name}
                    </Box>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {item.product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {item.variant.size} | Qty: {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {formatPrice(item.subtotal)}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Shipping address preview */}
      {shippingAddress && (
        <>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Shipping to:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {shippingAddress.name}
            <br />
            {shippingAddress.line1}
            {shippingAddress.line2 && (
              <>
                <br />
                {shippingAddress.line2}
              </>
            )}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.postal_code}
            <br />
            {shippingAddress.phone}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Pricing breakdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Typography>
          <Typography variant="body2">{formatPrice(subtotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography
            variant="body2"
            color={shipping === 0 ? 'success.main' : 'inherit'}
          >
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Tax (8%)
          </Typography>
          <Typography variant="body2">{formatPrice(tax)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {formatPrice(total)}
          </Typography>
        </Box>
      </Box>

      {/* Free shipping progress */}
      {freeShippingRemaining > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'info.light',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LocalShippingOutlinedIcon
            fontSize="small"
            sx={{ color: 'info.dark' }}
          />
          <Typography variant="caption" color="info.dark">
            Add {formatPrice(freeShippingRemaining)} more for free shipping!
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
