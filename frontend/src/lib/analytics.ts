// Analytics and event tracking system
import { v4 as uuidv4 } from 'uuid';
import { api } from './api';
import type { ClickstreamEvent, EventName, TrafficSource } from '@/types';

// Configuration
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds
const SESSION_ID_KEY = 'footy_analytics_session';

// Event queue
let eventQueue: ClickstreamEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Detect traffic source
export function getTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') return 'DESKTOP';

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword))
    ? 'MOBILE'
    : 'DESKTOP';
}

// Get current page URL
function getCurrentPage(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + window.location.search;
}

// Get referrer
function getReferrer(): string {
  if (typeof document === 'undefined') return '';
  return document.referrer;
}

// Create event object
export function createEvent(
  eventName: EventName | string,
  metadata?: Record<string, unknown>
): ClickstreamEvent {
  return {
    event_id: uuidv4(),
    event_name: eventName,
    session_id: getSessionId(),
    event_time: new Date().toISOString(),
    traffic_source: getTrafficSource(),
    page: getCurrentPage(),
    referrer: getReferrer(),
    event_metadata: metadata,
  };
}

// Send batch of events to backend
async function sendBatch(events: ClickstreamEvent[]): Promise<void> {
  if (events.length === 0) return;

  try {
    await api.post('/events/batch', { events });
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.warn('Failed to send analytics events:', error);
  }
}

// Flush event queue
export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  await sendBatch(eventsToSend);
}

// Schedule flush
function scheduleFlush(): void {
  if (flushTimer) return;

  flushTimer = setTimeout(async () => {
    flushTimer = null;
    await flushEvents();
  }, FLUSH_INTERVAL);
}

// Track event
export function trackEvent(
  eventName: EventName | string,
  metadata?: Record<string, unknown>
): void {
  const event = createEvent(eventName, metadata);
  eventQueue.push(event);

  // Flush immediately if batch is full
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

// Track page view
export function trackPageView(pageName?: string): void {
  trackEvent('page_view', {
    page_name: pageName || getCurrentPage(),
  });
}

// Specific event trackers
export const analytics = {
  // Homepage
  viewHomepage: () => trackEvent('view_homepage'),

  // Category/Catalog
  viewCategory: (categoryId?: string, categorySlug?: string) =>
    trackEvent('view_category', { category_id: categoryId, category_slug: categorySlug }),

  // Search
  search: (query: string, resultsCount: number) =>
    trackEvent('search_query', { query, results_count: resultsCount }),

  // Product
  viewItem: (productId: string, productSlug: string, price: number) =>
    trackEvent('view_item', { product_id: productId, product_slug: productSlug, price }),

  // Cart
  addToCart: (productId: string, variantId: string, quantity: number, price: number) =>
    trackEvent('add_to_cart', { product_id: productId, variant_id: variantId, quantity, price }),

  removeFromCart: (productId: string, variantId: string, quantity: number) =>
    trackEvent('remove_from_cart', { product_id: productId, variant_id: variantId, quantity }),

  viewCart: (itemCount: number, total: number) =>
    trackEvent('view_cart', { item_count: itemCount, total }),

  // Checkout
  beginCheckout: (itemCount: number, total: number) =>
    trackEvent('begin_checkout', { item_count: itemCount, total }),

  checkoutStep: (step: string, stepNumber: number) =>
    trackEvent('checkout_step', { step, step_number: stepNumber }),

  // Purchase
  purchase: (orderId: string, orderNumber: string, total: number, itemCount: number) =>
    trackEvent('purchase', {
      order_id: orderId,
      order_number: orderNumber,
      total,
      item_count: itemCount,
    }),

  // Checkout dropoff
  checkoutDropoff: (step: string, reason?: string) =>
    trackEvent('checkout_dropoff', { step, reason }),

  // Wishlist
  addToWishlist: (productId: string) =>
    trackEvent('add_to_wishlist', { product_id: productId }),

  removeFromWishlist: (productId: string) =>
    trackEvent('remove_from_wishlist', { product_id: productId }),

  // Auth
  signUp: () => trackEvent('sign_up'),
  signIn: () => trackEvent('sign_in'),
  signOut: () => trackEvent('sign_out'),
};

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    // Use sendBeacon for reliable delivery on unload
    if (eventQueue.length > 0 && navigator.sendBeacon) {
      const blob = new Blob(
        [JSON.stringify({ events: eventQueue })],
        { type: 'application/json' }
      );
      navigator.sendBeacon('/api/v1/events/batch', blob);
    }
  });

  // Also flush on visibility change (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushEvents();
    }
  });
}
