import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../services/api';
import type { Role, Privilege } from '../../services/api';

export default function RoleManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);

  // Form states
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Privilege management
  const [managingPrivilegesFor, setManagingPrivilegesFor] = useState<Role | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<Privilege[]>([]);
  const [selectedPrivilegeIds, setSelectedPrivilegeIds] = useState<Set<number>>(new Set());
  const [privilegesLoading, setPrivilegesLoading] = useState(false);
  const [privilegesSaving, setPrivilegesSaving] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || t('roles.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate role name pattern
    if (!/^ROLE_[A-Z_]+$/.test(roleName)) {
      setFormError(t('roles.validation.namePattern'));
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createRole({
        name: roleName,
        description: roleDescription || undefined,
      });
      await loadRoles();
      setShowCreateModal(false);
      setRoleName('');
      setRoleDescription('');
    } catch (err: any) {
      setFormError(err.message || t('roles.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (role: Role, description: string) => {
    try {
      await apiService.updateRole(role.id, { description });
      await loadRoles();
      setEditingRole(null);
    } catch (err: any) {
      setError(err.message || t('roles.updateError'));
    }
  };

  const handleDeleteRole = async (role: Role) => {
    try {
      await apiService.deleteRole(role.id);
      await loadRoles();
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || t('roles.deleteError'));
      setDeleteConfirm(null);
    }
  };

  const handleManagePrivileges = async (role: Role) => {
    setManagingPrivilegesFor(role);
    setPrivilegesLoading(true);
    try {
      const [allPrivs, rolePrivs] = await Promise.all([
        apiService.getAllPrivileges(),
        apiService.getRolePrivileges(role.id),
      ]);
      setAllPrivileges(allPrivs);
      setSelectedPrivilegeIds(new Set(rolePrivs.map((p) => p.id)));
    } catch (err: any) {
      setError(err.message || t('roles.privilegesLoadError'));
      setManagingPrivilegesFor(null);
    } finally {
      setPrivilegesLoading(false);
    }
  };

  const handleSavePrivileges = async () => {
    if (!managingPrivilegesFor) return;

    setPrivilegesSaving(true);
    try {
      await apiService.updateRolePrivileges(
        managingPrivilegesFor.id,
        Array.from(selectedPrivilegeIds)
      );
      await loadRoles();
      setManagingPrivilegesFor(null);
    } catch (err: any) {
      setError(err.message || t('roles.privilegesSaveError'));
    } finally {
      setPrivilegesSaving(false);
    }
  };

  const togglePrivilege = (privilegeId: number) => {
    const newSelected = new Set(selectedPrivilegeIds);
    if (newSelected.has(privilegeId)) {
      newSelected.delete(privilegeId);
    } else {
      newSelected.add(privilegeId);
    }
    setSelectedPrivilegeIds(newSelected);
  };

  const getPrivilegesByCategory = () => {
    const byCategory: Record<string, Privilege[]> = {};
    allPrivileges.forEach((priv) => {
      const category = priv.category || 'UNCATEGORIZED';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(priv);
    });
    return byCategory;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('roles.title')}</h1>
              <p className="text-gray-600 mt-1">{t('roles.description')}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {t('roles.createRole')}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('roles.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('roles.description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('roles.type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('roles.userCount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('roles.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{role.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingRole?.id === role.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={role.description || ''}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateRole(role, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingRole(null);
                            }
                          }}
                          className="flex-1 border border-gray-300 rounded px-2 py-1"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            handleUpdateRole(role, input?.value || '');
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          {t('common.save')}
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600">{role.description || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {role.systemRole ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {t('roles.systemRole')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {t('roles.customRole')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{role.userCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRole(role)}
                        disabled={editingRole !== null}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleManagePrivileges(role)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        {t('roles.managePrivileges')}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(role)}
                        disabled={role.systemRole || role.userCount > 0}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={
                          role.systemRole
                            ? t('roles.cannotDeleteSystem')
                            : role.userCount > 0
                            ? t('roles.cannotDeleteWithUsers')
                            : ''
                        }
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('roles.createRole')}</h2>
            <form onSubmit={handleCreateRole}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('roles.name')}</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value.toUpperCase())}
                  placeholder="ROLE_EXAMPLE"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{t('roles.nameHelp')}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('roles.description')}</label>
                <textarea
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setRoleName('');
                    setRoleDescription('');
                    setFormError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
                  disabled={submitting}
                >
                  {submitting ? t('common.creating') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('roles.deleteRole')}</h2>
            <p className="text-gray-600 mb-6">
              {t('roles.confirmDelete', { name: deleteConfirm.name })}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDeleteRole(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Privileges Modal */}
      {managingPrivilegesFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {t('roles.managePrivileges')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('roles.managePrivilegesDesc', { role: managingPrivilegesFor.name })}
            </p>

            {privilegesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-600">{t('common.loading')}</div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(getPrivilegesByCategory()).map(([category, privileges]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {category}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({privileges.filter(p => selectedPrivilegeIds.has(p.id)).length}/{privileges.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {privileges.map((privilege) => (
                        <label
                          key={privilege.id}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPrivilegeIds.has(privilege.id)}
                            onChange={() => togglePrivilege(privilege.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">
                              {privilege.name}
                            </div>
                            {privilege.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {privilege.description}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {t('roles.selectedPrivileges', { count: selectedPrivilegeIds.size })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setManagingPrivilegesFor(null)}
                  disabled={privilegesSaving}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSavePrivileges}
                  disabled={privilegesSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
                >
                  {privilegesSaving ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
