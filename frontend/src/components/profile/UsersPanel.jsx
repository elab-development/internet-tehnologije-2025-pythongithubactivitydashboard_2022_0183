import { useEffect } from 'react';
import { Shield, User } from 'lucide-react';
import { useUsersStore } from '../../store/users.store';

export default function UsersPanel() {
  const { users, isLoading, error, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Shield className='h-5 w-5 text-gray-700' />
        <h3 className='text-lg font-semibold text-gray-900'>All users</h3>
      </div>

      {isLoading && <p className='text-sm text-gray-500'>Loading users…</p>}

      {error && <p className='text-sm text-red-600'>{error}</p>}

      {!isLoading && users.length === 0 && (
        <p className='text-sm text-gray-500'>No users found.</p>
      )}

      {!isLoading && users.length > 0 && (
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-separate border-spacing-y-2'>
            <thead>
              <tr className='text-left text-gray-500'>
                <th className='px-3'>User</th>
                <th className='px-3'>Email</th>
                <th className='px-3'>Role</th>
                <th className='px-3'>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className='bg-gray-50 rounded-xl'>
                  <td className='px-3 py-2 font-medium text-gray-900 flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-500' />
                    {u.username}
                  </td>

                  <td className='px-3 py-2 text-gray-700'>{u.email}</td>

                  <td className='px-3 py-2'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className='px-3 py-2 text-gray-600'>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
