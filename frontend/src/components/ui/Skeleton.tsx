'use client';

import { Skeleton as MuiSkeleton, Box, Card, CardContent, Grid } from '@mui/material';

// Base skeleton component
export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  ...props
}: {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation="wave"
      {...props}
    />
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MuiSkeleton
        variant="rectangular"
        height={200}
        animation="wave"
        sx={{ borderRadius: 0 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <MuiSkeleton variant="text" width="80%" height={24} />
        <MuiSkeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <MuiSkeleton variant="text" width="40%" height={28} />
          <MuiSkeleton variant="text" width="30%" height={28} />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <MuiSkeleton key={i} variant="rounded" width={32} height={24} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({
  count = 12,
  viewMode = 'grid4'
}: {
  count?: number;
  viewMode?: 'grid2' | 'grid3' | 'grid4' | 'list';
}) {
  const getGridColumns = () => {
    switch (viewMode) {
      case 'grid2':
        return { xs: 12, sm: 6 };
      case 'grid3':
        return { xs: 12, sm: 6, md: 4 };
      case 'grid4':
        return { xs: 12, sm: 6, md: 4, lg: 3 };
      case 'list':
        return { xs: 12 };
      default:
        return { xs: 12, sm: 6, md: 4, lg: 3 };
    }
  };

  const gridColumns = getGridColumns();

  return (
    <Grid container spacing={viewMode === 'list' ? 2 : 3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item {...gridColumns} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

// Product detail skeleton
export function ProductDetailSkeleton() {
  return (
    <Grid container spacing={4}>
      {/* Image gallery skeleton */}
      <Grid item xs={12} md={6}>
        <MuiSkeleton
          variant="rectangular"
          height={500}
          animation="wave"
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <MuiSkeleton
              key={i}
              variant="rectangular"
              width={80}
              height={80}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Grid>

      {/* Details skeleton */}
      <Grid item xs={12} md={6}>
        <MuiSkeleton variant="text" width="30%" height={24} />
        <MuiSkeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <MuiSkeleton variant="text" width={100} height={36} />
          <MuiSkeleton variant="text" width={80} height={36} />
        </Box>
        <MuiSkeleton variant="text" width="100%" height={100} sx={{ mt: 3 }} />
        <MuiSkeleton variant="text" width="40%" height={24} sx={{ mt: 3 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MuiSkeleton key={i} variant="rounded" width={48} height={40} />
          ))}
        </Box>
        <MuiSkeleton
          variant="rectangular"
          width="100%"
          height={48}
          sx={{ mt: 3, borderRadius: 1 }}
        />
      </Grid>
    </Grid>
  );
}

// Category list skeleton
export function CategoryListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: count }).map((_, index) => (
        <MuiSkeleton key={index} variant="text" width="70%" height={32} />
      ))}
    </Box>
  );
}

// Filter sidebar skeleton
export function FilterSidebarSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Categories */}
      <Box>
        <MuiSkeleton variant="text" width="50%" height={28} />
        <CategoryListSkeleton count={5} />
      </Box>

      {/* Price range */}
      <Box>
        <MuiSkeleton variant="text" width="40%" height={28} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <MuiSkeleton variant="rectangular" width="45%" height={40} />
          <MuiSkeleton variant="rectangular" width="45%" height={40} />
        </Box>
      </Box>

      {/* Sizes */}
      <Box>
        <MuiSkeleton variant="text" width="30%" height={28} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <MuiSkeleton key={i} variant="rounded" width={40} height={36} />
          ))}
        </Box>
      </Box>

      {/* Colors */}
      <Box>
        <MuiSkeleton variant="text" width="35%" height={28} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <MuiSkeleton key={i} variant="circular" width={32} height={32} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
