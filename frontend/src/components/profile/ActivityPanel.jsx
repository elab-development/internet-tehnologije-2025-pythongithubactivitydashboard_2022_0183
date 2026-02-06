import { useEffect, useMemo, useState } from 'react';

import { useReposStore } from '../../store/repos.store';
import { useActivitiesStore } from '../../store/activities.store';

import ActivitiesHeader from './activities/ActivitiesHeader';
import ActivitiesFilters from './activities/ActivitiesFilters';
import ActivitiesTimeline from './activities/ActivitiesTimeline';

export default function ActivityPanel() {
  const { repos, fetchSavedRepos, syncRepo, getSyncStatus } = useReposStore();

  const {
    repoId,
    items,
    total,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    setRepo,
    setFilters,
    setPage,
    fetchActivities,
  } = useActivitiesStore();

  const [sort, setSort] = useState('desc');

  useEffect(() => {
    fetchSavedRepos();
  }, [fetchSavedRepos]);

  useEffect(() => {
    if (!repoId && repos.length > 0) setRepo(repos[0].id);
  }, [repoId, repos, setRepo]);

  useEffect(() => {
    if (repoId) fetchActivities({ repoId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoId]);

  const selectedRepo = useMemo(
    () => repos.find((r) => r.id === repoId) || null,
    [repos, repoId],
  );

  const syncStatus = repoId ? getSyncStatus(repoId) : null;

  const sortedItems = useMemo(() => {
    const copy = Array.isArray(items) ? [...items] : [];
    copy.sort((a, b) => {
      const da = new Date(a.occurredAt).getTime();
      const db = new Date(b.occurredAt).getTime();
      return sort === 'asc' ? da - db : db - da;
    });
    return copy;
  }, [items, sort]);

  const onSync = async () => {
    if (!repoId) return;
    await syncRepo(repoId, {
      prune: false,
      commitLimit: 50,
      issueLimit: 50,
      prLimit: 50,
    });
    await fetchActivities({ repoId });
  };

  const applyFilters = async (partial) => {
    setFilters(partial, { resetPage: true });
    await fetchActivities({
      repoId,
      page: 1,
      filters: { ...filters, ...partial },
    });
  };

  const goPage = async (nextPage) => {
    setPage(nextPage);
    await fetchActivities({ repoId, page: nextPage });
  };

  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / pageSize));

  return (
    <div className='space-y-6'>
      <ActivitiesHeader
        repos={repos}
        repoId={repoId}
        setRepo={setRepo}
        selectedRepo={selectedRepo}
        sort={sort}
        setSort={setSort}
        onSync={onSync}
        syncStatus={syncStatus}
      />

      <ActivitiesFilters
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />

      <ActivitiesTimeline
        repoId={repoId}
        isLoading={isLoading}
        error={error}
        sortedItems={sortedItems}
        total={total}
        page={page}
        totalPages={totalPages}
        goPage={goPage}
      />
    </div>
  );
}
