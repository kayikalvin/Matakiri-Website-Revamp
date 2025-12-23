import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programsAPI } from '../../services/api';
// Reverted: use original image URL handling in admin dashboard

// Backend enum values and user-friendly labels
const PROGRAM_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' }
];
const PROGRAM_CATEGORIES = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'water', label: 'Water' },
  { value: 'ai', label: 'AI' },
  { value: 'community', label: 'Community' }
];

const EditProgram = () => {
  // Get the id from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Debug: log the id
  // console.log('🔍 EditProgram - ID from URL params:', id);
  // console.log('🔍 EditProgram - Full URL:', window.location.href);
  
  const [form, setForm] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  // Helper to resolve admin image URLs (original behavior)
  const resolveAdminImage = (src) => {
    if (!src) return undefined;
    if (src.startsWith('http')) return src;
    let base = 'http://localhost:5000';
    try {
      if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) base = import.meta.env.VITE_API_URL;
    } catch (e) {
      // ignore and fall back to localhost
    }
    if (src.startsWith('/api/uploads')) return `${base}${src.replace('/api/uploads', '/uploads')}`;
    if (src.startsWith('/uploads')) return `${base}${src}`;
    return src;
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageAreaClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
  // console.log('🔍 EditProgram - useEffect triggered with id:', id);
  
  // Check if id exists before making API call
  if (!id) {
    console.error('❌ EditProgram - No ID provided in URL');
    setError('No program ID provided in URL');
    setLoading(false);
    navigate('/programs'); // Redirect to programs list
    return;
  }
  
  setLoading(true);
  // console.log('🔍 EditProgram - Starting to fetch program with ID:', id);
  
  programsAPI.getById(id)
    .then(response => {
      // console.log('✅ EditProgram - API response:', response);
      
      // Extract the actual program data from response.data.data
      const responseData = response.data || response;
      // console.log('✅ EditProgram - Response data structure:', responseData);
      
      // Get the actual program data (nested in data property)
      const programData = responseData.data || responseData;
      // console.log('✅ EditProgram - Program data to set:', programData);
      
      if (!programData) {
        throw new Error('No program data returned from API');
      }
      
      setForm(programData);
      setInitialData(programData);
      setLoading(false);
    })
    .catch(err => {
      console.error('❌ EditProgram - Error fetching program:', err);
      console.error('❌ EditProgram - Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to load program');
      setLoading(false);
    });
}, [id, navigate]);

  // useEffect(() => {
  //   console.log('📊 Form state updated:', form);
  // }, [form]);

  // useEffect(() => {
  //   console.log('📊 InitialData state updated:', initialData);
  // }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' && value ? value : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field] || !form) return '';
    const value = form[field];
    
    switch (field) {
      case 'title':
        if (!value?.trim()) return 'Title is required';
        if (value.length < 3) return 'Title must be at least 3 characters';
        if (value.length > 100) return 'Title is too long';
        break;
      case 'category':
        if (!value) return 'Category is required';
        break;
      case 'beneficiaries':
        if (value && isNaN(value)) return 'Must be a number';
        if (value && parseInt(value) < 0) return 'Must be positive';
        break;
      case 'duration':
        if (value && parseInt(value) <= 0) return 'Must be greater than 0';
        break;
      case 'description':
        if (value?.length > 1000) return 'Description too long';
        break;
      default:
        return '';
    }
    return '';
  };

  const isFormValid = () => {
    if (!form) return false;
    return (
      form?.title?.trim() &&
      form?.category &&
      !getFieldError('title') &&
      !getFieldError('category') &&
      !getFieldError('beneficiaries') &&
      !getFieldError('duration')
    );
  };

  const hasChanges = () => {
    if (!form || !initialData) return false;
    return JSON.stringify(form) !== JSON.stringify(initialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setTouched(Object.keys(form || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    setSaving(true);
    setError('');
    try {
      let dataToSend;
      if (imageFile) {
        dataToSend = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          dataToSend.append(key, value);
        });
        dataToSend.set('beneficiaries', form.beneficiaries ? parseInt(form.beneficiaries) : 0);
        dataToSend.set('duration', form.duration ? parseInt(form.duration) : 0);
        dataToSend.append('image', imageFile);
      } else {
        dataToSend = {
          ...form,
          beneficiaries: form.beneficiaries ? parseInt(form.beneficiaries) : 0,
          duration: form.duration ? parseInt(form.duration) : 0,
        };
      }
      await programsAPI.update(id, dataToSend);
      navigate('/programs', { state: { message: 'Program updated successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update program. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (label) => {
    const icons = {
      Agriculture: '🌾',
      Education: '📚',
      Health: '🏥',
      Water: '💧',
      AI: '🤖',
      Community: '🤝'
    };
    return icons[label] || '📋';
  };

  const renderInput = (name, label, type = 'text', placeholder = '', options = [], icon = null) => {
    if (!form) return null;
    
    const error = getFieldError(name);
    const isError = touched[name] && error;
    const isRequired = ['title', 'category'].includes(name);
    const hasChanged = initialData && form && form[name] !== initialData[name];
    const value = form[name] || '';
    
    return (
      <div className="group">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
          {hasChanged && (
            <span className="ml-2 text-xs text-amber-600 font-medium">• Modified</span>
          )}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          {type === 'select' ? (
            <select
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 appearance-none cursor-pointer font-medium ${
                isError
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : hasChanged
                  ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 hover:border-amber-400'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 hover:border-gray-300'
              }`}
              required={isRequired}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {name === 'category' ? `${getCategoryIcon(option.label)} ${option.label}` : option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={5}
              className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 resize-none ${
                isError
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : hasChanged
                  ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 hover:border-amber-400'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 hover:border-gray-300'
              }`}
              maxLength={1000}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 ${
                isError
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : hasChanged
                  ? 'border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 hover:border-amber-400'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 hover:border-gray-300'
              }`}
              required={isRequired}
            />
          )}
          {type === 'select' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
        {isError && (
          <div className="mt-2 flex items-start gap-2 text-red-600 animate-in slide-in-from-top-1">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {name === 'description' && (
          <div className="mt-2 flex justify-between items-center text-xs">
            <span className="text-gray-500">Provide detailed information about the program</span>
            <span className={`font-medium ${(form.description?.length || 0) > 900 ? 'text-amber-600' : 'text-gray-500'}`}>
              {form.description?.length || 0}/1000
            </span>
          </div>
        )}
      </div>
    );
  };

  // Show error if no ID
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Program</h2>
          <p className="text-gray-600 mb-6">No program ID specified in the URL</p>
          <button
            onClick={() => navigate('/programs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading program details...</p>
          <p className="text-gray-400 text-sm mt-2">Program ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Program</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-400 text-sm mb-6">Program ID: {id}</p>
          <button
            onClick={() => navigate('/programs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Program Not Found</h2>
          <p className="text-gray-600 mb-6">The program with ID {id} could not be found</p>
          <button
            onClick={() => navigate('/programs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/programs')}
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Programs</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
              <p className="text-gray-600 mt-1">Update program information and details</p>
            </div>
          </div>
          
          {hasChanges() && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-amber-900">You have unsaved changes</span>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-red-500 p-5 m-6 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
               </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Error Updating Program</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Program Image</label>
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50 hover:border-purple-400'}`}
                  onClick={handleImageAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ minHeight: '120px' }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={inputRef}
                    className="hidden"
                  />
                  {imageFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-24 rounded shadow object-contain" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setImageFile(null); }}
                        className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : form?.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={resolveAdminImage(form.image)} alt="Current" className="h-24 rounded shadow object-contain" onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, image: '' })); }}
                        className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4m6 5a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h6z" />
                      </svg>
                      <span className="text-sm">Drag & drop or click to upload</span>
                    </div>
                  )}
                  {dragActive && (
                    <div className="absolute inset-0 bg-purple-100/50 rounded-xl pointer-events-none" />
                  )}
                </div>
              </div>
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                </div>
                
                {renderInput('title', 'Program Title', 'text', 'Enter a clear, descriptive program title', [], 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('category', 'Category', 'select', '', PROGRAM_CATEGORIES,
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  
                  {renderInput('status', 'Status', 'select', '', PROGRAM_STATUSES,
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Program Metrics Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Program Metrics</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('beneficiaries', 'Number of Beneficiaries', 'number', 'Estimated count', [],
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  
                  {renderInput('duration', 'Duration (months)', 'number', 'Program length', [],
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h6z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Program Details</h2>
                </div>
                
                {renderInput('description', 'Description', 'textarea', 'Describe the program objectives, target audience, key activities, expected outcomes, and impact...')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/programs')}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-4 focus:ring-gray-100"
                disabled={saving}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving || !isFormValid() || !hasChanges()}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-w-[180px] ${
                  saving || !isFormValid() || !hasChanges()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 focus:ring-4 focus:ring-purple-200'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;