import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { userAPI } from '../../services/api';
import { DEPARTMENTS, ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';

const UserList = () => {
  const { loading, error, execute, data: users } = useApi();
  const { execute: createExecute, loading: createLoading, error: createError } = useApi();
  const { execute: deleteExecute, loading: deleteLoading, error: deleteError } = useApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'employee', department: '' });
  const pageSize = 10;

  useEffect(() => {
    execute(() => userAPI.getUsers({ page: currentPage, limit: pageSize }));
  }, [execute, currentPage]);

  const handleNextPage = () => {
    if (users?.length === pageSize) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createExecute(() => userAPI.createUser(formData));
      setIsCreateModalOpen(false);
      setFormData({ username: '', password: '', role: 'employee', department: '' });
      execute(() => userAPI.getUsers({ page: currentPage, limit: pageSize }));
    } catch (err) {
      console.error('User creation failed:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteExecute(() => userAPI.deleteUser(id));
        execute(() => userAPI.getUsers({ page: currentPage, limit: pageSize }));
      } catch (err) {
        console.error('User deletion failed:', err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
          Create User
        </button>
      </div>
      
      {loading && <LoadingSpinner />}
      {(error || createError || deleteError) && (
        <p className="text-red-500">{error || createError || deleteError}</p>
      )}
      {users && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
      {users && users.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn-danger"
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={users.length < pageSize}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="md"
      >
        <form onSubmit={handleCreateUser}>
          <div className="mb-4">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={createLoading}>
            {createLoading ? <LoadingSpinner size="sm" /> : 'Create User'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;