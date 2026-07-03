import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { partnersAPI } from '../../services/api';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const EditPartner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'NGO',
    description: '',
    country: 'Kenya',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    status: 'active',
    since: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Fetch partner
  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await partnersAPI.getById(id);
        const data = res?.data?.data ?? res?.data?.partner ?? res?.data;
        const partner = data ?? res?.data;
        const mapped = {
          name: partner.name || '',
          type: partner.type || 'NGO',
          description: partner.description || '',
          country: partner.country || 'Kenya',
          contactName: partner.contactPerson?.name || partner.contact || '',
          contactEmail: partner.contactPerson?.email || partner.email || '',
          contactPhone: partner.contactPerson?.phone || '',
          website: partner.website || '',
          status: partner.isActive === true || partner.status === 'active' ? 'active' : 'inactive',
          since: partner.partnershipStart ? new Date(partner.partnershipStart).toISOString().slice(0, 10) : '',
        };
        setFormData(mapped);
        setInitialData(mapped);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load partner');
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return (
      JSON.stringify(formData) !== JSON.stringify(initialData) ||
      logoFile !== null
    );
  };

  const isFormValid = () => {
    return formData.name.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setSaving(true);
    setError(null);
    try {
      let payload = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        country: formData.country,
        website: formData.website,
        isActive: formData.status === 'active',
        contactPerson: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        partnershipStart: formData.since ? new Date(formData.since) : undefined,
      };

      if (logoFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, val]) => {
          if (key === 'contactPerson') {
            form.append('contactName', val.name || '');
            form.append('contactEmail', val.email || '');
            form.append('contactPhone', val.phone || '');
          } else if (val !== undefined) {
            form.append(key, val);
          }
        });
        form.append('logo', logoFile);
        await partnersAPI.update(id, form);
      } else {
        await partnersAPI.update(id, payload);
      }
      navigate('/partners');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update partner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center py-16 text-ink-500 font-mono text-sm">
        Loading partner…
      </div>
    );
  }

  const renderInput = (name, label, type = 'text', placeholder = '', options = null) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label} {['name'].includes(name) && <span className="text-laterite-500">*</span>}
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
      title="Edit Partner"
      subtitle={`Editing: ${formData.name || 'Partner'}`}
      backPath="/partners"
      error={error}
      loading={saving}
      isValid={isFormValid() && hasChanges()}
      onSubmit={handleSubmit}
      submitLabel="Update Partner"
      imageFile={logoFile}
      setImageFile={setLogoFile}
    >
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
        {renderInput('since', 'Partner Since', 'date')}
      </FormSection>

      <FormSection title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('contactName', 'Contact Person')}
          {renderInput('contactEmail', 'Email Address', 'email')}
        </div>
        {renderInput('contactPhone', 'Phone Number', 'tel')}
      </FormSection>

      <FormSection title="Additional Information">
        {renderInput('website', 'Website', 'url', 'https://example.com')}
        {renderInput('description', 'Description', 'textarea', 'Brief description of the partner organization…')}
      </FormSection>
    </FormShell>
  );
};

export default EditPartner;