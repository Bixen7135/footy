// React hooks for analytics
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, trackEvent, flushEvents } from '@/lib/analytics';

/**
 * Track page views automatically on route changes
 */
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on route change
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackEvent('page_view', { url });
  }, [pathname, searchParams]);
}

/**
 * Hook for tracking checkout dropoff
 * Detects when user leaves checkout without completing purchase
 */
export function useCheckoutDropoff(
  isInCheckout: boolean,
  currentStep: string,
  hasCompletedPurchase: boolean
) {
  const stepRef = useRef(currentStep);
  const hasCompletedRef = useRef(hasCompletedPurchase);

  // Update refs
  useEffect(() => {
    stepRef.current = currentStep;
    hasCompletedRef.current = hasCompletedPurchase;
  }, [currentStep, hasCompletedPurchase]);

  useEffect(() => {
    if (!isInCheckout) return;

    const handleBeforeUnload = () => {
      if (!hasCompletedRef.current) {
        analytics.checkoutDropoff(stepRef.current, 'page_unload');
        flushEvents();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasCompletedRef.current) {
        analytics.checkoutDropoff(stepRef.current, 'tab_hidden');
        flushEvents();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Track dropoff on unmount (navigating away) if not completed
      if (!hasCompletedRef.current) {
        analytics.checkoutDropoff(stepRef.current, 'navigation');
        flushEvents();
      }
    };
  }, [isInCheckout]);
}

/**
 * Hook for tracking product impressions (when products come into view)
 */
export function useProductImpression(
  productId: string,
  productSlug: string,
  price: number
) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      analytics.viewItem(productId, productSlug, price);
    }
  }, [productId, productSlug, price]);
}

/**
 * Hook for tracking search queries
 */
export function useSearchTracking() {
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    if (query.trim()) {
      analytics.search(query, resultsCount);
    }
  }, []);

  return trackSearch;
}

/**
 * Hook for cart event tracking
 */
export function useCartTracking() {
  const trackAddToCart = useCallback(
    (productId: string, variantId: string, quantity: number, price: number) => {
      analytics.addToCart(productId, variantId, quantity, price);
    },
    []
  );

  const trackRemoveFromCart = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      analytics.removeFromCart(productId, variantId, quantity);
    },
    []
  );

  const trackViewCart = useCallback((itemCount: number, total: number) => {
    analytics.viewCart(itemCount, total);
  }, []);

  return {
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
  };
}

/**
 * Hook for checkout event tracking
 */
export function useCheckoutTracking() {
  const trackBeginCheckout = useCallback((itemCount: number, total: number) => {
    analytics.beginCheckout(itemCount, total);
  }, []);

  const trackCheckoutStep = useCallback((step: string, stepNumber: number) => {
    analytics.checkoutStep(step, stepNumber);
  }, []);

  const trackPurchase = useCallback(
    (orderId: string, orderNumber: string, total: number, itemCount: number) => {
      analytics.purchase(orderId, orderNumber, total, itemCount);
    },
    []
  );

  return {
    trackBeginCheckout,
    trackCheckoutStep,
    trackPurchase,
  };
}

// Re-export analytics for direct use
export { analytics, trackEvent, flushEvents };
