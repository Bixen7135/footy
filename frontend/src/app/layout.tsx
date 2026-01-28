'use client';

import { ReactNode, useMemo, useEffect } from 'react';
import { Work_Sans, Archivo_Black } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Header, Footer } from '@/components/layout';
import { initializeAuth } from '@/stores/auth';

// Satoshi font for headings
// Note: To use Satoshi font, place font files in public/fonts/ directory:
// - Satoshi-Regular.woff2, Satoshi-Medium.woff2, Satoshi-Bold.woff2, Satoshi-Black.woff2
// If fonts are not available, system fonts will be used as fallback
const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
  display: 'swap',
});

// Work Sans for body text - clean, geometric, slightly editorial
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
  display: 'swap',
});

// Archivo Black for ultra-bold display
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black',
  display: 'swap',
});

// Display font stack for hero headlines (Archivo Black)
const displayFontStack = [
  archivoBlack.style.fontFamily,
  'Impact',
  'Arial Black',
  'sans-serif',
].join(',');

// Shared heading font stack (Satoshi with fallbacks)
const headingFontStack = [
  satoshi.style.fontFamily || satoshi.variable,
  workSans.style.fontFamily,
  'system-ui',
  'sans-serif',
].join(',');

// Design system colors
const colors = {
  light: {
    primary: {
      main: '#181818', // Primary ink
      light: '#2a2a2a',
      dark: '#0a0a0a',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#9EFF00', // Accent green
      light: '#B8FF33',
      dark: '#7ECC00',
      contrastText: '#181818',
    },
    background: {
      default: '#FAFAF7', // Warm light background
      paper: '#ffffff',
    },
    text: {
      primary: '#181818',
      secondary: '#666666',
      disabled: '#999999',
    },
    divider: 'rgba(24, 24, 24, 0.12)',
  },
  dark: {
    primary: {
      main: '#ffffff',
      light: '#f5f5f5',
      dark: '#e0e0e0',
      contrastText: '#181818',
    },
    accent: {
      main: '#9EFF00',
      light: '#B8FF33',
      dark: '#7ECC00',
      contrastText: '#181818',
    },
    background: {
      default: '#0a0a0a',
      paper: '#181818',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

// Base theme configuration
const getBaseTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  const palette = colors[mode];

  return {
    palette: {
      mode,
      primary: palette.primary,
      secondary: palette.accent,
      background: palette.background,
      text: palette.text,
      divider: palette.divider,
    },
    typography: {
      fontFamily: [
        workSans.style.fontFamily,
        'system-ui',
        'sans-serif',
      ].join(','),
      // Standardized typography scale
      h1: {
        fontFamily: headingFontStack,
        fontWeight: 900,
        fontSize: '3.5rem', // 56px
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: headingFontStack,
        fontWeight: 700,
        fontSize: '2.75rem', // 44px
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: headingFontStack,
        fontWeight: 700,
        fontSize: '2rem', // 32px
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: headingFontStack,
        fontWeight: 700,
        fontSize: '1.5rem', // 24px
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: headingFontStack,
        fontWeight: 700,
        fontSize: '1.25rem', // 20px
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: headingFontStack,
        fontWeight: 700,
        fontSize: '1.125rem', // 18px
        lineHeight: 1.5,
      },
      body1: {
        fontFamily: workSans.style.fontFamily,
        fontWeight: 400,
        fontSize: '1rem', // 16px
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: workSans.style.fontFamily,
        fontWeight: 400,
        fontSize: '0.875rem', // 14px
        lineHeight: 1.5,
      },
      button: {
        fontFamily: workSans.style.fontFamily,
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
      caption: {
        fontFamily: workSans.style.fontFamily,
        fontWeight: 400,
        fontSize: '0.75rem', // 12px
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 8, // Standard border radius
    },
    components: {
      // Global focus-visible styles
      MuiCssBaseline: {
        styleOverrides: {
          // Ensure accessible contrast for focus - use darker shade on light, lighter on dark
          '*:focus-visible': {
            outline: `2px solid ${mode === 'light' ? '#7ECC00' : '#9EFF00'}`,
            outlineOffset: '2px',
            borderRadius: '2px',
          },
          // Disable focus for elements that shouldn't have it
          '*[data-focus-disabled]:focus-visible': {
            outline: 'none',
          },
        },
      },
      // Button component defaults
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
            '&:hover': {
              transform: 'translateY(-1px)',
              '@media (prefers-reduced-motion: reduce)': {
                transform: 'none',
              },
              boxShadow: mode === 'light' 
                ? '0 4px 12px rgba(24, 24, 24, 0.15)'
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
              '@media (prefers-reduced-motion: reduce)': {
                transform: 'none',
              },
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(24, 24, 24, 0.15)'
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      // Card component defaults
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${palette.divider}`,
            transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 8px 24px rgba(24, 24, 24, 0.12)'
                : '0 8px 24px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-2px)',
              '@media (prefers-reduced-motion: reduce)': {
                transform: 'none',
              },
            },
          },
        },
      },
      // TextField component defaults
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: palette.primary.main,
                  borderWidth: '1.5px',
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: palette.accent.main,
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      // Chip component defaults
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
            '&:hover': {
              transform: 'scale(1.05)',
              '@media (prefers-reduced-motion: reduce)': {
                transform: 'none',
              },
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      // Link component defaults
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
            '&:hover': {
              textDecoration: 'underline',
              textDecorationThickness: '1.5px',
              textUnderlineOffset: '2px',
            },
          },
        },
      },
      // Typography - apply Satoshi to headings
      MuiTypography: {
        styleOverrides: {
          h1: {
            fontFamily: headingFontStack,
          },
          h2: {
            fontFamily: headingFontStack,
          },
          h3: {
            fontFamily: headingFontStack,
          },
          h4: {
            fontFamily: headingFontStack,
          },
          h5: {
            fontFamily: headingFontStack,
          },
          h6: {
            fontFamily: headingFontStack,
          },
        },
      },
    },
  };
};

// Create light theme
const lightTheme = createTheme(getBaseTheme('light'));

// Create dark theme
const darkTheme = createTheme(getBaseTheme('dark'));

function ThemeWrapper({ children }: { children: ReactNode }) {
  // Detect system preference for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });

  // Use dark theme if system prefers dark mode, otherwise light
  const theme = useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  // Initialize auth on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <html lang="en" className={`${satoshi.variable} ${workSans.variable} ${archivoBlack.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Footy - Premium Footwear Store</title>
        <meta name="description" content="Discover premium footwear for every occasion at Footy. From casual sneakers to rugged boots and running shoes." />
        <style jsx global>{`
          :root {
            --font-satoshi: ${satoshi.style.fontFamily};
            --font-work-sans: ${workSans.style.fontFamily};
            --font-archivo-black: ${archivoBlack.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={workSans.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeWrapper>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default',
              }}
            >
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}
