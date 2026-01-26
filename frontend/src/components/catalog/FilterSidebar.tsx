'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSidebarSkeleton } from '../ui/Skeleton';
import type { Category, ProductFilters } from '@/types';

// Custom SVG Icons
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

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="18"
    height="18"
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface FilterSidebarProps {
  categories?: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const GENDERS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
];

const PRICE_RANGE = [0, 300];

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Accordion({ title, defaultOpen = true, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        component="button"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 0,
          bgcolor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            color: 'secondary.main',
          },
        }}
      >
        <Box
          sx={{
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'inherit',
            fontFamily: 'var(--font-satoshi)',
          }}
        >
          {title}
        </Box>
        <Box sx={{ color: isOpen ? 'secondary.main' : 'text.secondary' }}>
          <ChevronIcon isOpen={isOpen} />
        </Box>
      </Box>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ pb: 2 }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export function FilterSidebar({
  categories = [],
  filters,
  onFilterChange,
  onClearFilters,
  isLoading = false,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.min_price || PRICE_RANGE[0],
    filters.max_price || PRICE_RANGE[1],
  ]);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isDragging, setIsDragging] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Effect to update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({
        ...filters,
        search: debouncedSearch || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync local state with external filter changes
  useEffect(() => {
    if (filters.search !== searchInput && filters.search !== debouncedSearch) {
      setSearchInput(filters.search || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  if (isLoading) {
    return <FilterSidebarSkeleton />;
  }

  const handleCategoryClick = (slug: string) => {
    onFilterChange({
      ...filters,
      category_slug: filters.category_slug === slug ? undefined : slug,
    });
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];

    onFilterChange({
      ...filters,
      sizes: newSizes.length > 0 ? newSizes : undefined,
    });
  };

  const handleGenderToggle = (gender: string) => {
    onFilterChange({
      ...filters,
      gender: filters.gender === gender ? undefined : gender,
    });
  };

  const handlePriceMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePriceFromMouse(e);
  };

  const handlePriceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePriceFromMouse(e);
  };

  const handlePriceMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onFilterChange({
        ...filters,
        min_price: priceRange[0] > PRICE_RANGE[0] ? priceRange[0] : undefined,
        max_price: priceRange[1] < PRICE_RANGE[1] ? priceRange[1] : undefined,
      });
    }
  };

  const updatePriceFromMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = Math.round(PRICE_RANGE[0] + percentage * (PRICE_RANGE[1] - PRICE_RANGE[0]));

    // For simplicity, update max price on drag
    setPriceRange([priceRange[0], value]);
  };

  const handleInStockToggle = () => {
    onFilterChange({
      ...filters,
      in_stock: filters.in_stock ? undefined : true,
    });
  };

  const handleSearchChange = (search: string) => {
    setSearchInput(search);
  };

  const handleSearchClear = () => {
    setSearchInput('');
  };

  const hasActiveFilters = Boolean(
    filters.category_slug ||
    filters.sizes?.length ||
    filters.gender ||
    filters.min_price ||
    filters.max_price ||
    filters.in_stock ||
    filters.search
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.75,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: '14px',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            '&:focus-within': {
              borderColor: 'secondary.main',
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(158, 255, 0, 0.04)'
                  : 'rgba(158, 255, 0, 0.08)',
            },
          }}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </Box>
          <Box
            component="input"
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'text.primary',
              fontFamily: 'inherit',
              '&::placeholder': {
                color: 'text.disabled',
              },
            }}
          />
          {searchInput && (
            <Box
              component="button"
              onClick={handleSearchClear}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                bgcolor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'error.main',
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <CloseIcon />
            </Box>
          )}
        </Box>
      </Box>

      {/* Clear filters button */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component="button"
              onClick={onClearFilters}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                px: 3,
                py: 2,
                mb: 4,
                bgcolor: 'transparent',
                border: '2px solid',
                borderColor: 'divider',
                borderRadius: '14px',
                color: 'text.primary',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                '&:hover': {
                  borderColor: 'secondary.main',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(158, 255, 0, 0.08)'
                      : 'rgba(158, 255, 0, 0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CloseIcon />
              Clear All Filters
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
        {/* Categories */}
        <Accordion title="Categories">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {categories.map((category) => {
              const isSelected = filters.category_slug === category.slug;
              return (
                <Box
                  key={category.id}
                  component="button"
                  onClick={() => handleCategoryClick(category.slug)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    bgcolor: isSelected
                      ? (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.12)'
                            : 'rgba(158, 255, 0, 0.15)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'text.primary',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    textAlign: 'left',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(158, 255, 0, 0.08)'
                          : 'rgba(158, 255, 0, 0.1)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {category.name}
                  {isSelected && (
                    <Box sx={{ color: 'secondary.main' }}>
                      <CheckIcon />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Accordion>

        <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />

        {/* Price Range */}
        <Accordion title="Price Range">
          <Box sx={{ px: 1 }}>
            <Box
              sx={{
                position: 'relative',
                height: 6,
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                cursor: 'pointer',
                mb: 3,
              }}
              onMouseDown={handlePriceMouseDown}
              onMouseMove={handlePriceMouseMove}
              onMouseUp={handlePriceMouseUp}
              onMouseLeave={handlePriceMouseUp}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: `${100 - ((priceRange[1] - PRICE_RANGE[0]) / (PRICE_RANGE[1] - PRICE_RANGE[0])) * 100}%`,
                  height: '100%',
                  bgcolor: 'secondary.main',
                  borderRadius: '3px',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: `${100 - ((priceRange[1] - PRICE_RANGE[0]) / (PRICE_RANGE[1] - PRICE_RANGE[0])) * 100}%`,
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  width: 20,
                  height: 20,
                  bgcolor: 'secondary.main',
                  borderRadius: '50%',
                  border: '3px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'text.primary' }}>
                ${priceRange[0]}
              </Box>
              <Box sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'text.primary' }}>
                ${priceRange[1]}
              </Box>
            </Box>
          </Box>
        </Accordion>

        <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />

        {/* Sizes */}
        <Accordion title="Sizes">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SIZES.map((size) => {
              const isSelected = filters.sizes?.includes(size);
              return (
                <Box
                  key={size}
                  component="button"
                  onClick={() => handleSizeToggle(size)}
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    bgcolor: isSelected ? 'secondary.main' : 'transparent',
                    color: isSelected ? 'secondary.contrastText' : 'text.primary',
                    border: '2px solid',
                    borderColor: isSelected ? 'secondary.main' : 'divider',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: 'secondary.main',
                      ...(! isSelected && {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(158, 255, 0, 0.08)'
                            : 'rgba(158, 255, 0, 0.12)',
                      }),
                    },
                  }}
                >
                  {size}
                </Box>
              );
            })}
          </Box>
        </Accordion>

        <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />

        {/* Gender */}
        <Accordion title="Gender">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {GENDERS.map((gender) => {
              const isSelected = filters.gender === gender.value;
              return (
                <Box
                  key={gender.value}
                  component="button"
                  onClick={() => handleGenderToggle(gender.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    bgcolor: 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(158, 255, 0, 0.08)'
                          : 'rgba(158, 255, 0, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isSelected ? 'secondary.main' : 'transparent',
                      border: '2px solid',
                      borderColor: isSelected ? 'secondary.main' : 'divider',
                      borderRadius: '6px',
                      color: isSelected ? 'secondary.contrastText' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {isSelected && <CheckIcon />}
                  </Box>
                  <Box
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: 'text.primary',
                    }}
                  >
                    {gender.label}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Accordion>

        <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />

        {/* Availability */}
        <Accordion title="Availability">
          <Box
            component="button"
            onClick={handleInStockToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              bgcolor: 'transparent',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(158, 255, 0, 0.08)'
                    : 'rgba(158, 255, 0, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: filters.in_stock ? 'secondary.main' : 'transparent',
                border: '2px solid',
                borderColor: filters.in_stock ? 'secondary.main' : 'divider',
                borderRadius: '6px',
                color: filters.in_stock ? 'secondary.contrastText' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {filters.in_stock && <CheckIcon />}
            </Box>
            <Box
              sx={{
                fontSize: '0.9rem',
                fontWeight: filters.in_stock ? 700 : 500,
                color: 'text.primary',
              }}
            >
              In Stock Only
            </Box>
          </Box>
        </Accordion>
      </Box>
    </Box>
  );
}
