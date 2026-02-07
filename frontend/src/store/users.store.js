import { create } from 'zustand';
import { api } from '../lib/api';

export const useUsersStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/users', { method: 'GET' });

      set({
        users: Array.isArray(data.users) ? data.users : [],
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to fetch users.',
      });
      throw e;
    }
  },

  reset: () =>
    set({
      users: [],
      isLoading: false,
      error: null,
    }),
}));
