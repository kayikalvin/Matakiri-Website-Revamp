import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, UserGroupIcon, PencilIcon } from '@heroicons/react/24/outline';

import { partnersAPI } from '../../services/api';

const EditPartner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'NGO',
    description: '',
    country: 'Kenya',
    contact: '',
    email: '',
    website: '',
    logo: '',
    status: 'active'
  });

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await partnersAPI.getById(id);
        const resData = res?.data;
        // normalize possible shapes: { data: {...} } | { partner: {...} } | direct object
        const partner = resData?.data ?? resData?.partner ?? resData;
        setFormData({
          id: partner._id || partner.id,
          name: partner.name || '',
          type: partner.type || '',
          description: partner.description || '',
          country: partner.country || '',
          contact: partner.contact || '',
          email: partner.email || '',
          website: partner.website || '',
          logo: partner.logo || '',
          status: partner.status || '',
          since: partner.since || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load partner');
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await partnersAPI.update(id, formData);
      setLoading(false);
      navigate('/partners');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update partner');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
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
      <div className="p-6 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/partners')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Partners
        </button>
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <PencilIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Partner</h1>
            <p className="text-gray-600 mt-2">Update partner organization details</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Partner Info Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
                <p className="text-sm text-gray-500">Partner ID: {formData.id}</p>
                <p className="text-sm text-gray-500">Partner since: {formData.since}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
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

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="NGO">NGO</option>
                <option value="Corporate">Corporate</option>
                <option value="Government">Government Agency</option>
                <option value="Health Organization">Health Organization</option>
                <option value="Educational">Educational Institution</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Kenya">Kenya</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Uganda">Uganda</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Burundi">Burundi</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                required
                value={formData.contact}
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

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/partners')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Partner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPartner;