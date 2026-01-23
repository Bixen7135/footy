'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Box,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useProducts, useCategories } from '@/lib/queries';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import type { ProductFilters } from '@/types';

const FILTER_DRAWER_WIDTH = 280;

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL
  const filters: ProductFilters = {
    category_slug: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    gender: searchParams.get('gender') || undefined,
    min_price: searchParams.get('min_price')
      ? parseFloat(searchParams.get('min_price')!)
      : undefined,
    max_price: searchParams.get('max_price')
      ? parseFloat(searchParams.get('max_price')!)
      : undefined,
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || undefined,
    in_stock: searchParams.get('in_stock') === 'true' || undefined,
    search: searchParams.get('search') || undefined,
  };

  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch data
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorObj,
    refetch: refetchProducts,
  } = useProducts(filters, { page, page_size: 12 });

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();

  // Update URL with new filters
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

      // Reset to page 1 when filters change
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
    router.push('/catalog');
  }, [router]);

  const selectedCategory = categories?.find(
    (c) => c.slug === filters.category_slug
  );

  const filterSidebar = (
    <FilterSidebar
      categories={categories}
      filters={filters}
      onFilterChange={updateFilters}
      onClearFilters={handleClearFilters}
      isLoading={categoriesLoading}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">
          {selectedCategory?.name || 'All Products'}
        </Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          {selectedCategory?.name || 'All Products'}
        </Typography>

        {/* Mobile filter button */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileFilterOpen(true)}
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <FilterListIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Desktop filter sidebar */}
        {!isMobile && (
          <Grid item md={3} lg={2.5}>
            <Box
              sx={{
                position: 'sticky',
                top: 16,
                maxHeight: 'calc(100vh - 32px)',
                overflowY: 'auto',
              }}
            >
              {filterSidebar}
            </Box>
          </Grid>
        )}

        {/* Product grid */}
        <Grid item xs={12} md={9} lg={9.5}>
          <ProductGrid
            products={products}
            isLoading={productsLoading}
            isError={productsError}
            error={productsErrorObj}
            page={page}
            onPageChange={handlePageChange}
            onRetry={() => refetchProducts()}
          />
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: { width: FILTER_DRAWER_WIDTH, p: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {filterSidebar}
      </Drawer>
    </Container>
  );
}
