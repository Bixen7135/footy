'use client';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFeaturedProducts, useCategories } from '@/lib/queries';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useRef } from 'react';

const heroStats = [
  { label: 'WEEKLY', value: '48+', unit: 'DROPS' },
  { label: 'SHIPPED', value: '32K', unit: 'PAIRS' },
  { label: 'RATED', value: '4.9', unit: '/5' },
];

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(8);
  const { data: categories } = useCategories();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const slideVariants = {
    hidden: { x: -60, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Box component="main">
      {/* HERO SECTION - Bold, Athletic, Magazine-inspired */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#000000',
          minHeight: { xs: 'calc(100vh - 64px)', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 80% 20%, #9EFF00 0%, transparent 50%), radial-gradient(circle at 20% 80%, #9EFF00 0%, transparent 40%)',
            opacity: 0.15,
            mixBlendMode: 'screen',
            zIndex: 0,
          }}
        />

        {/* Diagonal Accent Stripes */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '140%',
            background: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(158, 255, 0, 0.03) 80px, rgba(158, 255, 0, 0.03) 160px)',
            transform: 'rotate(-15deg)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
              <Grid item xs={12} lg={7}>
                <motion.div variants={itemVariants}>
                  {/* Eyebrow */}
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2.5,
                      py: 1,
                      bgcolor: '#9EFF00',
                      color: '#000',
                      fontWeight: 900,
                      fontSize: { xs: '0.7rem', md: '0.75rem' },
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      mb: 3,
                      transform: 'rotate(-2deg)',
                      boxShadow: '4px 4px 0px rgba(158, 255, 0, 0.3)',
                    }}
                  >
                    ⚡ FOOTY ATELIER 2026
                  </Box>

                  {/* Massive Hero Headline */}
                  <Typography
                    component="h1"
                    sx={{
                      fontFamily: 'var(--font-archivo-black)',
                      fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem', lg: '8.5rem' },
                      fontWeight: 400,
                      lineHeight: 0.85,
                      letterSpacing: '-0.03em',
                      color: '#fff',
                      textTransform: 'uppercase',
                      mb: 2,
                      textShadow: '6px 6px 0px rgba(158, 255, 0, 0.2)',
                    }}
                  >
                    STEP
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        color: '#9EFF00',
                        WebkitTextStroke: { xs: '1px #000', md: '2px #000' },
                        paintOrder: 'stroke fill',
                      }}
                    >
                      INTO
                    </Box>
                    <Box component="span" sx={{ display: 'block', fontStyle: 'italic' }}>
                      MOTION
                    </Box>
                  </Typography>

                  {/* Subheadline */}
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', md: '1.3rem' },
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.5,
                      maxWidth: '580px',
                      fontWeight: 500,
                      mb: 4,
                      pl: { xs: 0, md: 1 },
                    }}
                  >
                    Premium kicks engineered for speed, style, and the street.
                    Curated collections that move as fast as you do.
                  </Typography>

                  {/* CTA Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                    <Button
                      component={Link}
                      href="/catalog"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: '#9EFF00',
                        color: '#000',
                        px: 5,
                        py: 2,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: 0,
                        boxShadow: '6px 6px 0px rgba(255, 255, 255, 0.15)',
                        border: '2px solid #000',
                        '&:hover': {
                          bgcolor: '#B8FF33',
                          transform: 'translate(-2px, -2px)',
                          boxShadow: '8px 8px 0px rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      SHOP NOW
                    </Button>
                    <Button
                      component={Link}
                      href="/catalog?is_featured=true"
                      variant="outlined"
                      size="large"
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        borderWidth: '2px',
                        px: 5,
                        py: 2,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: 0,
                        '&:hover': {
                          borderWidth: '2px',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#9EFF00',
                          color: '#9EFF00',
                        },
                      }}
                    >
                      FEATURED
                    </Button>
                  </Stack>
                </motion.div>
              </Grid>

              {/* Stats Panel */}
              <Grid item xs={12} lg={5}>
                <motion.div variants={slideVariants}>
                  <Box
                    sx={{
                      position: 'relative',
                      bgcolor: '#9EFF00',
                      color: '#000',
                      p: { xs: 4, md: 5 },
                      border: '3px solid #000',
                      boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.8)',
                      transform: { xs: 'rotate(0deg)', md: 'rotate(2deg)' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-archivo-black)',
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        textTransform: 'uppercase',
                        mb: 3,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      BY THE NUMBERS
                    </Typography>

                    <Stack spacing={3}>
                      {heroStats.map((stat, index) => (
                        <Box
                          key={stat.label}
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 2,
                            borderBottom: index !== heroStats.length - 1 ? '2px solid #000' : 'none',
                            pb: index !== heroStats.length - 1 ? 3 : 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-archivo-black)',
                              fontSize: { xs: '3.5rem', md: '4.5rem' },
                              lineHeight: 1,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {stat.unit}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: '0.75rem', md: '0.85rem' },
                                fontWeight: 600,
                                opacity: 0.7,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    {/* Corner Accent */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 30,
                        height: 30,
                        bgcolor: '#000',
                        border: '3px solid #9EFF00',
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            opacity: 0.6,
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em' }}>
            SCROLL
          </Typography>
          <Box
            component={motion.div}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            sx={{
              width: 2,
              height: 30,
              bgcolor: '#9EFF00',
            }}
          />
        </Box>
      </Box>

      {/* CATEGORY SECTION - Grid Breaking Layout */}
      {categories && categories.length > 0 && (
        <Box sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
            >
              <Box sx={{ mb: 6 }}>
                <motion.div variants={itemVariants}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-archivo-black)',
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      textTransform: 'uppercase',
                      lineHeight: 0.9,
                      mb: 2,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '60%',
                        height: 6,
                        bgcolor: '#9EFF00',
                      },
                    }}
                  >
                    COLLECTIONS
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      color: '#666',
                      fontWeight: 600,
                      mt: 3,
                      maxWidth: '600px',
                    }}
                  >
                    Explore curated lines designed for every stride, every style, every moment.
                  </Typography>
                </motion.div>
              </Box>

              <Grid container spacing={3}>
                {categories.slice(0, 6).map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      <Box
                        component={Link}
                        href={`/catalog?category=${category.slug}`}
                        sx={{
                          display: 'block',
                          position: 'relative',
                          height: 280,
                          bgcolor: index % 2 === 0 ? '#000' : '#9EFF00',
                          color: index % 2 === 0 ? '#fff' : '#000',
                          p: 4,
                          border: '3px solid #000',
                          textDecoration: 'none',
                          overflow: 'hidden',
                          boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          '&:hover': {
                            boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.3)',
                            '& .arrow': {
                              transform: 'translate(8px, -8px)',
                            },
                          },
                        }}
                      >
                        {/* Diagonal Background Pattern */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '200%',
                            height: '200%',
                            background: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 20px,
                              ${index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 20px,
                              ${index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 40px
                            )`,
                            transform: 'rotate(-15deg)',
                          }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                              fontWeight: 800,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              opacity: 0.6,
                              mb: 2,
                            }}
                          >
                            COLLECTION #{String(index + 1).padStart(2, '0')}
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: 'var(--font-archivo-black)',
                              fontSize: { xs: '2rem', md: '2.5rem' },
                              textTransform: 'uppercase',
                              lineHeight: 0.9,
                              mb: 'auto',
                            }}
                          >
                            {category.name}
                          </Typography>

                          <Box
                            className="arrow"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              letterSpacing: '0.05em',
                              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          >
                            EXPLORE <ArrowForwardIcon fontSize="small" />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      )}

      {/* FEATURED PRODUCTS SECTION - Magazine Grid */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                mb: 6,
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-archivo-black)',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '70%',
                      height: 6,
                      bgcolor: '#9EFF00',
                    },
                  }}
                >
                  FEATURED
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    color: '#666',
                    fontWeight: 600,
                    mt: 3,
                  }}
                >
                  Hand-picked selections from the editorial team
                </Typography>
              </motion.div>

              <Button
                component={Link}
                href="/catalog?is_featured=true"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#000',
                  color: '#9EFF00',
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: 0,
                  border: '2px solid #000',
                  '&:hover': {
                    bgcolor: '#9EFF00',
                    color: '#000',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                VIEW ALL
              </Button>
            </Box>

            {productsLoading ? (
              <ProductGridSkeleton count={4} />
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {featuredProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <motion.div
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                    >
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
          </motion.div>
        </Container>
      </Box>

      {/* FINAL CTA SECTION - Bold Statement */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '80%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(158, 255, 0, 0.1) 0%, transparent 60%)',
            transform: 'rotate(-20deg)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-archivo-black)',
                  fontSize: { xs: '3rem', sm: '5rem', md: '7rem' },
                  textTransform: 'uppercase',
                  lineHeight: 0.85,
                  mb: 4,
                  letterSpacing: '-0.02em',
                }}
              >
                MOVE
                <Box component="span" sx={{ display: 'block', color: '#9EFF00' }}>
                  WITH
                </Box>
                PURPOSE
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  mb: 6,
                  fontWeight: 500,
                }}
              >
                Join the movement. Premium footwear engineered for those who refuse to stand still.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  component={Link}
                  href="/catalog"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#9EFF00',
                    color: '#000',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: 0,
                    boxShadow: '8px 8px 0px rgba(158, 255, 0, 0.3)',
                    border: '3px solid #000',
                    '&:hover': {
                      bgcolor: '#B8FF33',
                      transform: 'translate(-3px, -3px)',
                      boxShadow: '11px 11px 0px rgba(158, 255, 0, 0.4)',
                    },
                  }}
                >
                  START SHOPPING
                </Button>
                <Button
                  component={Link}
                  href="/account"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#9EFF00',
                    borderColor: '#9EFF00',
                    borderWidth: '3px',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: 0,
                    '&:hover': {
                      borderWidth: '3px',
                      bgcolor: 'rgba(158, 255, 0, 0.1)',
                    },
                  }}
                >
                  JOIN NOW
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
