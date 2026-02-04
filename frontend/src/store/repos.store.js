import { create } from 'zustand';
import { api } from '../lib/api';

export const useReposStore = create((set, get) => ({
  repos: [],
  syncByRepoId: {},

  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // GET /api/repos
  fetchSavedRepos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/repos', { method: 'GET' });
      set({
        repos: Array.isArray(data.repos) ? data.repos : [],
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to fetch saved repos.',
      });
      throw e;
    }
  },

  // POST /api/repos  body: { githubId }
  addRepo: async (githubId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api('/api/repos', {
        method: 'POST',
        json: { githubId },
      });

      const newRepo = data.repo;

      set({
        repos: newRepo ? [newRepo, ...get().repos] : get().repos,
        isLoading: false,
      });

      return newRepo;
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to save repo.',
      });
      throw e;
    }
  },

  // DELETE /api/repos/:repoId
  deleteRepo: async (repoId) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/api/repos/${repoId}`, { method: 'DELETE' });

      set({
        repos: get().repos.filter((r) => r.id !== repoId),
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to delete repo.',
      });
      throw e;
    }
  },

  // POST /api/repos/:repoId/sync?prune=0&commitLimit=50&issueLimit=50&prLimit=50
  syncRepo: async (repoId, options = {}) => {
    // options: { prune, commitLimit, issueLimit, prLimit }
    const prune = options.prune ? 1 : 0;

    const commitLimit =
      typeof options.commitLimit === 'number' ? options.commitLimit : 50;
    const issueLimit =
      typeof options.issueLimit === 'number' ? options.issueLimit : 50;
    const prLimit = typeof options.prLimit === 'number' ? options.prLimit : 50;

    const qs = new URLSearchParams({
      prune: String(prune),
      commitLimit: String(commitLimit),
      issueLimit: String(issueLimit),
      prLimit: String(prLimit),
    }).toString();

    set((state) => ({
      syncByRepoId: {
        ...state.syncByRepoId,
        [repoId]: { isSyncing: true, error: null, result: null },
      },
      error: null,
    }));

    try {
      const data = await api(`/api/repos/${repoId}/sync?${qs}`, {
        method: 'POST',
      });

      set((state) => ({
        syncByRepoId: {
          ...state.syncByRepoId,
          [repoId]: { isSyncing: false, error: null, result: data },
        },
      }));

      return data;
    } catch (e) {
      set((state) => ({
        syncByRepoId: {
          ...state.syncByRepoId,
          [repoId]: {
            isSyncing: false,
            error: e?.message || 'Sync failed.',
            result: null,
          },
        },
        error: e?.message || 'Sync failed.',
      }));
      throw e;
    }
  },

  // helpers
  getSyncStatus: (repoId) => {
    return (
      get().syncByRepoId[repoId] || {
        isSyncing: false,
        error: null,
        result: null,
      }
    );
  },

  reset: () =>
    set({
      repos: [],
      syncByRepoId: {},
      isLoading: false,
      error: null,
    }),
}));
