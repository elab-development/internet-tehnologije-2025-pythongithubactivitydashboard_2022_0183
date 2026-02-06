import { RefreshCw, ExternalLink, ArrowDownUp } from 'lucide-react';

export default function ActivitiesHeader({
  repos,
  repoId,
  setRepo,
  selectedRepo,
  sort,
  setSort,
  onSync,
  syncStatus,
}) {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 space-y-4'>
      <div className='flex items-start justify-between gap-3 flex-wrap'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Activities</h3>
          <p className='text-sm text-gray-600'>
            Choose a saved repository and explore its timeline.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={onSync}
            disabled={!repoId || (syncStatus && syncStatus.isSyncing)}
            className='inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black transition disabled:opacity-50'
          >
            <RefreshCw
              className={`h-4 w-4 ${
                syncStatus?.isSyncing ? 'animate-spin' : ''
              }`}
            />
            {syncStatus?.isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div className='md:col-span-2'>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            Repository (saved in DB)
          </label>

          <select
            value={repoId || ''}
            onChange={(e) => setRepo(Number(e.target.value) || null)}
            className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
          >
            {repos.length === 0 && <option value=''>No saved repos</option>}
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.owner}/{r.name}
              </option>
            ))}
          </select>

          {selectedRepo && (
            <div className='mt-2 text-xs text-gray-600 flex items-center gap-2 flex-wrap'>
              <span className='text-gray-500'>URL:</span>
              <a
                href={selectedRepo.url}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-1 hover:text-black'
              >
                <ExternalLink className='h-3.5 w-3.5' />
                {selectedRepo.url}
              </a>
            </div>
          )}
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            Sort
          </label>
          <button
            onClick={() => setSort((s) => (s === 'desc' ? 'asc' : 'desc'))}
            className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-900 px-3 py-2 text-sm hover:bg-gray-200 transition'
          >
            <ArrowDownUp className='h-4 w-4' />
            {sort === 'desc' ? 'Newest first' : 'Oldest first'}
          </button>
        </div>
      </div>

      {syncStatus?.error && (
        <p className='text-sm text-red-600 mt-2'>{syncStatus.error}</p>
      )}
    </div>
  );
}
