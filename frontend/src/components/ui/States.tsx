'use client';

import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

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
    <Paper
      elevation={0}
      sx={{
        py: 8,
        px: 4,
        textAlign: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Paper>
  );
}

// Empty cart state
export function EmptyCartState({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      icon={ShoppingBagOutlinedIcon}
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
    <Paper
      elevation={0}
      sx={{
        py: 8,
        px: 4,
        textAlign: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </Paper>
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
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
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
