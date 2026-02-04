import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

export default function Login() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      navigate('/');
    } catch {}
  };

  return (
    <div className='bg-gray-50'>
      <div className='max-w-md mx-auto px-4 py-10'>
        <div className='bg-white shadow-lg rounded-2xl p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Github className='h-5 w-5 text-gray-700' />
            <h1 className='text-xl font-semibold text-gray-900'>
              Sign in to GitDash
            </h1>
          </div>

          <p className='text-sm text-gray-500 mb-6'>
            Use your GitDash account to access your dashboard.
          </p>

          {error && (
            <div className='mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300'
                placeholder='you@example.com'
                autoComplete='email'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300'
                placeholder='••••••••'
                autoComplete='current-password'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed'
            >
              <LogIn className='h-4 w-4' />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className='text-sm text-gray-600 text-center'>
              Don’t have an account?{' '}
              <Link
                to='/register'
                className='text-gray-900 font-medium hover:underline'
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

        <p className='text-xs text-gray-500 text-center mt-4'>
          By continuing, you agree to use GitDash responsibly.
        </p>
      </div>
    </div>
  );
}
