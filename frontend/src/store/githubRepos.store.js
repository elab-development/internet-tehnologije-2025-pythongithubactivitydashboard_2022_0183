import { create } from 'zustand';
import { api } from '../lib/api';

export const useGithubReposStore = create((set) => ({
  repos: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // GET /api/github/repos
  fetchGithubRepos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/github/repos', { method: 'GET' });
      set({
        repos: Array.isArray(data.repos) ? data.repos : [],
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to fetch GitHub repos.',
      });
      throw e;
    }
  },

  reset: () => set({ repos: [], isLoading: false, error: null }),
}));
