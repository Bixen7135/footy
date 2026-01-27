// Auth store for user authentication
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User, UserCreate, LoginRequest, Token, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'footy_access_token';
const REFRESH_TOKEN_KEY = 'footy_refresh_token';

// Get tokens from localStorage
const getStoredTokens = (): Token | null => {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (accessToken && refreshToken) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
    };
  }
  return null;
};

// Store tokens in localStorage
const storeTokens = (tokens: Token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
};

// Clear tokens from localStorage
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const { user, tokens } = response.data;

          storeTokens(tokens);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData: UserCreate) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<AuthResponse>('/auth/register', userData);
          const { user, tokens } = response.data;

          storeTokens(tokens);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchCurrentUser: async () => {
        const tokens = getStoredTokens();
        if (!tokens) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await api.get<User>('/auth/me');

          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token invalid or expired - let API interceptor handle refresh
          // If refresh fails, interceptor will call logout()
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'footy-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for checking if user is authenticated
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

// Hook for getting current user
export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

// Hook for checking if user is admin
export const useIsAdmin = () => {
  return useAuthStore((state) => state.user?.role === 'admin');
};

// Initialize auth on app load
export const initializeAuth = async () => {
  const tokens = getStoredTokens();
  if (tokens) {
    const store = useAuthStore.getState();
    await store.fetchCurrentUser();
  }
};

// Get access token for API calls
export const getAccessToken = (): string | null => {
  const tokens = getStoredTokens();
  return tokens?.access_token || null;
};
