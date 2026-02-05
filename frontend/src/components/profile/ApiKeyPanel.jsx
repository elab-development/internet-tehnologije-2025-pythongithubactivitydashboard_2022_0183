import { useEffect, useState } from 'react';
import { KeyRound, Trash2, CheckCircle } from 'lucide-react';
import { useApiKeyStore } from '../../store/apiKey.store';

export default function ApiKeyPanel() {
  const {
    hasToken,
    lastValidatedAt,
    isLoading,
    error,
    fetchStatus,
    setToken,
    deleteToken,
  } = useApiKeyStore();

  const [token, setTokenInput] = useState('');

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const submit = async (e) => {
    e.preventDefault();
    await setToken(token);
    setTokenInput('');
  };

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 space-y-4'>
      <div className='flex items-center gap-2'>
        <KeyRound className='h-5 w-5 text-gray-700' />
        <h3 className='text-lg font-semibold text-gray-900'>
          GitHub API Token
        </h3>
      </div>

      {hasToken && (
        <div className='flex items-center gap-2 text-sm text-green-600'>
          <CheckCircle className='h-4 w-4' />
          Token active
          {lastValidatedAt && (
            <span className='text-gray-500'>
              (validated {new Date(lastValidatedAt).toLocaleString()})
            </span>
          )}
        </div>
      )}

      {!hasToken && (
        <form onSubmit={submit} className='space-y-3'>
          <input
            type='password'
            placeholder='Paste GitHub token'
            value={token}
            onChange={(e) => setTokenInput(e.target.value)}
            className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
          />

          <button
            disabled={isLoading}
            className='inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black transition disabled:opacity-50'
          >
            <KeyRound className='h-4 w-4' />
            Save token
          </button>
        </form>
      )}

      {hasToken && (
        <button
          onClick={deleteToken}
          disabled={isLoading}
          className='inline-flex items-center gap-2 rounded-xl bg-red-100 text-red-700 px-4 py-2 text-sm hover:bg-red-200 transition'
        >
          <Trash2 className='h-4 w-4' />
          Remove token
        </button>
      )}

      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
}
