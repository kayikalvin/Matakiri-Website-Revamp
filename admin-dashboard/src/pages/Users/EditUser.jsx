
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    isActive: true
  });
  // allow optional password update
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const [error, setError] = useState(null);

  // fetchUser is exposed so Retry can call it without reloading
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getById(id);
      const resData = res?.data;
      // normalize possible shapes: { data: {...} } | { user: {...} } | direct object
      const user = resData?.data ?? resData?.user ?? resData;

      // normalize department/manager/avatar which may be objects or null
      const departmentObj = user?.department;
      const departmentId = departmentObj && (departmentObj._id || departmentObj.id) || (typeof departmentObj === 'string' ? departmentObj : undefined);
      const departmentName = departmentObj && typeof departmentObj === 'object' ? (departmentObj.name || '') : (departmentObj || '');

      const managerObj = user?.manager;
      const managerId = managerObj && (managerObj._id || managerObj.id) || (typeof managerObj === 'string' ? managerObj : undefined);
      const managerName = managerObj && typeof managerObj === 'object' ? (managerObj.name || managerObj.email || '') : (managerObj || '');

      const avatarObj = user?.avatar;
      const avatarUrl = avatarObj && typeof avatarObj === 'object' ? (avatarObj.url || avatarObj.path || '') : (avatarObj || '');

      setFormData({
        id: user._id || user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'editor',
        isActive: typeof user.isActive === 'boolean' ? user.isActive : (user.isActive === 'false' ? false : true),
        createdAt: user.createdAt || '',
        avatar: avatarUrl,
        department: departmentName,
        departmentId: departmentId,
        manager: managerName,
        managerId: managerId
      });
    } catch (err) {
      console.error('Fetch user failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load user.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // validate optional password if provided
      if (passwords.password || passwords.confirmPassword) {
        if (passwords.password !== passwords.confirmPassword) {
          throw new Error('Passwords do not match');
        }
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: !!formData.isActive
      };
      if (passwords.password) payload.password = passwords.password;

      await usersAPI.update(id, payload);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => fetchUser()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6">
      <Toaster />
      <div className="mb-8">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Users
        </button>
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <PencilIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
            <p className="text-gray-600 mt-2">Update user details and permissions</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          {/* User Info Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
                <p className="text-sm text-gray-500">User ID: {formData.id}</p>
                <p className="text-sm text-gray-500">Joined: {formData.createdAt ? formData.createdAt.slice(0, 10) : ''}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="viewer">Viewer (Read only)</option>
                <option value="editor">Editor (Create & Edit)</option>
                <option value="admin">Administrator (Full access)</option>
              </select>
            </div>

            {/* Status */}
            <div>
                <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                Active *
              </label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Optional Password Change */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password (optional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwords.password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm new password"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;