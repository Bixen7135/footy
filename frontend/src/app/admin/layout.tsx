'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  useMediaQuery,
  Drawer as MuiDrawer,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Category as CategoryIcon,
  Storefront as StorefrontIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuthStore, useIsAdmin } from '@/stores/auth';
import { motion, AnimatePresence } from 'framer-motion';
import './admin.module.css';

const NAV_WIDTH = 280;

const navItems = [
  { label: 'DASHBOARD', href: '/admin', icon: <DashboardIcon />, code: 'DASH' },
  { label: 'PRODUCTS', href: '/admin/products', icon: <InventoryIcon />, code: 'PROD' },
  { label: 'ORDERS', href: '/admin/orders', icon: <OrdersIcon />, code: 'ORDR' },
  { label: 'CATEGORIES', href: '/admin/categories', icon: <CategoryIcon />, code: 'CATG' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 960px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const { isAuthenticated, isLoading, logout, fetchCurrentUser } = useAuthStore();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#0a0a0a',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#9EFF00' }} />
          <Typography sx={{ mt: 2, color: '#9EFF00', fontFamily: 'monospace' }}>
            AUTHENTICATING...
          </Typography>
        </Box>
      </Box>
    );
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#0a0a0a',
        borderRight: mobile ? 'none' : '2px solid #9EFF00',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Noise texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(158, 255, 0, 0.2)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#9EFF00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #000',
                boxShadow: '3px 3px 0 rgba(158, 255, 0, 0.3)',
              }}
            >
              <StorefrontIcon sx={{ color: '#000', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'var(--font-archivo-black)',
                  fontSize: '1.3rem',
                  color: '#9EFF00',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}
              >
                FOOTY
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  color: 'rgba(158, 255, 0, 0.6)',
                  letterSpacing: '0.15em',
                  mt: 0.5,
                }}
              >
                ADMIN.CONSOLE
              </Typography>
            </Box>
          </Box>
          {mobile && (
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#9EFF00' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Live time display */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'rgba(158, 255, 0, 0.05)',
            border: '1px solid rgba(158, 255, 0, 0.2)',
            fontFamily: 'monospace',
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(158, 255, 0, 0.6)', mb: 0.5 }}>
            SYSTEM TIME
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: '#9EFF00', fontWeight: 700 }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(158, 255, 0, 0.5)' }}>
            {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box
        className="admin-scrollbar"
        sx={{ flex: 1, p: 2, position: 'relative', zIndex: 1, overflowY: 'auto' }}
      >
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: 'rgba(158, 255, 0, 0.4)',
            letterSpacing: '0.15em',
            fontFamily: 'monospace',
            mb: 2,
            px: 1,
          }}
        >
          /// NAVIGATION
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Box
                key={item.href}
                component={motion.button}
                onClick={() => handleNavClick(item.href)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: isActive ? 'rgba(158, 255, 0, 0.1)' : 'transparent',
                  border: isActive ? '2px solid #9EFF00' : '2px solid transparent',
                  color: isActive ? '#9EFF00' : 'rgba(158, 255, 0, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  '&:hover': {
                    bgcolor: 'rgba(158, 255, 0, 0.08)',
                    borderColor: 'rgba(158, 255, 0, 0.4)',
                    color: '#9EFF00',
                  },
                }}
              >
                {/* Status indicator */}
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: isActive ? '#9EFF00' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? '#9EFF00' : 'rgba(158, 255, 0, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                />

                <Box sx={{ fontSize: 20 }}>{item.icon}</Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                      opacity: 0.6,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {item.code}_{String(index + 1).padStart(2, '0')}
                  </Typography>
                </Box>

                {isActive && (
                  <Box
                    component={motion.div}
                    layoutId="activeIndicator"
                    sx={{
                      position: 'absolute',
                      left: -2,
                      top: -2,
                      bottom: -2,
                      width: 4,
                      bgcolor: '#9EFF00',
                      boxShadow: '0 0 10px #9EFF00',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Footer actions */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(158, 255, 0, 0.2)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component={motion.button}
            onClick={() => router.push('/')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              bgcolor: 'transparent',
              border: '1px solid rgba(158, 255, 0, 0.3)',
              color: 'rgba(158, 255, 0, 0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              '&:hover': {
                bgcolor: 'rgba(158, 255, 0, 0.05)',
                borderColor: '#9EFF00',
                color: '#9EFF00',
              },
            }}
          >
            <StorefrontIcon fontSize="small" />
            VIEW STORE
          </Box>

          <Box
            component={motion.button}
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: 'rgba(255, 100, 100, 0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              '&:hover': {
                bgcolor: 'rgba(255, 0, 0, 0.05)',
                borderColor: '#ff3333',
                color: '#ff6666',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
            LOGOUT
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#000' }}>
      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <MuiDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: NAV_WIDTH,
                boxSizing: 'border-box',
              },
            }}
          >
            <SidebarContent mobile />
          </MuiDrawer>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: NAV_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            height: '100vh',
            zIndex: 1200,
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Main content area */}
      <Box
        className="admin-scrollbar admin-scanline"
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${NAV_WIDTH}px`,
          minHeight: '100vh',
          bgcolor: '#000',
          position: 'relative',
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: '#0a0a0a',
            borderBottom: '2px solid #9EFF00',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              minHeight: 64,
            }}
          >
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#9EFF00', mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: '#9EFF00',
                  boxShadow: '0 0 10px #9EFF00',
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-archivo-black)',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  color: '#9EFF00',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {navItems.find((item) => item.href === pathname)?.label || 'ADMIN'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: 'rgba(158, 255, 0, 0.05)',
                border: '1px solid rgba(158, 255, 0, 0.2)',
                fontFamily: 'monospace',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#9EFF00',
                  boxShadow: '0 0 8px #9EFF00',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Typography sx={{ fontSize: '0.8rem', color: '#9EFF00', letterSpacing: '0.05em' }}>
                SYSTEM ONLINE
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Page content */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            p: { xs: 2, md: 4 },
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
