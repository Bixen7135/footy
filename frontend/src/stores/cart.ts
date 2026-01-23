// Cart store with optimistic updates
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { Cart, CartItem, CartItemCreate, CartItemUpdate } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Computed
  itemCount: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isUpdating: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<Cart>('/cart');
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch cart',
            isLoading: false,
          });
        }
      },

      addItem: async (productId: string, variantId: string, quantity = 1) => {
        const previousCart = get().cart;
        set({ isUpdating: true, error: null });

        // Optimistic update
        if (previousCart) {
          const existingItemIndex = previousCart.items.findIndex(
            (item) => item.variant_id === variantId
          );

          let optimisticCart: Cart;
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...previousCart.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              subtotal:
                updatedItems[existingItemIndex].unit_price *
                (updatedItems[existingItemIndex].quantity + quantity),
            };
            optimisticCart = {
              ...previousCart,
              items: updatedItems,
              item_count: previousCart.item_count + quantity,
              total: previousCart.total + updatedItems[existingItemIndex].unit_price * quantity,
            };
          } else {
            // New item - we don't have full data yet, so just update counts
            optimisticCart = {
              ...previousCart,
              item_count: previousCart.item_count + quantity,
            };
          }
          set({ cart: optimisticCart });
        }

        try {
          const payload: CartItemCreate = {
            product_id: productId,
            variant_id: variantId,
            quantity,
          };
          const response = await api.post<Cart>('/cart/items', payload);
          set({ cart: response.data, isUpdating: false });
        } catch (error: any) {
          // Rollback on error
          set({
            cart: previousCart,
            error: error.response?.data?.detail || 'Failed to add item to cart',
            isUpdating: false,
          });
          throw error;
        }
      },

      removeItem: async (variantId: string) => {
        const previousCart = get().cart;
        set({ isUpdating: true, error: null });

        // Optimistic update
        if (previousCart) {
          const itemToRemove = previousCart.items.find(
            (item) => item.variant_id === variantId
          );
          if (itemToRemove) {
            const optimisticCart: Cart = {
              ...previousCart,
              items: previousCart.items.filter((item) => item.variant_id !== variantId),
              item_count: previousCart.item_count - itemToRemove.quantity,
              total: previousCart.total - itemToRemove.subtotal,
            };
            set({ cart: optimisticCart });
          }
        }

        try {
          const response = await api.delete<Cart>(`/cart/items/${variantId}`);
          set({ cart: response.data, isUpdating: false });
        } catch (error: any) {
          // Rollback on error
          set({
            cart: previousCart,
            error: error.response?.data?.detail || 'Failed to remove item from cart',
            isUpdating: false,
          });
          throw error;
        }
      },

      updateQuantity: async (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeItem(variantId);
        }

        const previousCart = get().cart;
        set({ isUpdating: true, error: null });

        // Optimistic update
        if (previousCart) {
          const itemIndex = previousCart.items.findIndex(
            (item) => item.variant_id === variantId
          );
          if (itemIndex >= 0) {
            const item = previousCart.items[itemIndex];
            const quantityDiff = quantity - item.quantity;
            const updatedItems = [...previousCart.items];
            updatedItems[itemIndex] = {
              ...item,
              quantity,
              subtotal: item.unit_price * quantity,
            };
            const optimisticCart: Cart = {
              ...previousCart,
              items: updatedItems,
              item_count: previousCart.item_count + quantityDiff,
              total: previousCart.total + item.unit_price * quantityDiff,
            };
            set({ cart: optimisticCart });
          }
        }

        try {
          const payload: CartItemUpdate = { quantity };
          const response = await api.patch<Cart>(`/cart/items/${variantId}`, payload);
          set({ cart: response.data, isUpdating: false });
        } catch (error: any) {
          // Rollback on error
          set({
            cart: previousCart,
            error: error.response?.data?.detail || 'Failed to update item quantity',
            isUpdating: false,
          });
          throw error;
        }
      },

      clearCart: async () => {
        const previousCart = get().cart;
        set({ isUpdating: true, error: null });

        // Optimistic update
        set({
          cart: previousCart
            ? { ...previousCart, items: [], item_count: 0, total: 0 }
            : null,
        });

        try {
          await api.delete('/cart');
          set({ cart: null, isUpdating: false });
        } catch (error: any) {
          // Rollback on error
          set({
            cart: previousCart,
            error: error.response?.data?.detail || 'Failed to clear cart',
            isUpdating: false,
          });
          throw error;
        }
      },

      // Computed values
      itemCount: () => {
        return get().cart?.item_count || 0;
      },

      total: () => {
        return get().cart?.total || 0;
      },
    }),
    {
      name: 'footy-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Hook for cart item count (for header)
export const useCartItemCount = () => {
  return useCartStore((state) => state.cart?.item_count || 0);
};

// Hook for checking if item is in cart
export const useIsInCart = (variantId: string) => {
  return useCartStore((state) =>
    state.cart?.items.some((item) => item.variant_id === variantId) || false
  );
};
