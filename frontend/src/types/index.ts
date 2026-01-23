// Type definitions matching backend Pydantic schemas

// Base types
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

// User types
export type UserRole = 'user' | 'admin';

export interface User extends Timestamps {
  id: string;
  email: string;
  name: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  role: UserRole;
}

export interface UserCreate {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: Token;
}

export interface RefreshRequest {
  refresh_token: string;
}

// Category types
export interface Category extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Product types
export interface ProductVariant extends Timestamps {
  id: string;
  product_id: string;
  size: string;
  sku?: string;
  stock: number;
}

export interface Product extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  brand?: string;
  material?: string;
  color?: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  is_active: boolean;
  is_featured: boolean;
  category_id?: string;
  category?: Category;
  meta_title?: string;
  meta_description?: string;
  variants: ProductVariant[];
  in_stock: boolean;
  available_sizes: string[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ProductFilters {
  category_id?: string;
  category_slug?: string;
  brand?: string;
  color?: string;
  gender?: string;
  min_price?: number;
  max_price?: number;
  sizes?: string[];
  in_stock?: boolean;
  is_featured?: boolean;
  search?: string;
}

// Cart types
export interface CartItem extends Timestamps {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: Product;
  variant: ProductVariant;
}

export interface Cart extends Timestamps {
  id: string;
  session_id?: string;
  user_id?: string;
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface CartItemCreate {
  product_id: string;
  variant_id: string;
  quantity?: number;
}

export interface CartItemUpdate {
  quantity: number;
}

// Order types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface OrderItem extends Timestamps {
  id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  product_image?: string;
  size: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order extends Timestamps {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  notes?: string;
  items: OrderItem[];
}

export interface OrderCreate {
  idempotency_key: string;
  shipping_address: ShippingAddress;
  notes?: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// Event types for clickstream
export type TrafficSource = 'MOBILE' | 'DESKTOP';

export interface ClickstreamEvent {
  event_id: string;
  event_name: string;
  session_id: string;
  event_time: string;
  traffic_source: TrafficSource;
  page?: string;
  referrer?: string;
  event_metadata?: Record<string, unknown>;
}

export interface EventBatchCreate {
  events: ClickstreamEvent[];
}

export interface EventBatchResponse {
  created: number;
  duplicates: number;
  errors: number;
}

// Wishlist types
export interface WishlistItem extends Timestamps {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
}

export interface Wishlist {
  items: WishlistItem[];
  total: number;
}

// API response types
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// Event names for type safety
export type EventName =
  | 'view_homepage'
  | 'view_category'
  | 'search_query'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'checkout_step'
  | 'purchase'
  | 'checkout_dropoff';
