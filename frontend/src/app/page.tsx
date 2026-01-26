'use client';

import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFeaturedProducts, useCategories } from '@/lib/queries';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

const heroStats = [
  { label: 'Drops curated weekly', value: '48+' },
  { label: 'Premium pairs shipped', value: '32k' },
  { label: 'Member satisfaction', value: '4.9/5' },
];

const trustHighlights = [
  { title: 'Free shipping', desc: 'Orders over $100' },
  { title: 'Easy returns', desc: '30-day policy' },
  { title: 'Secure checkout', desc: 'Trusted payments' },
  { title: 'Quality guarantee', desc: 'Authentic products' },
];

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(8);
  const { data: categories } = useCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const categoryPills = categories?.slice(0, 6) ?? [];

  return (
    <Box component="main">
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'radial-gradient(circle at 20% 15%, rgba(24, 24, 24, 0.08) 0%, transparent 45%), radial-gradient(circle at 80% 10%, rgba(158, 255, 0, 0.22) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(158, 255, 0, 0.18) 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 45%), radial-gradient(circle at 80% 10%, rgba(158, 255, 0, 0.2) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(158, 255, 0, 0.14) 0%, transparent 50%)',
            opacity: 0.95,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(transparent 31px, rgba(0, 0, 0, 0.08) 32px), linear-gradient(90deg, transparent 31px, rgba(0, 0, 0, 0.08) 32px)',
            backgroundSize: '32px 32px',
            opacity: 0.05,
            zIndex: 0,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 7, md: 12 } }}>
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
                gap: { xs: 5, md: 7 },
                alignItems: 'center',
              }}
            >
              <motion.div variants={itemVariants}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  Footy Atelier
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '48px',
                      height: '2px',
                      bgcolor: 'secondary.main',
                    }}
                  />
                </Box>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.9rem', sm: '4rem', md: '5rem' },
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    color: 'text.primary',
                    fontFamily: 'var(--font-satoshi)',
                    mb: 2,
                  }}
                >
                  Curate the
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'linear-gradient(120deg, #181818 0%, #7ECC00 75%)'
                          : 'linear-gradient(120deg, #ffffff 0%, #9EFF00 75%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    perfect stride
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    maxWidth: '540px',
                  }}
                >
                  Premium footwear, styled with editorial precision. Explore handcrafted collections, elevated
                  essentials, and limited drops designed to move with you.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ mt: 4 }}>
                  <Button
                    component={Link}
                    href="/catalog"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4.5, py: 1.6, fontSize: '1.05rem' }}
                  >
                    Shop the edit
                  </Button>
                  <Button
                    component={Link}
                    href="/catalog?is_featured=true"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4.5, py: 1.6, fontSize: '1.05rem' }}
                  >
                    View featured
                  </Button>
                </Stack>

                {categoryPills.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 4, flexWrap: 'wrap', rowGap: 1 }}>
                    {categoryPills.map((category) => (
                      <Chip
                        key={category.id}
                        label={category.name}
                        component={Link}
                        href={`/catalog?category=${category.slug}`}
                        clickable
                        sx={{
                          borderRadius: '999px',
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'transparent',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontSize: '0.7rem',
                          px: 1.5,
                          '&:hover': {
                            bgcolor: 'secondary.main',
                            color: 'secondary.contrastText',
                            borderColor: 'secondary.main',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '28px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    p: { xs: 3, md: 4 },
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(90deg, #9EFF00 0%, transparent 80%)',
                    }}
                  />
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: 'text.secondary',
                        }}
                      >
                        Spotlight edit
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: '1.5rem', md: '1.9rem' },
                          fontWeight: 800,
                          letterSpacing: '-0.02em',
                          fontFamily: 'var(--font-satoshi)',
                        }}
                      >
                        Velocity collection
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                        Aerodynamic silhouettes with premium cushioning and high-contrast textures.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 200,
                        borderRadius: '22px',
                        border: '1px solid',
                        borderColor: 'divider',
                        background:
                          'linear-gradient(135deg, rgba(24, 24, 24, 0.08) 0%, rgba(158, 255, 0, 0.25) 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage:
                            'linear-gradient(transparent 23px, rgba(0, 0, 0, 0.12) 24px), linear-gradient(90deg, transparent 23px, rgba(0, 0, 0, 0.12) 24px)',
                          backgroundSize: '24px 24px',
                          opacity: 0.15,
                        }}
                      />
                    </Box>
                    <Stack direction="row" spacing={2}>
                      {heroStats.map((stat) => (
                        <Box
                          key={stat.label}
                          sx={{
                            flex: 1,
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: 'divider',
                            p: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '1.2rem',
                              fontWeight: 800,
                              fontFamily: 'var(--font-satoshi)',
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {categories && categories.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--font-satoshi)' }}
                  >
                    Category studio
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Sharpen the search with curated lanes.
                  </Typography>
                </Box>
                <Button component={Link} href="/catalog" endIcon={<ArrowForwardIcon />}>
                  Browse all
                </Button>
              </Box>
            </motion.div>
            <Grid container spacing={2}>
              {categories.slice(0, 6).map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <motion.div variants={itemVariants} transition={{ delay: index * 0.05 }}>
                    <Box
                      component={Link}
                      href={`/catalog?category=${category.slug}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: '100%',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        p: 3,
                        textDecoration: 'none',
                        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) =>
                            theme.palette.mode === 'light'
                              ? '0 16px 40px rgba(24, 24, 24, 0.12)'
                              : '0 16px 40px rgba(0, 0, 0, 0.4)',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: 'text.primary',
                          fontFamily: 'var(--font-satoshi)',
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Explore signature silhouettes designed for {category.name.toLowerCase()} days.
                      </Typography>
                      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <Typography sx={{ fontWeight: 600 }}>Open collection</Typography>
                        <ArrowForwardIcon fontSize="small" />
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      )}

      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--font-satoshi)' }}
                  >
                    Featured picks
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Our editorial team&apos;s top selections.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/catalog?is_featured=true"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  View all
                </Button>
              </Box>
            </motion.div>

            {productsLoading ? (
              <ProductGridSkeleton count={4} />
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {featuredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <motion.div variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No featured products available
              </Typography>
            )}

            <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 4 }}>
              <Button component={Link} href="/catalog?is_featured=true" variant="outlined" endIcon={<ArrowForwardIcon />}>
                View all featured
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                borderRadius: '26px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                p: { xs: 3, md: 4 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                Footy journal
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  mt: 2,
                  fontFamily: 'var(--font-satoshi)',
                }}
              >
                Craftsmanship that keeps pace.
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
                Each pair is curated for performance, comfort, and attitude. Discover rich materials, engineered
                soles, and elevated silhouettes that turn daily steps into statements.
              </Typography>
              <Button
                component={Link}
                href="/catalog"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3 }}
              >
                Read the story
              </Button>
              <Box
                sx={{
                  position: 'absolute',
                  right: -60,
                  bottom: -60,
                  width: 200,
                  height: 200,
                  borderRadius: '32px',
                  border: '1px solid',
                  borderColor: 'divider',
                  transform: 'rotate(12deg)',
                  opacity: 0.4,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                borderRadius: '26px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                p: { xs: 3, md: 4 },
                display: 'grid',
                gap: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                Trusted by the community
              </Typography>
              <Grid container spacing={2}>
                {trustHighlights.map((item) => (
                  <Grid item xs={6} key={item.title}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{item.title}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {item.desc}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  mt: 'auto',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Join the inner circle</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    Early access to limited releases.
                  </Typography>
                </Box>
                <Button component={Link} href="/account" variant="outlined">
                  Create account
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
