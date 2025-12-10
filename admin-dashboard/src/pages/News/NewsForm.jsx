import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { newsAPI } from '../../services/api';

const NewsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    status: 'draft',
    featuredImage: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await newsAPI.create(formData);
      toast.success('News article saved successfully!');
      setSaving(false);
      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save news');
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    setSaving(true);
    setError(null);
    try {
      await newsAPI.create({ ...formData, status: 'published' });
      toast.success('Article published!');
      setSaving(false);
      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to publish news');
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 text-center text-red-500">{error}</div>
      )}
      <Toaster />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create News Article</h1>
        <p className="text-gray-600 mt-2">Write and publish news content</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter news title"
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="12"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Write your news content here..."
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Summary)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief summary of the article"
                />
              </div>
            </div>

            {/* Sidebar - Settings */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Draft</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="general">General</option>
                  <option value="projects">Projects</option>
                  <option value="events">Events</option>
                  <option value="announcements">Announcements</option>
                  <option value="success-stories">Success Stories</option>
                </select>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm text-gray-600 mb-2">Upload featured image</p>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Select Image
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/news')}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;
