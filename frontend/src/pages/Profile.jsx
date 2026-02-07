import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';

import ProfileTabs from '../components/profile/ProfileTabs';
import ApiKeyPanel from '../components/profile/ApiKeyPanel';
import ReposPanel from '../components/profile/ReposPanel';
import ActivityPanel from '../components/profile/ActivityPanel';
import UsersPanel from '../components/profile/UsersPanel';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const [tab, setTab] = useState(isAdmin ? 'users' : 'apikey');

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-2xl shadow-lg p-6'>
        <h1 className='text-xl font-semibold text-gray-900'>{user.username}</h1>
        <p className='text-sm text-gray-600'>{user.email}</p>

        <div className='mt-2'>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isAdmin
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      <ProfileTabs active={tab} onChange={setTab} isAdmin={isAdmin} />

      {!isAdmin && tab === 'apikey' && <ApiKeyPanel />}
      {!isAdmin && tab === 'repos' && <ReposPanel />}
      {!isAdmin && tab === 'activities' && <ActivityPanel />}

      {isAdmin && tab === 'users' && <UsersPanel />}
    </div>
  );
}
