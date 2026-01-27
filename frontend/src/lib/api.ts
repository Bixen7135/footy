// API client - base configuration
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { Token } from '@/types';
import { clearTokens } from '@/stores/auth';
import { convertMoneyFieldsToCents } from './money';

// Base URL strategy
// - If NEXT_PUBLIC_API_URL is provided, treat it as the backend origin and append /api/v1.
// - Otherwise default to same-origin /api/v1 so Next rewrites can proxy in dev.
const RAW_API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const API_BASE_URL = RAW_API_ORIGIN
  ? (RAW_API_ORIGIN.endsWith('/api/v1') ? RAW_API_ORIGIN : `${RAW_API_ORIGIN}/api/v1`)
  : '/api/v1';

// Token storage keys (same as auth store)
const ACCESS_TOKEN_KEY = 'footy_access_token';
const REFRESH_TOKEN_KEY = 'footy_refresh_token';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// Maximum number of requests to queue during refresh
const MAX_QUEUE_SIZE = 100;

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to convert money fields from dollars to cents
api.interceptors.response.use(
  (response) => {
    // Convert all money fields in response data from dollars (float) to cents (int)
    if (response.data) {
      response.data = convertMoneyFieldsToCents(response.data);
    }
    return response;
  },
  (error) => {
    // Let error pass through to next interceptor
    return Promise.reject(error);
  }
);

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Skip auth header for public endpoints
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isPublic = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublic && typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't retry if no config or already retried
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry auth endpoints
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    if (authEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      // Prevent memory leak - reject if queue is too large
      if (failedQueue.length >= MAX_QUEUE_SIZE) {
        return Promise.reject(new Error('Too many pending requests'));
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err: Error) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;

    if (!refreshToken) {
      isRefreshing = false;
      // Clear tokens and logout
      if (typeof window !== 'undefined') {
        clearTokens();
        // Import store dynamically to avoid circular dependency
        import('@/stores/auth').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
      }
      return Promise.reject(error);
    }

    try {
      const response = await api.post<Token>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data;

      // Store new tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      }

      // Update header and retry original request
      originalRequest.headers.Authorization = `Bearer ${access_token}`;

      // Process queued requests
      processQueue(null, access_token);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear tokens and logout
      if (typeof window !== 'undefined') {
        clearTokens();
        // Import store dynamically to avoid circular dependency
        import('@/stores/auth').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
      }
      processQueue(new Error('Token refresh failed'));
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  }
);

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
