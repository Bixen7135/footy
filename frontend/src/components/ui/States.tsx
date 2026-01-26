'use client';

import { Box } from '@mui/material';

// Custom SVG Icons
const SearchOffIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="2" />
  </svg>
);

const ErrorOutlineIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" strokeWidth="0" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FilterOffIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </svg>
);

const ClearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface StateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Empty state component
export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your filters or search terms.',
  action,
  icon: Icon = SearchOffIcon,
}: StateProps & { icon?: React.ElementType }) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Icon />
      </Box>
      <Box
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'text.primary',
          mb: 2,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: { xs: '0.95rem', md: '1rem' },
          color: 'text.secondary',
          lineHeight: 1.7,
          mb: 4,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {message}
      </Box>
      {action && (
        <Box
          component="button"
          onClick={action.onClick}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 4,
            py: 2,
            bgcolor: 'transparent',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: '14px',
            color: 'text.primary',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              borderColor: 'secondary.main',
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(158, 255, 0, 0.08)'
                  : 'rgba(158, 255, 0, 0.12)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {action.label}
        </Box>
      )}
    </Box>
  );
}

// Empty cart state
export function EmptyCartState({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      icon={ShoppingBagIcon}
      title="Your cart is empty"
      message="Looks like you haven't added anything to your cart yet."
      action={{
        label: 'Continue Shopping',
        onClick: onContinueShopping,
      }}
    />
  );
}

// Empty search results
export function EmptySearchState({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={SearchOffIcon}
      title={`No results for "${searchTerm}"`}
      message="Try checking your spelling or using different keywords."
      action={{
        label: 'Clear Search',
        onClick: onClear,
      }}
    />
  );
}

// Error state component
export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  onRetry,
}: StateProps & { onRetry?: () => void }) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: 'error.main', mb: 4, display: 'flex', justifyContent: 'center' }}>
        <ErrorOutlineIcon />
      </Box>
      <Box
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'text.primary',
          mb: 2,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: { xs: '0.95rem', md: '1rem' },
          color: 'text.secondary',
          lineHeight: 1.7,
          mb: 4,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {message}
      </Box>
      {onRetry && (
        <Box
          component="button"
          onClick={onRetry}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 4,
            py: 2,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(158, 255, 0, 0.3)',
            },
          }}
        >
          <RefreshIcon />
          Try Again
        </Box>
      )}
    </Box>
  );
}

// Inline error alert
export function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2.5,
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 0, 0, 0.08)'
            : 'rgba(255, 0, 0, 0.15)',
        borderLeft: '4px solid',
        borderLeftColor: 'error.main',
        borderRadius: '12px',
        color: (theme) => (theme.palette.mode === 'light' ? '#d32f2f' : '#ff5252'),
      }}
    >
      <Box sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{message}</Box>
      {onRetry && (
        <Box
          component="button"
          onClick={onRetry}
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'transparent',
            border: '1px solid currentColor',
            borderRadius: '8px',
            color: 'inherit',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Retry
        </Box>
      )}
    </Box>
  );
}

// Enhanced empty products state
export function EmptyProductsState({
  hasFilters = false,
  onClearFilters,
}: {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 8, md: 12 },
        px: 4,
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FilterOffIcon />
      </Box>
      <Box
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'text.primary',
          mb: 2,
          fontFamily: 'var(--font-satoshi)',
        }}
      >
        {hasFilters ? 'No products match your filters' : 'No products found'}
      </Box>
      <Box
        sx={{
          fontSize: { xs: '0.95rem', md: '1rem' },
          color: 'text.secondary',
          lineHeight: 1.7,
          mb: 4,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {hasFilters
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "We couldn't find any products at the moment. Please check back later."}
      </Box>
      {hasFilters && onClearFilters && (
        <Box
          component="button"
          onClick={onClearFilters}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 4,
            py: 2,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(158, 255, 0, 0.3)',
            },
          }}
        >
          <ClearIcon />
          Clear All Filters
        </Box>
      )}
    </Box>
  );
}

// Loading error boundary wrapper
export function LoadingError({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  children,
  loadingComponent,
  emptyComponent,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent: React.ReactNode;
  emptyComponent?: React.ReactNode;
}) {
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || 'An unexpected error occurred.'}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
}
