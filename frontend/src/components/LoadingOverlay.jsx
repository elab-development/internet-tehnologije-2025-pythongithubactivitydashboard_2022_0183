import { Github, Loader2 } from 'lucide-react';

export default function LoadingOverlay({ visible, text = 'Loading…' }) {
  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-xl px-6 py-5 flex items-center gap-3'>
        <Github className='h-5 w-5 text-gray-800' />
        <Loader2 className='h-5 w-5 text-gray-800 animate-spin' />
        <span className='text-sm font-medium text-gray-800'>{text}</span>
      </div>
    </div>
  );
}
