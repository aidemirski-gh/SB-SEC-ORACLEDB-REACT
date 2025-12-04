import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../services/api';
import type { Privilege } from '../../services/api';

export default function PrivilegeManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Create privilege modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit privilege modal
  const [editingPrivilege, setEditingPrivilege] = useState<Privilege | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    category: '',
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete confirmation
  const [deletingPrivilege, setDeletingPrivilege] = useState<Privilege | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [privilegesData, categoriesData] = await Promise.all([
        apiService.getAllPrivileges(),
        apiService.getPrivilegeCategories(),
      ]);
      setPrivileges(privilegesData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || t('privileges.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrivilege = async () => {
    try {
      setIsCreating(true);
      setCreateError(null);
      await apiService.createPrivilege(createForm);
      await loadData();
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', category: '' });
    } catch (err: any) {
      setCreateError(err.message || t('privileges.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPrivilege = async () => {
    if (!editingPrivilege) return;

    try {
      setIsUpdating(true);
      setEditError(null);
      await apiService.updatePrivilege(editingPrivilege.id, editForm);
      await loadData();
      setEditingPrivilege(null);
    } catch (err: any) {
      setEditError(err.message || t('privileges.updateError'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePrivilege = async () => {
    if (!deletingPrivilege) return;

    try {
      await apiService.deletePrivilege(deletingPrivilege.id);
      await loadData();
      setDeletingPrivilege(null);
    } catch (err: any) {
      setError(err.message || t('privileges.deleteError'));
      setDeletingPrivilege(null);
    }
  };

  const openEditModal = (privilege: Privilege) => {
    setEditingPrivilege(privilege);
    setEditForm({
      description: privilege.description || '',
      category: privilege.category || '',
    });
    setEditError(null);
  };

  // Filter and search privileges
  const filteredPrivileges = privileges.filter((privilege) => {
    const matchesSearch =
      privilege.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (privilege.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesCategory = !categoryFilter || privilege.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('privileges.title')}</h1>
              <p className="text-gray-600 mt-1">{t('privileges.description')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {t('privileges.createPrivilege')}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.back')}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t('privileges.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option value="">{t('privileges.allCategories')}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
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

        {/* Privileges Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('privileges.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('privileges.description')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('privileges.category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('privileges.roleCount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('privileges.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrivileges.map((privilege) => (
                  <tr key={privilege.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{privilege.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{privilege.description || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {privilege.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{privilege.roleCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(privilege)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => setDeletingPrivilege(privilege)}
                        disabled={privilege.roleCount > 0}
                        className={`${
                          privilege.roleCount > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                        }`}
                        title={
                          privilege.roleCount > 0
                            ? t('privileges.cannotDeleteWithRoles')
                            : ''
                        }
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPrivileges.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t('privileges.noResults')}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {t('privileges.showing', {
            count: filteredPrivileges.length,
            total: privileges.length,
          })}
        </div>
      </div>

      {/* Create Privilege Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('privileges.createPrivilege')}
            </h2>

            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.name')}
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value.toUpperCase() })
                  }
                  placeholder="READ_CUSTOMERS"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">{t('privileges.nameHelp')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.category')}
                </label>
                <input
                  type="text"
                  value={createForm.category}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, category: e.target.value })
                  }
                  placeholder="CUSTOMERS"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.description')}
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreatePrivilege}
                disabled={isCreating || !createForm.name}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {isCreating ? t('common.creating') : t('common.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Privilege Modal */}
      {editingPrivilege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('privileges.editPrivilege')}
            </h2>

            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {editError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.name')}
                </label>
                <input
                  type="text"
                  value={editingPrivilege.name}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">{t('privileges.nameImmutable')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.category')}
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('privileges.description')}
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPrivilege(null)}
                disabled={isUpdating}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleEditPrivilege}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {isUpdating ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPrivilege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('privileges.deletePrivilege')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('privileges.confirmDelete', { name: deletingPrivilege.name })}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingPrivilege(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeletePrivilege}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
