'use client';

import { Suspense, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Box, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useCategories } from '@/lib/queries';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ActiveFilters } from '@/components/catalog/ActiveFilters';
import { SortDropdown } from '@/components/catalog/SortDropdown';
import { ViewModeToggle } from '@/components/catalog/ViewModeToggle';
import type { ProductFilters, Product } from '@/types';

const FILTER_DRAWER_WIDTH = 320;

// Custom SVG Icons
const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="currentColor" />
    <circle cx="16" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useMemo(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 900);
      const handleResize = () => setIsMobile(window.innerWidth < 900);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // View mode and sort state
  const viewMode = searchParams.get('view') || (isMobile ? 'grid2' : 'grid4');
  const sortBy = searchParams.get('sort') || 'featured';

  const filters: ProductFilters = {
    category_slug: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    gender: searchParams.get('gender') || undefined,
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || undefined,
    in_stock: searchParams.get('in_stock') === 'true' || undefined,
    search: searchParams.get('search') || undefined,
  };

  const page = parseInt(searchParams.get('page') || '1', 10);

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorObj,
    refetch: refetchProducts,
  } = useProducts(filters, { page, page_size: 12 });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const updateFilters = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams();

      if (newFilters.category_slug) params.set('category', newFilters.category_slug);
      if (newFilters.brand) params.set('brand', newFilters.brand);
      if (newFilters.gender) params.set('gender', newFilters.gender);
      if (newFilters.min_price !== undefined) params.set('min_price', newFilters.min_price.toString());
      if (newFilters.max_price !== undefined) params.set('max_price', newFilters.max_price.toString());
      if (newFilters.sizes?.length) params.set('sizes', newFilters.sizes.join(','));
      if (newFilters.in_stock) params.set('in_stock', 'true');
      if (newFilters.search) params.set('search', newFilters.search);

      router.push(`/catalog?${params.toString()}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (viewMode) params.set('view', viewMode);
    if (sortBy) params.set('sort', sortBy);
    router.push(`/catalog?${params.toString()}`);
  }, [router, viewMode, sortBy]);

  const selectedCategory = categories?.find((c) => c.slug === filters.category_slug);

  // Client-side sorting
  const sortProducts = useCallback((products: Product[], sortBy: string): Product[] => {
    if (!products || products.length === 0) return products;
    const sorted = [...products];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      case 'price_asc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price_desc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return sorted;
    }
  }, []);

  const sortedProducts = useMemo(
    () => sortProducts(products?.items || [], sortBy),
    [products?.items, sortBy, sortProducts]
  );

  const handleViewModeChange = useCallback(
    (mode: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', mode);
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', sort);
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleFilterRemove = useCallback(
    (filterType: string, value?: string) => {
      const newFilters = { ...filters };

      switch (filterType) {
        case 'category':
          newFilters.category_slug = undefined;
          break;
        case 'brand':
          newFilters.brand = undefined;
          break;
        case 'gender':
          newFilters.gender = undefined;
          break;
        case 'price':
          newFilters.min_price = undefined;
          newFilters.max_price = undefined;
          break;
        case 'size':
          if (value) {
            newFilters.sizes = newFilters.sizes?.filter((s) => s !== value);
          }
          break;
        case 'in_stock':
          newFilters.in_stock = undefined;
          break;
        case 'search':
          newFilters.search = undefined;
          break;
        case 'featured':
          newFilters.is_featured = undefined;
          break;
      }

      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category_slug) count++;
    if (filters.brand) count++;
    if (filters.gender) count++;
    if (filters.sizes?.length) count += filters.sizes.length;
    if (filters.min_price !== undefined || filters.max_price !== undefined) count++;
    if (filters.in_stock) count++;
    if (filters.search) count++;
    if (filters.is_featured) count++;
    return count;
  }, [filters]);

  const filterSidebar = (
    <FilterSidebar
      categories={categories}
      filters={filters}
      onFilterChange={updateFilters}
      onClearFilters={handleClearFilters}
      isLoading={categoriesLoading}
    />
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 85% 5%, rgba(158, 255, 0, 0.15) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(24, 24, 24, 0.06) 0%, transparent 50%)'
              : 'radial-gradient(circle at 85% 5%, rgba(158, 255, 0, 0.12) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 7 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Hero header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                Footwear Collection
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
              <Box
                component="h1"
                sx={{
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.8rem' },
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  fontFamily: 'var(--font-satoshi)',
                  mb: 2,
                }}
              >
                {selectedCategory ? (
                  <>
                    {selectedCategory.name}
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'linear-gradient(120deg, #181818 0%, #7ECC00 70%)'
                            : 'linear-gradient(120deg, #ffffff 0%, #9EFF00 70%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Archive
                    </Box>
                  </>
                ) : (
                  <>
                    Products
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'linear-gradient(120deg, #181818 0%, #7ECC00 70%)'
                            : 'linear-gradient(120deg, #ffffff 0%, #9EFF00 70%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Catalog
                    </Box>
                  </>
                )}
              </Box>
              <Box
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                }}
              >
                {products?.total || 0} curated styles. Every step tells a story.
              </Box>
            </Box>
          </motion.div>

          {/* Controls bar */}
          <motion.div variants={itemVariants}>
            <CatalogHeader
              category={selectedCategory}
              resultsCount={sortedProducts.length}
              totalCount={products?.total}
              viewMode={viewMode}
              sortBy={sortBy}
              onViewModeChange={handleViewModeChange}
              onSortChange={handleSortChange}
            >
              <SortDropdown value={sortBy} onChange={handleSortChange} />
              <ViewModeToggle value={viewMode} onChange={handleViewModeChange} />
            </CatalogHeader>
          </motion.div>

          {/* Active Filters */}
          <motion.div variants={itemVariants}>
            <ActiveFilters
              filters={filters}
              categories={categories}
              onFilterRemove={handleFilterRemove}
              onClearAll={handleClearFilters}
            />
          </motion.div>

          {/* Main content grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
              gap: { xs: 3, md: 5 },
              mt: 4,
            }}
          >
            {/* Desktop filter sidebar */}
            {!isMobile && (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 24,
                    maxHeight: 'calc(100vh - 48px)',
                    overflowY: 'auto',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    p: 3,
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      boxShadow: (theme) =>
                        theme.palette.mode === 'light'
                          ? '0 12px 32px rgba(24, 24, 24, 0.08)'
                          : '0 12px 32px rgba(0, 0, 0, 0.25)',
                    },
                    '&::-webkit-scrollbar': {
                      width: 6,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'divider',
                      borderRadius: 3,
                    },
                  }}
                >
                  {filterSidebar}
                </Box>
              </motion.div>
            )}

            {/* Product grid */}
            <motion.div variants={itemVariants}>
              <ProductGrid
                products={{ ...products, items: sortedProducts } as typeof products}
                isLoading={productsLoading}
                isError={productsError}
                error={productsErrorObj}
                page={page}
                onPageChange={handlePageChange}
                onRetry={() => refetchProducts()}
                viewMode={viewMode as 'grid2' | 'grid3' | 'grid4' | 'list'}
              />
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Mobile floating filter button */}
      {isMobile && (
        <Box
          component="button"
          onClick={() => setMobileFilterOpen(true)}
          aria-label="Open filters"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(158, 255, 0, 0.35)',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              transform: 'scale(1.08)',
              boxShadow: '0 12px 32px rgba(158, 255, 0, 0.45)',
            },
            '&:active': {
              transform: 'scale(0.96)',
            },
          }}
        >
          {activeFilterCount > 0 ? (
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              {activeFilterCount}
            </Box>
          ) : null}
          <FilterIcon />
        </Box>
      )}

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileFilterOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1200,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: FILTER_DRAWER_WIDTH,
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Drawer header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'text.primary',
                      fontFamily: 'var(--font-satoshi)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Filters
                    {activeFilterCount > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: 1.5,
                          fontSize: '0.9rem',
                          color: 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        ({activeFilterCount})
                      </Box>
                    )}
                  </Box>
                  <Box
                    component="button"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Close filters"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1.5px solid',
                      borderColor: 'divider',
                      bgcolor: 'transparent',
                      color: 'text.primary',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        bgcolor: 'rgba(158, 255, 0, 0.08)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </Box>
                </Box>

                {/* Filter content */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>{filterSidebar}</Box>

                {/* Apply button */}
                <Box
                  sx={{
                    p: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => setMobileFilterOpen(false)}
                    sx={{
                      width: '100%',
                      px: 3,
                      py: 2,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(24, 24, 24, 0.2)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    Apply Filters
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 12,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                border: '3px solid',
                borderColor: 'divider',
                borderTopColor: 'secondary.main',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        </Container>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
