import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  Menu,
  X,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 shadow-md'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex h-14 items-center justify-between'>
          <Link
            to='/'
            className='flex items-center gap-2 text-white font-semibold text-lg tracking-tight'
          >
            <Github className='h-5 w-5 text-gray-200' />
            <span>GitDash</span>
          </Link>

          <div className='hidden md:flex items-center gap-1'>
            <Link
              to='/'
              className='inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
            >
              <Home className='h-4 w-4' />
              Home
            </Link>

            {!user && (
              <>
                <Link
                  to='/login'
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                >
                  <LogIn className='h-4 w-4' />
                  Login
                </Link>
                <Link
                  to='/register'
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                >
                  <UserPlus className='h-4 w-4' />
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to='/profile'
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                >
                  <User className='h-4 w-4' />
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className='ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-red-600 hover:text-white transition'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              </>
            )}

            {user && (
              <div className='ml-3 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 text-gray-200 text-xs'>
                <span className='w-2 h-2 rounded-full bg-green-500' />
                <span className='max-w-[180px] truncate'>{user.username}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className='md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-800 transition'
            aria-label='Toggle menu'
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {open && (
        <div className='md:hidden px-4 pb-4'>
          <div className='mt-2 rounded-xl bg-gray-900 shadow-lg ring-1 ring-white/10 overflow-hidden'>
            <div className='px-2 py-2 space-y-1'>
              <Link
                to='/'
                onClick={() => setOpen(false)}
                className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
              >
                <Home className='h-4 w-4' />
                Home
              </Link>

              {!user && (
                <>
                  <Link
                    to='/login'
                    onClick={() => setOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                  >
                    <LogIn className='h-4 w-4' />
                    Login
                  </Link>
                  <Link
                    to='/register'
                    onClick={() => setOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                  >
                    <UserPlus className='h-4 w-4' />
                    Register
                  </Link>
                </>
              )}

              {user && (
                <>
                  <Link
                    to='/profile'
                    onClick={() => setOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition'
                  >
                    <User className='h-4 w-4' />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className='w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-red-600 hover:text-white transition'
                  >
                    <LogOut className='h-4 w-4' />
                    Logout
                  </button>

                  <div className='mt-2 px-3 py-2 rounded-md bg-gray-800 text-gray-200 text-xs flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-green-500' />
                    <span className='truncate'>{user.username}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
