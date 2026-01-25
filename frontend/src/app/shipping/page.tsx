'use client';

import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightIcon from '@mui/icons-material/Flight';
import InventoryIcon from '@mui/icons-material/Inventory';

const SHIPPING_OPTIONS = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Standard Shipping',
    time: '5-7 Business Days',
    price: '$5.99',
    description: 'Free on orders over $75',
  },
  {
    icon: <FlightIcon sx={{ fontSize: 40 }} />,
    title: 'Express Shipping',
    time: '2-3 Business Days',
    price: '$12.99',
    description: 'Fast delivery for urgent needs',
  },
  {
    icon: <InventoryIcon sx={{ fontSize: 40 }} />,
    title: 'Next Day Delivery',
    time: '1 Business Day',
    price: '$24.99',
    description: 'Order by 2pm for next day',
  },
];

export default function ShippingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Shipping Information
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We strive to get your new footwear to you as quickly as possible. Here&apos;s everything
          you need to know about our shipping options.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {SHIPPING_OPTIONS.map((option) => (
          <Grid item xs={12} md={4} key={option.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                textAlign: 'center',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ color: 'grey.700', mb: 2 }}>{option.icon}</Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {option.time}
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                {option.price}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider' }}>
        <Box sx={{ '& > *': { mb: 4 } }}>
          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Delivery Areas
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We currently ship to all 50 US states. Delivery times may vary for Alaska, Hawaii,
              and remote areas. International shipping is not available at this time.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Order Processing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Orders placed before 2:00 PM EST on business days are processed the same day.
              Orders placed after 2:00 PM EST or on weekends will be processed the next
              business day. You will receive a shipping confirmation email with tracking
              information once your order ships.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Free Shipping
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Enjoy free standard shipping on all orders over $75. This offer applies to the
              contiguous United States and cannot be combined with other promotions.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Order Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Once your order ships, you will receive an email with your tracking number.
              You can also track your order by logging into your account and viewing your
              order history. Tracking updates typically appear within 24 hours of shipment.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Delivery Issues
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If your package is lost, damaged, or delayed, please contact our customer
              support team at support@footy.com. We will work with the carrier to resolve
              the issue and ensure you receive your order.
            </Typography>
          </section>
        </Box>
      </Paper>
    </Container>
  );
}
