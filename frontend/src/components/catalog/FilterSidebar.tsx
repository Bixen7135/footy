'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { FilterSidebarSkeleton } from '../ui/Skeleton';
import type { Category, ProductFilters } from '@/types';

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

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      ...filters,
      min_price: priceRange[0] > PRICE_RANGE[0] ? priceRange[0] : undefined,
      max_price: priceRange[1] < PRICE_RANGE[1] ? priceRange[1] : undefined,
    });
  };

  const handleInStockToggle = () => {
    onFilterChange({
      ...filters,
      in_stock: filters.in_stock ? undefined : true,
    });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search: search || undefined,
    });
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
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <ClearIcon
                  fontSize="small"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSearchChange('')}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          sx={{ mb: 3 }}
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <List disablePadding>
            {categories.map((category) => (
              <ListItemButton
                key={category.id}
                selected={filters.category_slug === category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                sx={{ borderRadius: 1, py: 0.75 }}
              >
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Price Range */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceCommit}
              valueLabelDisplay="auto"
              min={PRICE_RANGE[0]}
              max={PRICE_RANGE[1]}
              valueLabelFormat={(value) => `$${value}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ${priceRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Sizes */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Sizes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SIZES.map((size) => (
              <Chip
                key={size}
                label={size}
                variant={filters.sizes?.includes(size) ? 'filled' : 'outlined'}
                color={filters.sizes?.includes(size) ? 'primary' : 'default'}
                onClick={() => handleSizeToggle(size)}
                sx={{ minWidth: 44 }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Gender */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Gender
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <FormGroup>
            {GENDERS.map((gender) => (
              <FormControlLabel
                key={gender.value}
                control={
                  <Checkbox
                    checked={filters.gender === gender.value}
                    onChange={() => handleGenderToggle(gender.value)}
                    size="small"
                  />
                }
                label={gender.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Availability */}
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.in_stock || false}
              onChange={handleInStockToggle}
            />
          }
          label={
            <Typography variant="body2" fontWeight={500}>
              In Stock Only
            </Typography>
          }
        />
      </Box>
    </Box>
  );
}
