import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsAPI } from '../../services/api';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const PROGRAM_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];
const PROGRAM_CATEGORIES = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'water', label: 'Water' },
  { value: 'ai', label: 'AI' },
  { value: 'community', label: 'Community' },
];

const CreateProgram = () => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    status: 'planning',
    beneficiaries: '',
    duration: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const getFieldError = (fieldName) => {
    if (!touched[fieldName]) return '';
    const value = form[fieldName];
    switch (fieldName) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title must be less than 100 characters';
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
        if (value.length > 1000) return 'Description too long';
        break;
      default:
        return '';
    }
    return '';
  };

  const isFormValid = () => {
    return (
      form.title.trim() &&
      form.category &&
      !getFieldError('title') &&
      !getFieldError('category') &&
      !getFieldError('beneficiaries') &&
      !getFieldError('duration')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    setLoading(true);
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
      await programsAPI.create(dataToSend);
      navigate('/programs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create program.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', placeholder = '', options = []) => {
    const error = getFieldError(name);
    const hasError = touched[name] && error;

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
          {label} {['title', 'category'].includes(name) && <span className="text-laterite-500">*</span>}
        </label>
        {type === 'select' ? (
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
            className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 appearance-none outline-none transition-colors ${
              hasError ? 'border-status-danger' : 'border-border focus:border-laterite-500'
            }`}
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <div className="relative">
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
              placeholder={placeholder}
              rows={5}
              maxLength={1000}
              className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 resize-none outline-none transition-colors ${
                hasError ? 'border-status-danger' : 'border-border focus:border-laterite-500'
              }`}
            />
            <span className="absolute bottom-2 right-3 text-xs font-mono text-ink-500">{form.description.length}/1000</span>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
            placeholder={placeholder}
            className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors ${
              hasError ? 'border-status-danger' : 'border-border focus:border-laterite-500'
            }`}
          />
        )}
        {hasError && (
          <p className="text-xs text-status-danger">{error}</p>
        )}
      </div>
    );
  };

  return (
    <FormShell
      title="Create Program"
      subtitle="Set up a new program with detailed information"
      backPath="/programs"
      error={error}
      loading={loading}
      isValid={isFormValid()}
      onSubmit={handleSubmit}
      submitLabel="Create Program"
      imageFile={imageFile}
      setImageFile={setImageFile}
    >
      {/* Basic Information */}
      <FormSection title="Basic Information">
        {renderInput('title', 'Program Title', 'text', 'Enter a clear, descriptive program title')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('category', 'Category', 'select', '', PROGRAM_CATEGORIES)}
          {renderInput('status', 'Status', 'select', '', PROGRAM_STATUSES)}
        </div>
      </FormSection>

      {/* Program Metrics */}
      <FormSection title="Program Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('beneficiaries', 'Number of Beneficiaries', 'number', 'Estimated count')}
          {renderInput('duration', 'Duration (months)', 'number', 'Program length')}
        </div>
      </FormSection>

      {/* Details */}
      <FormSection title="Program Details">
        {renderInput('description', 'Description', 'textarea', 'Describe the program objectives, target audience, key activities, expected outcomes, and impact...')}
      </FormSection>
    </FormShell>
  );
};

export default CreateProgram;