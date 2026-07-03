import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnersAPI } from '../../services/api';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const CreatePartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'NGO',
    description: '',
    country: 'Kenya',
    contact: '',
    email: '',
    website: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.contact.trim() !== '' && formData.email.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);
    setError(null);
    try {
      let payload = { ...formData };
      if (logoFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
        form.append('logo', logoFile);
        await partnersAPI.create(form);
      } else {
        await partnersAPI.create(payload);
      }
      navigate('/partners');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create partner');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', placeholder = '', options = null) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label} <span className="text-laterite-500">*</span>
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 resize-none outline-none focus:border-laterite-500 transition-colors"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
        />
      )}
    </div>
  );

  return (
    <FormShell
      title="Add New Partner"
      subtitle="Register a new partner organization"
      backPath="/partners"
      error={error}
      loading={loading}
      isValid={isFormValid()}
      onSubmit={handleSubmit}
      submitLabel="Create Partner"
      imageFile={logoFile}
      setImageFile={setLogoFile}
    >
      {/* Basic Information */}
      <FormSection title="Basic Information">
        {renderInput('name', 'Organization Name', 'text', 'Enter organization name')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('type', 'Organization Type', 'select', '', [
            { value: 'NGO', label: 'NGO' },
            { value: 'Corporate', label: 'Corporate' },
            { value: 'Government', label: 'Government Agency' },
            { value: 'Health Organization', label: 'Health Organization' },
            { value: 'Educational', label: 'Educational Institution' },
            { value: 'Other', label: 'Other' },
          ])}
          {renderInput('country', 'Country', 'select', '', [
            { value: 'Kenya', label: 'Kenya' },
            { value: 'Tanzania', label: 'Tanzania' },
            { value: 'Uganda', label: 'Uganda' },
            { value: 'Rwanda', label: 'Rwanda' },
            { value: 'Burundi', label: 'Burundi' },
            { value: 'Ethiopia', label: 'Ethiopia' },
            { value: 'Other', label: 'Other' },
          ])}
        </div>
        {renderInput('status', 'Status', 'select', '', [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ])}
      </FormSection>

      {/* Contact Details */}
      <FormSection title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('contact', 'Contact Number', 'tel', '+254112727453')}
          {renderInput('email', 'Email Address', 'email', 'contact@organization.org')}
        </div>
        {renderInput('website', 'Website', 'url', 'https://www.organization.org')}
      </FormSection>

      {/* Description */}
      <FormSection title="Description">
        {renderInput('description', 'Organization Description', 'textarea', 'Describe the organization, its mission, and areas of focus...')}
      </FormSection>
    </FormShell>
  );
};

export default CreatePartner;