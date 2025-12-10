
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { projectsAPI } from '../../services/api';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planned',
    location: '',
    manager: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsAPI.getById(id);
      const payload = res?.data?.data ?? res?.data ?? res;
      const project = payload?.project ?? payload;

      const managerField = project?.manager;
      const managerName =
        typeof managerField === 'object' && managerField !== null
          ? managerField.name || managerField.username || managerField.email || ''
          : managerField || '';

      setFormData({
        title: project?.title || '',
        description: project?.description || '',
        category: project?.category || 'education',
        startDate: project?.startDate ? String(project.startDate).slice(0, 10) : '',
        endDate: project?.endDate ? String(project.endDate).slice(0, 10) : '',
        budget: project?.budget !== undefined && project?.budget !== null ? String(project.budget) : '',
        status: project?.status || 'planned',
        location: project?.location || '',
        manager: managerName
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await projectsAPI.update(id, {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
      });
      toast.success('Project updated successfully!');
      navigate('/projects');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update project.'
      );
      toast.error(
        err.response?.data?.message || 'Failed to update project.'
      );
    } finally {
      setSaving(false);
    }
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
            onClick={() => window.location.reload()}
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
        <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
        <p className="text-gray-600 mt-2">Update project details</p>
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
                    placeholder="Describe the project..."
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
                {saving ? 'Saving...' : 'Update Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
