'use client';

import { Box } from '@mui/material';

// Custom SVG Icons
const Grid2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="18" />
    <rect x="14" y="3" width="7" height="18" />
  </svg>
);

const Grid3Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="5" height="18" />
    <rect x="10" y="3" width="4" height="18" />
    <rect x="16" y="3" width="5" height="18" />
  </svg>
);

const Grid4Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round" />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round" />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

interface ViewModeToggleProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
}

const VIEW_MODES = [
  { value: 'grid2', label: '2 Columns', icon: Grid2Icon },
  { value: 'grid3', label: '3 Columns', icon: Grid3Icon },
  { value: 'grid4', label: '4 Columns', icon: Grid4Icon },
  { value: 'list', label: 'List View', icon: ListIcon },
];

export function ViewModeToggle({ value, onChange, size = 'small' }: ViewModeToggleProps) {
  const buttonSize = size === 'small' ? 40 : 48;
  const gap = size === 'small' ? 0.75 : 1;

  return (
    <Box sx={{ display: 'flex', gap }}>
      {VIEW_MODES.map((mode) => {
        const Icon = mode.icon;
        const isSelected = value === mode.value;

        return (
          <Box
            key={mode.value}
            component="button"
            onClick={() => onChange(mode.value)}
            aria-label={mode.label}
            title={mode.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: buttonSize,
              height: buttonSize,
              bgcolor: isSelected ? 'secondary.main' : 'transparent',
              color: isSelected ? 'secondary.contrastText' : 'text.primary',
              border: '2px solid',
              borderColor: isSelected ? 'secondary.main' : 'divider',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-2px)',
                ...(! isSelected && {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(158, 255, 0, 0.08)'
                      : 'rgba(158, 255, 0, 0.12)',
                }),
              },
            }}
          >
            <Icon />
          </Box>
        );
      })}
    </Box>
  );
}
