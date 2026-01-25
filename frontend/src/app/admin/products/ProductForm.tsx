'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';

interface ProductFormProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface VariantInput {
  id?: string;
  size: string;
  sku: string;
  stock: number;
}

const GENDERS = ['men', 'women', 'unisex', 'kids'];

export default function ProductForm({ open, product, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    brand: '',
    material: '',
    color: '',
    gender: '',
    category_id: '',
    is_active: true,
    is_featured: false,
    images: [] as string[],
    meta_title: '',
    meta_description: '',
  });
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const response = await api.get('/admin/categories');
      return response.data;
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price.toString(),
        compare_at_price: product.compare_at_price?.toString() || '',
        brand: product.brand || '',
        material: product.material || '',
        color: product.color || '',
        gender: product.gender || '',
        category_id: product.category_id || '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        images: product.images,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
      });
      setVariants(
        product.variants.map((v) => ({
          id: v.id,
          size: v.size,
          sku: v.sku || '',
          stock: v.stock,
        }))
      );
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        compare_at_price: '',
        brand: '',
        material: '',
        color: '',
        gender: '',
        category_id: '',
        is_active: true,
        is_featured: false,
        images: [],
        meta_title: '',
        meta_description: '',
      });
      setVariants([{ size: '', sku: '', stock: 0 }]);
    }
    setError(null);
  }, [product, open]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData & { variants: VariantInput[] }) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        compare_at_price: data.compare_at_price ? parseFloat(data.compare_at_price) : null,
        category_id: data.category_id || null,
        gender: data.gender || null,
        variants: data.variants.map((v) => ({
          size: v.size,
          sku: v.sku || null,
          stock: v.stock,
        })),
      };
      const response = await api.post('/admin/products', payload);
      return response.data;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        compare_at_price: data.compare_at_price ? parseFloat(data.compare_at_price) : null,
        category_id: data.category_id || null,
        gender: data.gender || null,
      };
      const response = await api.patch(`/admin/products/${product?.id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to update product');
    },
  });

  const handleSubmit = async () => {
    setError(null);

    if (!formData.name || !formData.slug || !formData.price) {
      setError('Name, slug, and price are required');
      return;
    }

    if (product) {
      updateMutation.mutate(formData);
    } else {
      if (variants.length === 0 || !variants.some((v) => v.size)) {
        setError('At least one variant with a size is required');
        return;
      }
      createMutation.mutate({ ...formData, variants });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSwitchChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', sku: '', stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Slug"
              value={formData.slug}
              onChange={handleChange('slug')}
              required
              helperText="URL-friendly identifier"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pricing
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Compare at Price"
              type="number"
              value={formData.compare_at_price}
              onChange={handleChange('compare_at_price')}
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Original price for sale items"
            />
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Product Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              value={formData.brand}
              onChange={handleChange('brand')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Material"
              value={formData.material}
              onChange={handleChange('material')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              value={formData.color}
              onChange={handleChange('color')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={formData.gender}
              onChange={handleChange('gender')}
            >
              <MenuItem value="">None</MenuItem>
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category_id}
              onChange={handleChange('category_id')}
            >
              <MenuItem value="">None</MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Images
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="outlined" onClick={handleAddImage}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.images.map((img, i) => (
                <Chip
                  key={i}
                  label={img.substring(0, 30) + (img.length > 30 ? '...' : '')}
                  onDelete={() => handleRemoveImage(i)}
                />
              ))}
            </Box>
          </Grid>

          {/* Variants (only for new products) */}
          {!product && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Variants (Sizes)
                  </Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={handleAddVariant}>
                    Add Variant
                  </Button>
                </Box>
              </Grid>
              {variants.map((variant, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label="Size"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="SKU"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      size="small"
                      sx={{ width: 150 }}
                    />
                    <TextField
                      label="Stock"
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 100 }}
                      inputProps={{ min: 0 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveVariant(index)}
                      disabled={variants.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </>
          )}

          {/* Status */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleSwitchChange('is_active')}
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_featured}
                  onChange={handleSwitchChange('is_featured')}
                />
              }
              label="Featured"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
