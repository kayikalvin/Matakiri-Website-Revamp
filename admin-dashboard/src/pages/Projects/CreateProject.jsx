import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiSave,
  FiX,
  FiUpload,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiFolder,
  FiImage,
  FiGlobe,
  FiActivity,
  FiChevronLeft,
  FiTrash2,
  FiPlus,
  FiInfo,
  FiCheck
} from 'react-icons/fi';
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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFiles = (files) => {
    const max = 5;
    const existing = imagesFiles.slice();
    let addedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      if (existing.length >= max) {
        toast.error(`Maximum ${max} images allowed`);
        break;
      }
      const f = files[i];
      if (!f.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        continue;
      }
      existing.push(f);
      addedCount++;
    }
    
    setImagesFiles(existing);
    if (addedCount > 0) {
      toast.success(`${addedCount} image(s) added`);
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index) => {
    setImagesFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      toast.success('Image removed');
      return updated;
    });
  };

  // Generate previews and cleanup
  useEffect(() => {
    previews.forEach(url => URL.revokeObjectURL(url));
    const urls = imagesFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [imagesFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { slug, ...payload } = formData;
      const res = await projectsAPI.create(payload);
      const projectId = res?.data?.data?._id || res?.data?.data?.id;

      clearInterval(progressInterval);
      setProgress(100);

      // Upload images if selected
      if (imagesFiles.length > 0 && projectId) {
        const form = new FormData();
        imagesFiles.forEach((file) => form.append('images', file));
        await projectsAPI.uploadImages(projectId, form);
      }

      toast.success('Project created successfully!');
      setTimeout(() => navigate('/projects'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
      toast.error('Failed to create project');
      setProgress(0);
    } finally {
      setSaving(false);
    }
  };

  const formatBudget = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const categoryIcons = {
    education: '📚',
    health: '🏥',
    agriculture: '🌾',
    infrastructure: '🏗️',
    environment: '🌿',
    livelihood: '💼'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 md:p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '0.5rem',
          },
        }}
      />
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <FiChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Create New Project</h1>
              <p className="text-emerald-100 text-lg">Start a new community development initiative</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <FiInfo className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">Step 1 of 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FiFolder className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
                      <p className="text-sm text-gray-600">Basic information about your project</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                      placeholder="Enter a descriptive project title"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-gray-800 placeholder-gray-500"
                      placeholder="Describe project objectives, activities, expected outcomes, and community impact..."
                    />
                    <p className="text-xs text-gray-500 mt-2">Minimum 50 characters recommended</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all bg-white"
                        >
                          {Object.entries(categoryIcons).map(([value, icon]) => (
                            <option key={value} value={value}>
                              {icon} {value.charAt(0).toUpperCase() + value.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none">
                          <FiChevronLeft className="w-5 h-5 text-gray-400 transform rotate-90" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Project Manager
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          name="manager"
                          value={formData.manager}
                          onChange={handleChange}
                          className="w-full pl-11 p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Enter manager's name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FiImage className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Project Images</h2>
                      <p className="text-sm text-gray-600">Add visual documentation (up to 5 images)</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Upload Area */}
                  <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
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
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                      <FiUpload className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {isDragging ? '🎉 Drop to upload!' : 'Upload Project Images'}
                    </h3>
                    <p className="text-gray-600 mb-3">Drag & drop images or click to browse files</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                      <FiCheck className="w-4 h-4" />
                      <span>Supports JPG, PNG, GIF (Max 5MB each)</span>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm text-gray-600">
                          <span className="font-bold text-gray-800">{imagesFiles.length}/5</span> images selected
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previews.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Selected Images</h3>
                        <span className="text-sm text-gray-600">
                          {previews.length} of 5
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {previews.map((src, i) => (
                          <div key={i} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                              <img 
                                src={src} 
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg"
                              aria-label="Remove image"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                              {i + 1}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add More Button */}
                        {imagesFiles.length < 5 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <FiPlus className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-blue-600">Add More</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Timeline Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FiCalendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Timeline</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Start Date *
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      End Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full pl-11 p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FiDollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Budget</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Estimated Budget (KES)
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-11 p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter amount"
                      min="0"
                      step="1000"
                    />
                  </div>
                  {formData.budget && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <p className="text-sm text-gray-600 mb-1">Formatted amount:</p>
                      <p className="text-xl font-bold text-emerald-700">
                        {formatBudget(Number(formData.budget))}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Status Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-sm">
                      <FiGlobe className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Location & Status</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Location *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Project location"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Status *
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all bg-white"
                      >
                        <option value="planning">📋 Planning Phase</option>
                        <option value="active">🚀 Active (Ongoing)</option>
                        <option value="completed">✅ Completed</option>
                        <option value="paused">⏸️ Paused</option>
                      </select>
                      <div className="absolute right-3.5 top-3.5 pointer-events-none">
                        <FiChevronLeft className="w-5 h-5 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  {/* Progress Bar */}
                  {saving && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Creating Project...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-white text-lg">Project Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300">
                          Category: <span className="font-medium text-white">{formData.category}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300">
                          Images: <span className="font-medium text-white">{imagesFiles.length} selected</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300">
                          Status: <span className="font-medium text-white">{formData.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5" />
                          Create Project
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => navigate('/projects')}
                      className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-600"
                    >
                      <FiX className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;