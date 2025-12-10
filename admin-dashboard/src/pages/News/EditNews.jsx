import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, NewspaperIcon, PencilIcon } from '@heroicons/react/24/outline';

import { newsAPI } from '../../services/api';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Education',
    status: 'draft',
    tags: ''
  });

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsAPI.getById(id);
        const resData = res?.data;
        // normalize possible shapes: { data: {...} } | { news: {...} } | direct object
        const news = resData?.data ?? resData?.news ?? resData;
        setFormData({
          id: news._id || news.id,
          title: news.title || '',
          content: news.content || '',
          category: news.category || '',
          status: news.status || '',
          tags: Array.isArray(news.tags) ? news.tags.join(', ') : (news.tags || ''),
          // normalize author: backend may return an object or an id/string
          author: typeof news.author === 'object' ? (news.author.name || news.author.email || news.author._id) : (news.author || ''),
          publishedDate: news.publishedDate || '',
          views: news.views || 0,
          // optional fields
          thumbnail: news.thumbnail || news.image || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Prepare tags as array if needed
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
      };
      await newsAPI.update(id, payload);
      setLoading(false);
      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update news');
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
          onClick={() => navigate('/news')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to News
        </button>
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <PencilIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit News Article</h1>
            <p className="text-gray-600 mt-2">Update article details</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Article Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Article ID</p>
                <p className="font-medium">{formData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-medium">{formData.author}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Published Date</p>
                <p className="font-medium">{formData.publishedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Views</p>
                <p className="font-medium">{formData.views.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows="10"
                required
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Events">Events</option>
                <option value="Partners">Partners</option>
                <option value="Reports">Reports</option>
                <option value="Projects">Projects</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
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
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/news')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNews;