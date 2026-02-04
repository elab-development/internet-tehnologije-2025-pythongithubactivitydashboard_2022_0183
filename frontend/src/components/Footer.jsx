import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-white shadow-[0_-8px_24px_-20px_rgba(0,0,0,0.35)]'>
      <div className='max-w-7xl mx-auto px-4 py-5 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Github className='h-4 w-4 text-gray-400' />
          <span>© {new Date().getFullYear()} GitDash</span>
        </div>

        <span className='text-gray-500'>
          Open-source GitHub Activity Dashboard
        </span>
      </div>
    </footer>
  );
}
