'use client';

import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const SortIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="7" y1="12" x2="21" y2="12" />
    <line x1="12" y1="18" x2="21" y2="18" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function SortDropdown({ value, onChange, size = 'small' }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const py = size === 'small' ? 1.5 : 2;
  const fontSize = size === 'small' ? '0.9rem' : '1rem';

  return (
    <Box sx={{ position: 'relative', minWidth: 180 }} ref={dropdownRef}>
      {/* Trigger button */}
      <Box
        component="button"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 2,
          py,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: isOpen ? 'secondary.main' : 'divider',
          borderRadius: '14px',
          color: 'text.primary',
          fontSize,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            borderColor: 'secondary.main',
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(158, 255, 0, 0.04)'
                : 'rgba(158, 255, 0, 0.08)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <SortIcon />
          <Box component="span" sx={{ color: 'text.primary' }}>
            {selectedOption.label}
          </Box>
        </Box>
        <Box sx={{ color: isOpen ? 'secondary.main' : 'text.secondary' }}>
          <ChevronIcon isOpen={isOpen} />
        </Box>
      </Box>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'divider',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: (theme) =>
                  theme.palette.mode === 'light'
                    ? '0 12px 32px rgba(0, 0, 0, 0.12)'
                    : '0 12px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              {SORT_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Box
                    key={option.value}
                    component="button"
                    onClick={() => handleSelect(option.value)}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2.5,
                      py: 1.75,
                      bgcolor: isSelected
                        ? (theme) =>
                            theme.palette.mode === 'light'
                              ? 'rgba(158, 255, 0, 0.12)'
                              : 'rgba(158, 255, 0, 0.15)'
                        : 'transparent',
                      border: 'none',
                      color: 'text.primary',
                      fontSize,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.08)'
                            : 'rgba(158, 255, 0, 0.1)',
                      },
                    }}
                  >
                    {option.label}
                    {isSelected && (
                      <Box sx={{ color: 'secondary.main' }}>
                        <CheckIcon />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
