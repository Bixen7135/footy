'use client';

import { Box, Container, Typography, Button, Stack, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFeaturedProducts, useCategories } from '@/lib/queries';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(8);
  const { data: categories } = useCategories();

  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Step Into
                <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                  Style
                </Box>
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ maxWidth: 600, fontWeight: 400 }}
              >
                Discover premium footwear for every occasion. From casual sneakers to elegant formal shoes.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  href="/catalog"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  href="/catalog?is_featured=true"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  View Featured
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Shop by Category
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Find the perfect pair for your style
          </Typography>

          <Grid container spacing={2}>
            {categories.slice(0, 5).map((category) => (
              <Grid item xs={6} sm={4} md key={category.id}>
                <Button
                  component={Link}
                  href={`/catalog?category=${category.slug}`}
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {category.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Featured Products
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our top picks just for you
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/catalog?is_featured=true"
              endIcon={<ArrowForwardIcon />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              View All
            </Button>
          </Box>

          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No featured products available
            </Typography>
          )}

          {/* Mobile view all button */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 4 }}>
            <Button
              component={Link}
              href="/catalog?is_featured=true"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
            >
              View All Featured
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Trust Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: 'Free Shipping', desc: 'On orders over $100' },
            { title: 'Easy Returns', desc: '30-day return policy' },
            { title: 'Secure Checkout', desc: '100% secure payment' },
            { title: 'Quality Guarantee', desc: 'Authentic products' },
          ].map((item) => (
            <Grid item xs={6} md={3} key={item.title} textAlign="center">
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
