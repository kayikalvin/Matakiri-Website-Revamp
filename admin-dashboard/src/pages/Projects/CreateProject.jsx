import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { projectsAPI } from '../../services/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    location: '',
    manager: ''
  });
  const [saving, setSaving] = useState(false);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files) => {
    const max = 5;
    const existing = imagesFiles.slice();
    for (let i = 0; i < files.length; i++) {
      if (existing.length >= max) break;
      const f = files[i];
      if (!f.type.startsWith('image/')) continue;
      existing.push(f);
    }
    setImagesFiles(existing);
  };

  // Drag & drop handlers
  const onDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = Array.from(dt.files || []);
    addFiles(files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (index) => {
    setImagesFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generate previews and cleanup
  useEffect(() => {
    // Revoke old previews
    previews.forEach(url => URL.revokeObjectURL(url));
    const urls = imagesFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesFiles]);

  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Remove slug if present, let backend generate it
      const { slug, ...payload } = formData;
      const res = await projectsAPI.create(payload);
      const projectId = res?.data?.data?._id || res?.data?.data?.id;

      // If images selected, upload them to the project
      if (imagesFiles && imagesFiles.length && projectId) {
        const form = new FormData();
        imagesFiles.forEach((file) => form.append('images', file));
        await projectsAPI.uploadImages(projectId, form);
      }

      toast.success('Project created successfully!');
      setSaving(false);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
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
        <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
        <p className="text-gray-600 mt-2">Add a new community development project</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Project Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Describe the project objectives, activities, and expected outcomes..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="environment">Environment</option>
                      <option value="livelihood">Livelihood</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Manager
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Assign project manager"
                    />
                  </div>
                </div>
              </div>
            </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Images</h3>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="border-dashed border-2 border-gray-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="font-medium text-gray-700">Drag & drop images here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-1">Up to 5 images. Images upload after project creation.</p>
                  </div>
                </div>

                {previews && previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`preview-${i}`} className="w-full h-32 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* Timeline & Budget */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline & Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (KSH)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Estimated budget"
                  />
                </div>
              </div>
            </div>

            {/* Location & Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Project location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
