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
  Fade,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCartItemCount, useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        elevation={0}
        sx={{
          bgcolor: isDark
            ? scrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.7)'
            : scrolled ? 'rgba(250, 250, 247, 0.95)' : 'rgba(250, 250, 247, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? `2px solid ${theme.palette.secondary.main}` : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(158, 255, 0, 0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(24, 24, 24, 0.2), transparent)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.4s ease',
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 70, md: 80 },
              position: 'relative',
            }}
          >
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  mr: 2,
                  width: 44,
                  height: 44,
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                    transform: 'rotate(90deg)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                position: 'relative',
                mr: { xs: 2, md: 6 },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  background: isDark
                    ? 'linear-gradient(135deg, #fff 0%, #9EFF00 100%)'
                    : 'linear-gradient(135deg, #181818 0%, #9EFF00 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: theme.palette.secondary.main,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
              >
                FOOTY
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{
                display: 'flex',
                gap: 0.5,
                flexGrow: 1,
                alignItems: 'center',
              }}>
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      sx={{
                        color: isActive ? theme.palette.secondary.main : 'text.primary',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        px: 2.5,
                        py: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          bgcolor: theme.palette.secondary.main,
                          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                          color: theme.palette.secondary.main,
                          '&::before': {
                            transform: 'scaleX(1)',
                          },
                        },
                        animation: `slideInNav 0.5s ease forwards ${index * 0.1}s`,
                        opacity: 0,
                        '@keyframes slideInNav': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                component={Link}
                href="/catalog?search="
                aria-label="Search"
                sx={{
                  width: 44,
                  height: 44,
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                    transform: 'scale(1.05)',
                  },
                }}
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
                    sx={{
                      width: 44,
                      height: 44,
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.secondary.main,
                        bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <PersonOutlineIcon />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={accountMenuAnchor}
                    open={Boolean(accountMenuAnchor)}
                    onClose={handleAccountMenuClose}
                    TransitionComponent={Fade}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{
                      '& .MuiPaper-root': {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: '12px',
                        border: `2px solid ${theme.palette.secondary.main}`,
                        bgcolor: isDark ? 'rgba(24, 24, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: isDark
                          ? '0 8px 32px rgba(158, 255, 0, 0.15)'
                          : '0 8px 32px rgba(24, 24, 24, 0.1)',
                      },
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 1, py: 1.5 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user?.name}
                      </Typography>
                    </MenuItem>
                    <Divider sx={{ borderColor: theme.palette.secondary.main, opacity: 0.3 }} />
                    <MenuItem
                      component={Link}
                      href="/account"
                      onClick={handleAccountMenuClose}
                      sx={{
                        py: 1.5,
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                        },
                      }}
                    >
                      My Account
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/account/orders"
                      onClick={handleAccountMenuClose}
                      sx={{
                        py: 1.5,
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                        },
                      }}
                    >
                      Orders
                    </MenuItem>
                    <Divider sx={{ borderColor: theme.palette.secondary.main, opacity: 0.3 }} />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        fontWeight: 500,
                        color: isDark ? '#ff4444' : '#d32f2f',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255, 68, 68, 0.05)' : 'rgba(211, 47, 47, 0.05)',
                        },
                      }}
                    >
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
                  sx={{
                    ml: 1,
                    px: 2.5,
                    py: 1,
                    borderRadius: '10px',
                    border: `1.5px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.secondary.main,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: `1.5px solid ${theme.palette.secondary.main}`,
                      bgcolor: theme.palette.secondary.main,
                      color: isDark ? '#181818' : '#181818',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${isDark ? 'rgba(158, 255, 0, 0.3)' : 'rgba(158, 255, 0, 0.4)'}`,
                    },
                  }}
                >
                  Sign In
                </Button>
              )}

              <IconButton
                component={Link}
                href="/cart"
                aria-label="Shopping cart"
                sx={{
                  width: 44,
                  height: 44,
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Badge
                  badgeContent={cartItemCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: theme.palette.secondary.main,
                      color: '#181818',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: isDark ? 'rgba(10, 10, 10, 0.98)' : 'rgba(250, 250, 247, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: `2px solid ${theme.palette.secondary.main}`,
          },
        }}
      >
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
        }}>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              background: isDark
                ? 'linear-gradient(135deg, #fff 0%, #9EFF00 100%)'
                : 'linear-gradient(135deg, #181818 0%, #9EFF00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Menu
          </Typography>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              width: 40,
              height: 40,
              border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
              borderRadius: '8px',
              '&:hover': {
                borderColor: theme.palette.secondary.main,
                bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2, py: 3 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: '10px',
                  py: 1.5,
                  border: pathname === item.href
                    ? `1.5px solid ${theme.palette.secondary.main}`
                    : `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(24,24,24,0.05)'}`,
                  bgcolor: pathname === item.href
                    ? isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                    borderColor: theme.palette.secondary.main,
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: pathname === item.href ? 700 : 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.9rem',
                    color: pathname === item.href ? theme.palette.secondary.main : 'inherit',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: theme.palette.secondary.main, opacity: 0.3, mx: 2 }} />
        <List sx={{ px: 2, py: 2 }}>
          {isAuthenticated ? (
            <>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  }}
                >
                  {user?.name}
                </Typography>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(24,24,24,0.05)'}`,
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                      borderColor: theme.palette.secondary.main,
                    },
                  }}
                >
                  <ListItemText
                    primary="My Account"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(24,24,24,0.05)'}`,
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                      borderColor: theme.palette.secondary.main,
                    },
                  }}
                >
                  <ListItemText
                    primary="Orders"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    border: `1.5px solid ${isDark ? 'rgba(255, 68, 68, 0.2)' : 'rgba(211, 47, 47, 0.2)'}`,
                    color: isDark ? '#ff4444' : '#d32f2f',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255, 68, 68, 0.05)' : 'rgba(211, 47, 47, 0.05)',
                      borderColor: isDark ? '#ff4444' : '#d32f2f',
                    },
                  }}
                >
                  <ListItemText
                    primary="Sign Out"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    border: `1.5px solid ${theme.palette.secondary.main}`,
                    bgcolor: theme.palette.secondary.main,
                    color: '#181818',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  <ListItemText
                    primary="Sign In"
                    primaryTypographyProps={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(24,24,24,0.1)'}`,
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.1)',
                      borderColor: theme.palette.secondary.main,
                    },
                  }}
                >
                  <ListItemText
                    primary="Create Account"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
