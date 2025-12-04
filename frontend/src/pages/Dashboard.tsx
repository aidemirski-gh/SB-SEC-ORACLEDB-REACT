import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-gray-700">
                {t('dashboard.welcome')}, <span className="font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{t('dashboard.stats.totalCustomers')}</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{t('dashboard.stats.activeDeals')}</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{t('dashboard.stats.revenue')}</h3>
            <p className="text-3xl font-bold text-gray-800">$0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.userInfo.title')}</h2>
          <div className="space-y-3">
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.username')}</span>
              <span className="text-gray-600">{user?.username}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.email')}</span>
              <span className="text-gray-600">{user?.email}</span>
            </div>
            {user?.firstName && (
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.firstName')}</span>
                <span className="text-gray-600">{user.firstName}</span>
              </div>
            )}
            {user?.lastName && (
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.lastName')}</span>
                <span className="text-gray-600">{user.lastName}</span>
              </div>
            )}
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.roles')}</span>
              <span className="text-gray-600">{user?.roles.join(', ')}</span>
            </div>
            <div className="flex pb-2">
              <span className="font-semibold text-gray-700 w-32">{t('dashboard.userInfo.userId')}</span>
              <span className="text-gray-600">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Admin Panel - Only visible for ROLE_ADMIN */}
        {user?.roles.includes('ROLE_ADMIN') && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('dashboard.admin.title')}
            </h2>
            <p className="text-gray-600 mb-6">{t('dashboard.admin.description')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition duration-200 text-left"
              >
                <div className="font-semibold text-lg mb-1">{t('dashboard.admin.manageUsers')}</div>
                <div className="text-blue-100 text-sm">{t('dashboard.admin.manageUsersDesc')}</div>
              </button>
              <button
                onClick={() => navigate('/admin/roles')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition duration-200 text-left"
              >
                <div className="font-semibold text-lg mb-1">{t('dashboard.admin.manageRoles')}</div>
                <div className="text-purple-100 text-sm">{t('dashboard.admin.manageRolesDesc')}</div>
              </button>
              <button
                onClick={() => navigate('/admin/privileges')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition duration-200 text-left"
              >
                <div className="font-semibold text-lg mb-1">{t('dashboard.admin.managePrivileges')}</div>
                <div className="text-green-100 text-sm">{t('dashboard.admin.managePrivilegesDesc')}</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
