import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { galleryAPI } from '../../services/api';

const UploadMedia = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      files.forEach((file) => {
        data.append('files', file);
      });
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);

      await galleryAPI.upload(data);
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      setUploading(false);
      // dispatch a refresh event so the Gallery list can reload without relying on navigation
      try {
        window.dispatchEvent(new Event('gallery:refresh'));
      } catch (e) {
        // ignore if event dispatch fails in some environments
      }
      navigate('/gallery');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <Toaster />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Media</h1>
        <p className="text-gray-600 mt-2">Add new images or documents to the gallery</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* File Upload Area */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Files</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600 mb-2">Drag & drop files here or</p>
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer"
              >
                Browse Files
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: JPG, PNG, GIF, PDF (Max 10MB each)
              </p>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Selected Files ({files.length})</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center">
                        <span className="mr-3">📄</span>
                        <span>{file.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Media Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Media Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter media title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter description (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="general">General</option>
                  <option value="projects">Projects</option>
                  <option value="events">Events</option>
                  <option value="reports">Reports</option>
                  <option value="people">People</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMedia;
