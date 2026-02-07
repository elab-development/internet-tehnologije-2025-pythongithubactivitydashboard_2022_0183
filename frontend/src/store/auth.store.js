import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  isAdmin: () => {
    const user = get().user;
    return user?.role === 'admin';
  },

  hydrate: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/auth/me', { method: 'GET' });
      set({
        user: data.user || null,
        isAuthenticated: !!data.user,
        isLoading: false,
      });
    } catch (e) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: e?.message || 'Failed to load session.',
      });
    }
  },

  register: async ({ username, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/auth/register', {
        method: 'POST',
        json: { username, email, password },
      });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Registration failed.',
      });
      throw e;
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        json: { email, password },
      });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Login failed.',
      });
      throw e;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api('/api/auth/logout', { method: 'POST' });
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Logout failed.',
      });
      throw e;
    }
  },
}));
