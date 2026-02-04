import { create } from 'zustand';
import { api } from '../lib/api';

function buildQuery(params) {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    qs.set(k, s);
  });

  const out = qs.toString();
  return out ? `?${out}` : '';
}

export const useActivitiesStore = create((set, get) => ({
  repoId: null,

  items: [],
  total: 0,
  page: 1,
  pageSize: 25,

  filters: {
    type: '',
    actor: '',
    q: '',
    from: '',
    to: '',
  },

  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  setRepo: (repoId) => set({ repoId }),

  setPage: (page) => set({ page: Math.max(1, Number(page) || 1) }),
  setPageSize: (pageSize) =>
    set({ pageSize: Math.min(Math.max(Number(pageSize) || 25, 1), 100) }),
  setFilters: (partial, { resetPage = true } = {}) => {
    set((state) => ({
      filters: { ...state.filters, ...(partial || {}) },
      page: resetPage ? 1 : state.page,
    }));
  },

  fetchActivities: async (override = {}) => {
    const state = get();
    const repoId = override.repoId ?? state.repoId;
    if (!repoId) {
      set({ error: 'repoId is required to fetch activities.' });
      return;
    }

    const page = override.page ?? state.page;
    const pageSize = override.pageSize ?? state.pageSize;

    const filters = { ...state.filters, ...(override.filters || {}) };

    const query = buildQuery({
      type: filters.type,
      actor: filters.actor,
      q: filters.q,
      from: filters.from,
      to: filters.to,
      page,
      pageSize,
    });

    set({ isLoading: true, error: null });

    try {
      const data = await api(`/api/repos/${repoId}/activities${query}`, {
        method: 'GET',
      });

      set({
        repoId: data.repoId ?? repoId,
        items: Array.isArray(data.items) ? data.items : [],
        total: Number(data.total) || 0,
        page: Number(data.page) || page,
        pageSize: Number(data.pageSize) || pageSize,
        isLoading: false,
      });

      return data;
    } catch (e) {
      set({
        isLoading: false,
        error: e?.message || 'Failed to fetch activities.',
      });
      throw e;
    }
  },

  reset: () =>
    set({
      repoId: null,
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
      filters: { type: '', actor: '', q: '', from: '', to: '' },
      isLoading: false,
      error: null,
    }),
}));
