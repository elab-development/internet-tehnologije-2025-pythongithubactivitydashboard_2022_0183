import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

export default function Register() {
  const navigate = useNavigate();

  const register = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await register({ username, email, password });
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
              Create your GitDash account
            </h1>
          </div>

          <p className='text-sm text-gray-500 mb-6'>
            Register to save repositories and sync activity.
          </p>

          {(localError || error) && (
            <div className='mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm'>
              {localError || error}
            </div>
          )}

          <form onSubmit={onSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Username
              </label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300'
                placeholder='yourname'
                autoComplete='username'
                required
              />
            </div>

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
                placeholder='At least 6 characters'
                autoComplete='new-password'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm password
              </label>
              <input
                type='password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className='w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300'
                placeholder='Repeat password'
                autoComplete='new-password'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed'
            >
              <UserPlus className='h-4 w-4' />
              {isLoading ? 'Creating...' : 'Create account'}
            </button>

            <p className='text-sm text-gray-600 text-center'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-gray-900 font-medium hover:underline'
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <p className='text-xs text-gray-500 text-center mt-4'>
          Tip: You can later add a GitHub token in Profile to increase rate
          limits.
        </p>
      </div>
    </div>
  );
}
