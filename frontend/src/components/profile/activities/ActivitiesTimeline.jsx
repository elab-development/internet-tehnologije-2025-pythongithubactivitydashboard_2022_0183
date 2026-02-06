import ActivityRow from './ActivityRow';

export default function ActivitiesTimeline({
  repoId,
  isLoading,
  error,
  sortedItems,
  total,
  page,
  totalPages,
  goPage,
}) {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center justify-between gap-3 flex-wrap mb-4'>
        <div>
          <h4 className='text-base font-semibold text-gray-900'>Timeline</h4>
          <p className='text-sm text-gray-600'>
            {repoId ? (
              <>
                Showing{' '}
                <span className='font-medium'>{sortedItems.length}</span> of{' '}
                <span className='font-medium'>{total}</span> items
              </>
            ) : (
              'Select a repository to see activity.'
            )}
          </p>
        </div>

        {repoId && total > 0 && (
          <div className='flex items-center gap-2 text-sm'>
            <button
              disabled={isLoading || page <= 1}
              onClick={() => goPage(page - 1)}
              className='px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50'
            >
              Prev
            </button>

            <span className='text-gray-600'>
              Page <span className='font-medium'>{page}</span> / {totalPages}
            </span>

            <button
              disabled={isLoading || page >= totalPages}
              onClick={() => goPage(page + 1)}
              className='px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <p className='text-sm text-gray-500'>Loading activities...</p>
      )}

      {!isLoading && error && <p className='text-sm text-red-600'>{error}</p>}

      {!isLoading && !error && repoId && sortedItems.length === 0 && (
        <p className='text-sm text-gray-500'>
          No activities found. Try syncing or changing filters.
        </p>
      )}

      {!isLoading && !error && sortedItems.length > 0 && (
        <div className='pt-2'>
          {sortedItems.map((a) => (
            <ActivityRow key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
