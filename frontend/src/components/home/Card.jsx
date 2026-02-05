export default function Card({ icon, title, children }) {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-5'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center'>
          {icon}
        </div>
        <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
      </div>
      <p className='text-sm text-gray-600 leading-relaxed'>{children}</p>
    </div>
  );
}
