export default function ProfileTabs({ active, onChange }) {
  const tabClass = (key) =>
    `px-4 py-2 text-sm font-medium rounded-xl transition
     ${
       active === key
         ? 'bg-gray-900 text-white'
         : 'text-gray-700 hover:bg-gray-100'
     }`;

  return (
    <div className='flex gap-2 bg-white p-2 rounded-2xl shadow-lg'>
      <button
        className={tabClass('profile')}
        onClick={() => onChange('profile')}
      >
        Profile
      </button>
      <button className={tabClass('repos')} onClick={() => onChange('repos')}>
        Repositories
      </button>
    </div>
  );
}
