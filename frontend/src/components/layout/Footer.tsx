'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/catalog' },
    { label: 'Sneakers', href: '/catalog?category=sneakers' },
    { label: 'Running', href: '/catalog?category=running' },
    { label: 'Boots', href: '/catalog?category=boots' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
  ],
};

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight={800}
              color="white"
              gutterBottom
            >
              Footy
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: 280 }}>
              Your destination for premium footwear. Quality shoes for every occasion, delivered to your door.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Shop links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight={600} color="white" gutterBottom>
              Shop
            </Typography>
            {FOOTER_LINKS.shop.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'grey.400',
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Help links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight={600} color="white" gutterBottom>
              Help
            </Typography>
            {FOOTER_LINKS.help.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'grey.400',
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Company links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight={600} color="white" gutterBottom>
              Company
            </Typography>
            {FOOTER_LINKS.company.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'grey.400',
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} color="white" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Subscribe to get special offers, free giveaways, and new arrivals.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            &copy; {new Date().getFullYear()} Footy. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              href="/privacy"
              variant="body2"
              sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component={Link}
              href="/terms"
              variant="body2"
              sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
