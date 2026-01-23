// TanStack Query hooks for API calls
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type {
  Product,
  ProductListResponse,
  ProductFilters,
  Category,
  PaginationParams,
} from '@/types';

// Query keys
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters & PaginationParams) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    slug: (slug: string) => [...queryKeys.products.all, 'slug', slug] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.categories.all, 'slug', slug] as const,
  },
};

// Product hooks
export function useProducts(
  filters?: ProductFilters,
  pagination?: PaginationParams
) {
  const params = new URLSearchParams();

  if (pagination?.page) params.append('page', pagination.page.toString());
  if (pagination?.page_size) params.append('page_size', pagination.page_size.toString());

  if (filters) {
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.category_slug) params.append('category_slug', filters.category_slug);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.color) params.append('color', filters.color);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
    if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
    if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString());
    if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
    if (filters.search) params.append('search', filters.search);
  }

  return useQuery({
    queryKey: queryKeys.products.list({ ...filters, ...pagination }),
    queryFn: async () => {
      const response = await api.get<ProductListResponse>(`/products?${params.toString()}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.slug(slug),
    queryFn: async () => {
      const response = await api.get<Product>(`/products/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: async () => {
      const response = await api.get<Product[]>(`/products/featured?limit=${limit}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Category hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes (categories change less often)
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.slug(slug),
    queryFn: async () => {
      const response = await api.get<Category>(`/categories/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
  });
}
