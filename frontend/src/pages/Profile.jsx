import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import ProfileTabs from '../components/profile/ProfileTabs';
import ApiKeyPanel from '../components/profile/ApiKeyPanel';
import ReposPanel from '../components/profile/ReposPanel';
import ActivityPanel from '../components/profile/ActivityPanel';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState('apikey');

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-2xl shadow-lg p-6'>
        <h1 className='text-xl font-semibold text-gray-900'>{user.username}</h1>
        <p className='text-sm text-gray-600'>{user.email}</p>
      </div>

      <ProfileTabs active={tab} onChange={setTab} />

      {tab === 'apikey' && <ApiKeyPanel />}
      {tab === 'repos' && <ReposPanel />}
      {tab === 'activities' && <ActivityPanel />}
    </div>
  );
}
