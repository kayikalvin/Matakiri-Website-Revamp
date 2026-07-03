import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Fetch program
  useEffect(() => {
    if (!id) {
      setError('No program ID provided');
      setLoading(false);
      navigate('/programs');
      return;
    }
    programsAPI.getById(id)
      .then(res => {
        const data = res.data?.data || res.data;
        if (!data) throw new Error('No program data');
        setForm(data);
        setInitialData(data);
      })
      .catch(err => setError(err.response?.data?.message || err.message || 'Failed to load program'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field] || !form) return '';
    const value = form[field];
    switch (field) {
      case 'title':
        if (!value?.trim()) return 'Title is required';
        if (value.length < 3) return 'Min 3 characters';
        if (value.length > 100) return 'Too long';
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
        if (value?.length > 1000) return 'Too long';
        break;
    }
    return '';
  };

  const isFormValid = () =>
    form?.title?.trim() &&
    form?.category &&
    !getFieldError('title') &&
    !getFieldError('category') &&
    !getFieldError('beneficiaries') &&
    !getFieldError('duration');

  const hasChanges = () => form && initialData && JSON.stringify(form) !== JSON.stringify(initialData) || imageFile !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
      return;
    }
    setSaving(true);
    setError('');
    try {
      let dataToSend;
      if (imageFile) {
        dataToSend = new FormData();
        Object.entries(form).forEach(([k, v]) => dataToSend.append(k, v));
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
      navigate('/programs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update program.');
    } finally {
      setSaving(false);
    }
  };

  // Loading / error / missing states handled inside FormShell or via early return
  if (loading || !form) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
        {loading ? (
          <div className="text-center py-16 text-ink-500 font-mono text-sm">Loading program…</div>
        ) : error ? (
          <div className="text-center py-16 text-status-danger font-mono text-sm">{error}</div>
        ) : (
          <div className="text-center py-16 text-ink-500 font-mono text-sm">Program not found</div>
        )}
        <button onClick={() => navigate('/programs')} className="mt-4 text-laterite-500 underline text-xs">Back to Programs</button>
      </div>
    );
  }

  const renderInput = (name, label, type = 'text', placeholder = '', options = []) => {
    const error = getFieldError(name);
    const hasError = touched[name] && error;
    const modified = initialData && form[name] !== initialData[name];

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
          {label}
          {['title', 'category'].includes(name) && <span className="text-laterite-500"> *</span>}
          {modified && <span className="ml-2 text-[10px] text-maize-600 font-mono">• modified</span>}
        </label>
        {type === 'select' ? (
          <select
            name={name}
            value={form[name] || ''}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
            className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors ${
              hasError ? 'border-status-danger' : modified ? 'border-maize-400' : 'border-border focus:border-laterite-500'
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
              value={form[name] || ''}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
              placeholder={placeholder}
              rows={5}
              maxLength={1000}
              className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 resize-none outline-none transition-colors ${
                hasError ? 'border-status-danger' : modified ? 'border-maize-400' : 'border-border focus:border-laterite-500'
              }`}
            />
            <span className="absolute bottom-2 right-3 text-xs font-mono text-ink-500">
              {(form[name]?.length || 0)}/1000
            </span>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name] || ''}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, [name]: true }))}
            placeholder={placeholder}
            className={`w-full border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors ${
              hasError ? 'border-status-danger' : modified ? 'border-maize-400' : 'border-border focus:border-laterite-500'
            }`}
          />
        )}
        {hasError && <p className="text-xs text-status-danger">{error}</p>}
      </div>
    );
  };

  return (
    <FormShell
      title="Edit Program"
      subtitle={`Updating: ${form.title || 'Program'}`}
      backPath="/programs"
      error={error}
      loading={saving}
      isValid={isFormValid() && hasChanges()}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      imageFile={imageFile}
      setImageFile={setImageFile}
    >
      <FormSection title="Basic Information">
        {renderInput('title', 'Program Title', 'text', 'Enter title')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('category', 'Category', 'select', '', PROGRAM_CATEGORIES)}
          {renderInput('status', 'Status', 'select', '', PROGRAM_STATUSES)}
        </div>
      </FormSection>

      <FormSection title="Program Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('beneficiaries', 'Number of Beneficiaries', 'number', 'Estimated count')}
          {renderInput('duration', 'Duration (months)', 'number', 'Program length')}
        </div>
      </FormSection>

      <FormSection title="Program Details">
        {renderInput('description', 'Description', 'textarea', 'Describe objectives, activities, outcomes…')}
      </FormSection>
    </FormShell>
  );
};

export default EditProgram;