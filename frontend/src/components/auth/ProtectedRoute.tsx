'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore, initializeAuth } from '@/stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAdmin && user?.role !== 'admin') {
      // Redirect non-admin users to home
      router.push('/');
      return;
    }
  }, [isInitialized, isLoading, isAuthenticated, user, requireAdmin, router, pathname]);

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Don't render children until auth is verified
  if (!isAuthenticated) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for page-level protection
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAdmin?: boolean }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requireAdmin={options?.requireAdmin}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
