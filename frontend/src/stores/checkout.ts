// Checkout store for managing checkout flow
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { api } from '@/lib/api';
import type { ShippingAddress, Order, OrderCreate } from '@/types';

type CheckoutStep = 'shipping' | 'review' | 'complete';

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  order: Order | null;
  isSubmitting: boolean;
  error: string | null;
  idempotencyKey: string;

  // Actions
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  submitOrder: (notes?: string) => Promise<Order>;
  resetCheckout: () => void;
  clearError: () => void;
  generateNewIdempotencyKey: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: 'shipping',
  shippingAddress: null,
  order: null,
  isSubmitting: false,
  error: null,
  idempotencyKey: uuidv4(),

  setStep: (step) => set({ step }),

  setShippingAddress: (address) => {
    set({ shippingAddress: address, step: 'review' });
  },

  submitOrder: async (notes?: string) => {
    const { shippingAddress, idempotencyKey } = get();

    if (!shippingAddress) {
      throw new Error('Shipping address is required');
    }

    set({ isSubmitting: true, error: null });

    try {
      const orderData: OrderCreate = {
        idempotency_key: idempotencyKey,
        shipping_address: shippingAddress,
        notes,
      };

      const response = await api.post<Order>('/orders', orderData);
      const order = response.data;

      set({
        order,
        step: 'complete',
        isSubmitting: false,
      });

      return order;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create order';
      set({ error: errorMessage, isSubmitting: false });
      throw new Error(errorMessage);
    }
  },

  resetCheckout: () => {
    set({
      step: 'shipping',
      shippingAddress: null,
      order: null,
      isSubmitting: false,
      error: null,
      idempotencyKey: uuidv4(),
    });
  },

  clearError: () => set({ error: null }),

  generateNewIdempotencyKey: () => {
    set({ idempotencyKey: uuidv4() });
  },
}));

// Hook for getting current checkout step
export const useCheckoutStep = () => {
  return useCheckoutStore((state) => state.step);
};

// Hook for checking if order is being submitted
export const useIsSubmitting = () => {
  return useCheckoutStore((state) => state.isSubmitting);
};
