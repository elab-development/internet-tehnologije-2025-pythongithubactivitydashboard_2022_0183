import { Filter, Search } from 'lucide-react';

export default function ActivitiesFilters({
  filters,
  setFilters,
  applyFilters,
}) {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center gap-2 mb-3 text-gray-700'>
        <Filter className='h-4 w-4' />
        <span className='text-sm font-medium'>Filters</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
        <div>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => applyFilters({ type: e.target.value })}
            className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
          >
            <option value=''>All</option>
            <option value='commit'>Commit</option>
            <option value='issue'>Issue</option>
            <option value='pull_request'>Pull request</option>
          </select>
        </div>

        <div className='md:col-span-2'>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            Search (message/title)
          </label>

          <div className='relative'>
            <Search className='h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
            <input
              value={filters.q}
              onChange={(e) =>
                setFilters({ q: e.target.value }, { resetPage: false })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyFilters({ q: filters.q });
              }}
              placeholder='e.g. fix bug, auth, refactor...'
              className='w-full pl-9 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
            />
          </div>

          <div className='mt-2'>
            <button
              onClick={() => applyFilters({ q: filters.q })}
              className='text-xs text-gray-700 hover:text-black'
            >
              Apply search
            </button>
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            Actor
          </label>
          <input
            value={filters.actor}
            onChange={(e) => applyFilters({ actor: e.target.value })}
            placeholder='username'
            className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
          />
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-600 mb-1'>
            From / To (ISO)
          </label>
          <div className='grid grid-cols-2 gap-2'>
            <input
              value={filters.from}
              onChange={(e) => applyFilters({ from: e.target.value })}
              placeholder='2026-01-01'
              className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
            />
            <input
              value={filters.to}
              onChange={(e) => applyFilters({ to: e.target.value })}
              placeholder='2026-01-31'
              className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
