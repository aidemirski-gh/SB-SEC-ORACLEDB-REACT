import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
              <h1 className="text-2xl font-bold text-gray-800">CRM Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Deals</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Information</h2>
          <div className="space-y-3">
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">Username:</span>
              <span className="text-gray-600">{user?.username}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">Email:</span>
              <span className="text-gray-600">{user?.email}</span>
            </div>
            {user?.firstName && (
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-32">First Name:</span>
                <span className="text-gray-600">{user.firstName}</span>
              </div>
            )}
            {user?.lastName && (
              <div className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-32">Last Name:</span>
                <span className="text-gray-600">{user.lastName}</span>
              </div>
            )}
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-32">Role:</span>
              <span className="text-gray-600">{user?.role}</span>
            </div>
            <div className="flex pb-2">
              <span className="font-semibold text-gray-700 w-32">User ID:</span>
              <span className="text-gray-600">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
