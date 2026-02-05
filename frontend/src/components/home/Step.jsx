export default function Step({ icon, title, children }) {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-5'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='h-9 w-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center'>
          {icon}
        </div>
        <h4 className='text-sm font-semibold text-gray-900'>{title}</h4>
      </div>
      <p className='text-sm text-gray-600 leading-relaxed'>{children}</p>
    </div>
  );
}
