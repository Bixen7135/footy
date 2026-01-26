'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  TextField,
  Button,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/catalog' },
    { label: 'Sneakers', href: '/catalog?category=sneakers' },
    { label: 'Running', href: '/catalog?category=running' },
    { label: 'Boots', href: '/catalog?category=boots' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
  ],
};

const TRUST_BADGES = [
  { icon: LocalShippingOutlinedIcon, label: 'Free Shipping', detail: 'On orders $100+' },
  { icon: SecurityOutlinedIcon, label: 'Secure Payment', detail: '100% protected' },
  { icon: SupportAgentOutlinedIcon, label: '24/7 Support', detail: 'Always here' },
];

export function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? '#0a0a0a' : '#181818',
        color: isDark ? '#b3b3b3' : '#b3b3b3',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg,
            transparent 0%,
            ${theme.palette.secondary.main} 25%,
            ${theme.palette.secondary.main} 75%,
            transparent 100%)`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-50%',
          width: '200%',
          height: '100%',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(158, 255, 0, 0.03) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(158, 255, 0, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Trust badges section */}
        <Box
          sx={{
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'}`,
            py: 5,
          }}
        >
          <Grid container spacing={3}>
            {TRUST_BADGES.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                      borderRadius: '16px',
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'}`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                      '&:hover': {
                        borderColor: theme.palette.secondary.main,
                        bgcolor: isDark ? 'rgba(158, 255, 0, 0.03)' : 'rgba(158, 255, 0, 0.05)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isDark ? 'rgba(158, 255, 0, 0.1)' : 'rgba(158, 255, 0, 0.15)',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <Icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          color: '#fff',
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontSize: '0.9rem',
                        }}
                      >
                        {badge.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
                        {badge.detail}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Main footer content */}
        <Grid container spacing={6} sx={{ py: 8 }}>
          {/* Brand section with newsletter */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3rem' },
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                background: `linear-gradient(135deg, #fff 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '60%',
                  height: '4px',
                  background: theme.palette.secondary.main,
                },
              }}
            >
              FOOTY
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                mt: 4,
                maxWidth: 380,
                color: '#b3b3b3',
                lineHeight: 1.7,
                fontSize: '1rem',
              }}
            >
              Premium footwear engineered for performance and style. Every step matters.
            </Typography>

            {/* Newsletter */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: '#fff',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.9rem',
                }}
              >
                Join The Movement
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  placeholder="Enter your email"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)'}`,
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover': {
                        borderColor: theme.palette.secondary.main,
                      },
                      '&.Mui-focused': {
                        borderColor: theme.palette.secondary.main,
                        bgcolor: isDark ? 'rgba(158, 255, 0, 0.03)' : 'rgba(158, 255, 0, 0.05)',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                      px: 2,
                      '&::placeholder': {
                        color: '#666',
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: '#181818',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    boxShadow: `0 4px 16px ${isDark ? 'rgba(158, 255, 0, 0.2)' : 'rgba(158, 255, 0, 0.3)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 24px ${isDark ? 'rgba(158, 255, 0, 0.3)' : 'rgba(158, 255, 0, 0.4)'}`,
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>

            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
              {[InstagramIcon, TwitterIcon, FacebookIcon, YouTubeIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: '#999',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      bgcolor: isDark ? 'rgba(158, 255, 0, 0.05)' : 'rgba(158, 255, 0, 0.08)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  aria-label={`Social media ${index + 1}`}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links sections */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              {/* Shop links */}
              <Grid item xs={6} sm={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#fff',
                    mb: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '0.9rem',
                  }}
                >
                  Shop
                </Typography>
                {FOOTER_LINKS.shop.map((link) => (
                  <Typography
                    key={link.href}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{
                      display: 'block',
                      mb: 2,
                      color: '#999',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      position: 'relative',
                      width: 'fit-content',
                      transition: 'all 0.3s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '0%',
                        height: '2px',
                        bgcolor: theme.palette.secondary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        transform: 'translateX(4px)',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Grid>

              {/* Help links */}
              <Grid item xs={6} sm={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#fff',
                    mb: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '0.9rem',
                  }}
                >
                  Help
                </Typography>
                {FOOTER_LINKS.help.map((link) => (
                  <Typography
                    key={link.href}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{
                      display: 'block',
                      mb: 2,
                      color: '#999',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      position: 'relative',
                      width: 'fit-content',
                      transition: 'all 0.3s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '0%',
                        height: '2px',
                        bgcolor: theme.palette.secondary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        transform: 'translateX(4px)',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Grid>

              {/* Company links */}
              <Grid item xs={6} sm={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#fff',
                    mb: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '0.9rem',
                  }}
                >
                  Company
                </Typography>
                {FOOTER_LINKS.company.map((link) => (
                  <Typography
                    key={link.href}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{
                      display: 'block',
                      mb: 2,
                      color: '#999',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      position: 'relative',
                      width: 'fit-content',
                      transition: 'all 0.3s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '0%',
                        height: '2px',
                        bgcolor: theme.palette.secondary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        transform: 'translateX(4px)',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider
          sx={{
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
            borderWidth: '1px',
          }}
        />

        {/* Bottom bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            py: 4,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            &copy; {new Date().getFullYear()} FOOTY. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography
              component={Link}
              href="/privacy"
              variant="body2"
              sx={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '0%',
                  height: '2px',
                  bgcolor: theme.palette.secondary.main,
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  color: theme.palette.secondary.main,
                  '&::after': {
                    width: '100%',
                  },
                },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component={Link}
              href="/terms"
              variant="body2"
              sx={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '0%',
                  height: '2px',
                  bgcolor: theme.palette.secondary.main,
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  color: theme.palette.secondary.main,
                  '&::after': {
                    width: '100%',
                  },
                },
              }}
            >
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
