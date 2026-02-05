import { useEffect, useMemo } from 'react';
import { FolderGit2, PlusCircle, AlertTriangle } from 'lucide-react';
import { useApiKeyStore } from '../../store/apiKey.store';
import { useGithubReposStore } from '../../store/githubRepos.store';
import { useReposStore } from '../../store/repos.store';

export default function ReposPanel() {
  const { hasToken } = useApiKeyStore();

  const { repos: githubRepos, fetchGithubRepos } = useGithubReposStore();

  const { repos: savedRepos, fetchSavedRepos, addRepo } = useReposStore();

  useEffect(() => {
    fetchSavedRepos();
  }, [fetchSavedRepos]);

  useEffect(() => {
    if (hasToken) {
      fetchGithubRepos();
    }
  }, [hasToken, fetchGithubRepos]);

  const savedGithubIds = useMemo(
    () => new Set(savedRepos.map((r) => r.githubId)),
    [savedRepos],
  );

  return (
    <div className='space-y-6'>
      {/* Saved repos */}
      <div className='bg-white rounded-2xl shadow-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>
          Your repositories
        </h3>

        {savedRepos.length === 0 && (
          <p className='text-sm text-gray-500'>No repositories added yet.</p>
        )}

        <ul className='space-y-2'>
          {savedRepos.map((r) => (
            <li
              key={r.id}
              className='flex items-center gap-2 text-sm text-gray-800'
            >
              <FolderGit2 className='h-4 w-4 text-gray-600' />
              {r.owner}/{r.name}
            </li>
          ))}
        </ul>
      </div>

      {/* GitHub repos */}
      <div className='bg-white rounded-2xl shadow-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>
          Add from GitHub
        </h3>

        {!hasToken && (
          <div className='flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-xl'>
            <AlertTriangle className='h-4 w-4' />
            Add GitHub API token to browse your repositories.
          </div>
        )}

        {hasToken && (
          <ul className='space-y-2 max-h-64 overflow-y-auto'>
            {githubRepos.map((r) => {
              const alreadyAdded = savedGithubIds.has(r.githubId);

              return (
                <li
                  key={r.githubId}
                  className='flex items-center justify-between text-sm'
                >
                  <span className='text-gray-800'>
                    {r.owner}/{r.name}
                  </span>

                  {alreadyAdded ? (
                    <span className='text-xs text-green-600 font-medium'>
                      ✓ Already added
                    </span>
                  ) : (
                    <button
                      onClick={() => addRepo(r.githubId)}
                      className='inline-flex items-center gap-1 text-xs text-gray-700 hover:text-black'
                    >
                      <PlusCircle className='h-4 w-4' />
                      Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
