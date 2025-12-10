
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await usersAPI.create({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });
      toast.success('User created successfully!');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
      toast.error(err.response?.data?.message || 'Failed to create user.');
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
            <UserPlusIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
            <p className="text-gray-600 mt-2">Create a new user account</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}
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
                placeholder="John Doe"
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
                placeholder="user@matakiritrust.org"
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
              <div className="mt-2 text-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Viewer:</strong> Can only view content</li>
                  <li><strong>Editor:</strong> Can create and edit content</li>
                  <li><strong>Admin:</strong> Full system access including user management</li>
                </ul>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm password"
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
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;