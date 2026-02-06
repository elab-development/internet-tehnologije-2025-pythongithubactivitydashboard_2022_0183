import { ExternalLink } from 'lucide-react';
import { typeBadge, typeIcon } from './activityUi';

export default function ActivityRow({ a }) {
  const Icon = typeIcon(a.type);

  const title =
    a.type === 'commit'
      ? a.commit?.message || '(commit)'
      : a.type === 'issue'
        ? a.issue?.title || '(issue)'
        : a.pullRequest?.title || '(pull request)';

  const url =
    a.type === 'commit'
      ? a.commit?.url
      : a.type === 'issue'
        ? a.issue?.url
        : a.pullRequest?.url;

  const metaRight =
    a.type === 'commit'
      ? `+${a.commit?.additions ?? 0} / -${a.commit?.deletions ?? 0}`
      : a.type === 'issue'
        ? `${a.issue?.state || 'unknown'}`
        : `${a.pullRequest?.state || 'unknown'}${
            a.pullRequest?.merged ? ' • merged' : ''
          }`;

  return (
    <div className='flex gap-3'>
      <div className='flex flex-col items-center'>
        <div className='h-9 w-9 rounded-xl bg-gray-900 text-white flex items-center justify-center'>
          <Icon className='h-4 w-4' />
        </div>
        <div className='w-px flex-1 bg-gray-200 mt-2' />
      </div>

      <div className='flex-1 pb-6'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className={typeBadge(a.type)}>{a.type}</span>

              <span className='text-sm text-gray-900 font-medium break-words'>
                {title}
              </span>

              {url && (
                <a
                  href={url}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black'
                  title='Open on GitHub'
                >
                  <ExternalLink className='h-3.5 w-3.5' />
                  GitHub
                </a>
              )}
            </div>

            <div className='text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1'>
              <span>
                <span className='text-gray-500'>Actor:</span> {a.actor}
              </span>
              <span>
                <span className='text-gray-500'>Time:</span>{' '}
                {new Date(a.occurredAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className='text-xs text-gray-500 whitespace-nowrap'>
            {metaRight}
          </div>
        </div>
      </div>
    </div>
  );
}
