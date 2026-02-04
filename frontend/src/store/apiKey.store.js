import { create } from 'zustand';
import { api } from '../lib/api';

export const useApiKeyStore = create((set, get) => ({
  hasToken: false,
  createdAt: null,
  updatedAt: null,
  lastValidatedAt: null,

  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // GET /api/keys/github
  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/keys/github', { method: 'GET' });

      set({
        hasToken: !!data.hasToken,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        lastValidatedAt: data.lastValidatedAt || null,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to fetch token status.',
      });
      throw e;
    }
  },

  // POST /api/keys/github  body: { token }
  setToken: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/keys/github', {
        method: 'POST',
        json: { token },
      });

      set({
        hasToken: true,
        lastValidatedAt: data.lastValidatedAt || null,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to save token.',
      });
      throw e;
    }
  },

  // DELETE /api/keys/github
  deleteToken: async () => {
    set({ isLoading: true, error: null });
    try {
      await api('/api/keys/github', { method: 'DELETE' });

      set({
        hasToken: false,
        createdAt: null,
        updatedAt: null,
        lastValidatedAt: null,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to delete token.',
      });
      throw e;
    }
  },
}));
