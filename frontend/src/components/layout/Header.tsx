'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCartItemCount, useCartStore } from '@/stores/cart';
import { useAuthStore, initializeAuth } from '@/stores/auth';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/catalog' },
  { label: 'Sneakers', href: '/catalog?category=sneakers' },
  { label: 'Running', href: '/catalog?category=running' },
  { label: 'Boots', href: '/catalog?category=boots' },
];

export function Header() {
  const router = useRouter();
  const cartItemCount = useCartItemCount();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Fetch cart and auth on mount
  useEffect(() => {
    fetchCart();
    initializeAuth();
  }, [fetchCart]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleAccountMenuClose();
    router.push('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              href="/"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                color: 'inherit',
                mr: 4,
              }}
            >
              Footy
            </Typography>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: pathname === item.href ? 'primary.main' : 'text.primary',
                      fontWeight: pathname === item.href ? 600 : 400,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Spacer for mobile */}
            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                component={Link}
                href="/catalog?search="
                aria-label="Search"
              >
                <SearchIcon />
              </IconButton>

              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleAccountMenuOpen}
                    aria-label="Account menu"
                    aria-controls="account-menu"
                    aria-haspopup="true"
                  >
                    <PersonOutlineIcon />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={accountMenuAnchor}
                    open={Boolean(accountMenuAnchor)}
                    onClose={handleAccountMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem disabled sx={{ opacity: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {user?.name}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={Link}
                      href="/account"
                      onClick={handleAccountMenuClose}
                    >
                      My Account
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/account/orders"
                      onClick={handleAccountMenuClose}
                    >
                      Orders
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Sign In
                </Button>
              )}

              <IconButton
                component={Link}
                href="/cart"
                aria-label="Shopping cart"
              >
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile navigation drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {isAuthenticated ? (
            <>
              <ListItem sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Signed in as {user?.name}
                </Typography>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="My Account" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Orders" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Create Account" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemText primary="Shopping Cart" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
