import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import type { UserInfo, Role } from '../../services/api';

export default function UserManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof UserInfo>('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Role change confirmation
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: UserInfo;
    newRoleId: number;
    newRoleName: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, rolesData] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || t('users.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      await apiService.updateUserRole(pendingRoleChange.user.id, pendingRoleChange.newRoleId);
      await loadData();
      setPendingRoleChange(null);
    } catch (err: any) {
      setError(err.message || t('users.roleChangeError'));
      setPendingRoleChange(null);
    }
  };

  const handleSort = (field: keyof UserInfo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesRole = !roleFilter || user.roles.some(r => r.name === roleFilter);

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: keyof UserInfo }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('users.title')}</h1>
              <p className="text-gray-600 mt-1">{t('users.description')}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t('common.back')}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t('users.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option value="">{t('users.allRoles')}</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('username')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      {t('users.username')}
                      <SortIcon field="username" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      {t('users.email')}
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('users.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('users.roles')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('users.language')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('users.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const isCurrentUser = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{user.username}</span>
                          {isCurrentUser && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              {t('users.you')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.firstName || user.lastName
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                        <select
                          value={user.roles[0]?.id || ''}
                          onChange={(e) => {
                            const newRoleId = Number(e.target.value);
                            const newRole = roles.find((r) => r.id === newRoleId);
                            if (newRole) {
                              setPendingRoleChange({
                                user,
                                newRoleId,
                                newRoleName: newRole.name,
                              });
                            }
                          }}
                          disabled={isCurrentUser}
                          className={`mt-2 border border-gray-300 rounded px-3 py-1 text-sm ${
                            isCurrentUser
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'hover:border-gray-400'
                          }`}
                          title={isCurrentUser ? t('users.cannotChangeOwnRole') : ''}
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.languagePreference.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.enabled ? t('users.active') : t('users.inactive')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t('users.noResults')}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {t('users.showing', {
            count: filteredUsers.length,
            total: users.length,
          })}
        </div>
      </div>

      {/* Role Change Confirmation Modal */}
      {pendingRoleChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('users.changeRole')}</h2>
            <p className="text-gray-600 mb-6">
              {t('users.confirmRoleChange', {
                username: pendingRoleChange.user.username,
                role: pendingRoleChange.newRoleName,
              })}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingRoleChange(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleRoleChange}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
