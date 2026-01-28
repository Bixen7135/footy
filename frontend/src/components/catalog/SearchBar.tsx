'use client';

import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value = '', onChange, placeholder = 'Search products...' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', md: 280 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 14,
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          pointerEvents: 'none',
        }}
      >
        <SearchIcon />
      </Box>
      <Box
        component="input"
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        sx={{
          width: '100%',
          height: 40,
          pl: 5,
          pr: localValue ? 5 : 2,
          py: 1.5,
          bgcolor: 'transparent',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: '10px',
          color: 'text.primary',
          fontSize: '0.9rem',
          fontWeight: 500,
          outline: 'none',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          '&::placeholder': {
            color: 'text.secondary',
            opacity: 0.6,
          },
          '&:focus': {
            borderColor: 'secondary.main',
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(158, 255, 0, 0.04)'
                : 'rgba(158, 255, 0, 0.08)',
          },
          '&:hover': {
            borderColor: 'secondary.main',
          },
        }}
      />
      {localValue && (
        <Box
          component="button"
          onClick={handleClear}
          aria-label="Clear search"
          sx={{
            position: 'absolute',
            right: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            bgcolor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            color: 'text.secondary',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              color: 'text.primary',
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </Box>
      )}
    </Box>
  );
}
