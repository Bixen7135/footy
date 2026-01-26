'use client';

import Image from 'next/image';
import { Box } from '@mui/material';
import type { Cart, ShippingAddress } from '@/types';

// Constants matching backend
const TAX_RATE = 0.08; // 8%
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

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
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        position: { md: 'sticky' },
        top: { md: 90 },
      }}
    >
      <Box
        sx={{
          fontSize: '1.25rem',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          color: 'text.primary',
          mb: 3,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        Order Summary
      </Box>

      {/* Items list */}
      {showItems && (
        <>
          <Box sx={{ mb: 2 }}>
            {cart.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    bgcolor: 'grey.100',
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
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.product.brand || item.product.name}
                    </Box>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.product.name}
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                    Size: {item.variant.size} | Qty: {item.quantity}
                  </Box>
                </Box>
                <Box sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {formatPrice(item.subtotal)}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ height: '1px', bgcolor: 'divider', mb: 2 }} />
        </>
      )}

      {/* Shipping address preview */}
      {shippingAddress && (
        <>
          <Box
            sx={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'text.primary',
              mb: 1,
              fontFamily: 'var(--font-satoshi)',
            }}
          >
            Shipping to:
          </Box>
          <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 2, lineHeight: 1.7 }}>
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
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
            <br />
            {shippingAddress.phone}
          </Box>
          <Box sx={{ height: '1px', bgcolor: 'divider', mb: 2 }} />
        </>
      )}

      {/* Pricing breakdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
            Subtotal ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </Box>
          <Box sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatPrice(subtotal)}</Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>Shipping</Box>
          <Box
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: shipping === 0 ? 'secondary.main' : 'text.primary',
            }}
          >
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>Tax (8%)</Box>
          <Box sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatPrice(tax)}</Box>
        </Box>

        <Box sx={{ height: '1px', bgcolor: 'divider', my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            sx={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'text.primary',
              fontFamily: 'var(--font-satoshi)',
            }}
          >
            Total
          </Box>
          <Box
            sx={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'text.primary',
              fontFamily: 'var(--font-satoshi)',
            }}
          >
            {formatPrice(total)}
          </Box>
        </Box>
      </Box>

      {/* Free shipping progress */}
      {freeShippingRemaining > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(158, 255, 0, 0.08)'
                : 'rgba(158, 255, 0, 0.12)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TruckIcon />
          <Box sx={{ fontSize: '0.8rem', color: 'secondary.main', fontWeight: 600 }}>
            Add {formatPrice(freeShippingRemaining)} more for free shipping!
          </Box>
        </Box>
      )}
    </Box>
  );
}
