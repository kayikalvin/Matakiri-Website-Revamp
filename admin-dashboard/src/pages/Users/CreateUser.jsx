import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlusIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'editor',
    department: '',
    position: '',
    bio: '',
  });
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: 'None' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { score, label: labels[score] };
  };
  const strength = passwordStrength(passwords.password);

  const isFormValid = () =>
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    passwords.password.length >= 6 &&
    passwords.password === passwords.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }
    if (passwords.password.length < 6) {
      setError('Password must be at least 6 characters.');
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await usersAPI.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: passwords.password,
        department: formData.department,
        position: formData.position,
        bio: formData.bio,
      });
      toast.success('User created successfully!');
      navigate('/users');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', placeholder = '', options = null, rows = 0) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label} {['name', 'email'].includes(name) && <span className="text-laterite-500">*</span>}
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
          rows={rows || 3}
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

  // Custom footer with info text
  const footerChildren = (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-4 border-t border-border">
      <div className="text-xs text-ink-500 flex items-center gap-2">
        <InformationCircleIcon className="h-4 w-4" />
        All fields marked with * are required
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate('/users')}
          disabled={loading}
          className="px-4 py-2 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-soil-900 text-parchment-50 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create User'}
        </button>
      </div>
    </div>
  );

  return (
    <FormShell
      title="Add New User"
      subtitle="Create a new user account with specific permissions"
      backPath="/users"
      error={error}
      loading={loading}
      isValid={isFormValid()}
      onSubmit={handleSubmit}
      submitLabel=""
      footerChildren={footerChildren}
    >
      {/* Info banner */}
      <div className="border border-border bg-parchment-50 p-4 text-xs text-ink-500 flex items-start gap-2">
        <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>Fields marked with <span className="text-laterite-500">*</span> are required. An email verification link may be sent.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic info column */}
        <div className="lg:col-span-2 space-y-8">
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('name', 'Full Name')}
              {renderInput('email', 'Email Address', 'email', 'user@matakiritrust.org')}
              {renderInput('phone', 'Phone Number', 'tel', '+254...')}
              {renderInput('position', 'Position / Title', 'text', 'e.g., Manager')}
            </div>
            {renderInput('department', 'Department', 'select', '', [
              { value: '', label: 'None' },
              { value: 'Administration', label: 'Administration' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Sales', label: 'Sales' },
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Support', label: 'Support' },
              { value: 'Finance', label: 'Finance' },
              { value: 'HR', label: 'Human Resources' },
              { value: 'Other', label: 'Other' },
            ])}
            {renderInput('bio', 'Bio / Description', 'textarea', 'Brief description…', null, 3)}
          </FormSection>
        </div>

        {/* Permissions & Password column */}
        <div className="space-y-8">
          <FormSection title="Account & Security">
            <div className="space-y-4">
              {renderInput('role', 'Role', 'select', '', [
                { value: 'viewer', label: 'Viewer (Read only)' },
                { value: 'editor', label: 'Editor (Create & Edit)' },
                { value: 'admin', label: 'Administrator (Full access)' },
                { value: 'manager', label: 'Manager (Team management)' },
              ])}
              
              {/* Role descriptions */}
              <div className="text-xs space-y-2 mt-2">
                {[
                  { role: 'viewer', title: 'Viewer', desc: 'Can only view content, no editing rights' },
                  { role: 'editor', title: 'Editor', desc: 'Can create and edit content, moderate comments' },
                  { role: 'admin', title: 'Administrator', desc: 'Full system access including user management' },
                  { role: 'manager', title: 'Manager', desc: 'Can manage team members and moderate content' },
                ].map(r => (
                  <div
                    key={r.role}
                    className={`border p-3 ${formData.role === r.role ? 'border-laterite-500/50 bg-laterite-50' : 'border-border'}`}
                  >
                    <div className="font-medium text-ink-800">{r.title}</div>
                    <div className="text-ink-500 mt-0.5">{r.desc}</div>
                  </div>
                ))}
              </div>

              {/* Password fields */}
              <div className="pt-4 border-t border-border space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
                  Password <span className="text-laterite-500">*</span>
                </h4>
                <div className="relative">
                  <label className="block text-xs text-ink-500 mb-1">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    placeholder="Create a strong password"
                    className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 -translate-y-1/2 text-ink-500 hover:text-ink-800"
                  >
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-ink-500 mb-1">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your password"
                    className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
                  />
                </div>

                {/* Strength indicator */}
                {passwords.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-500">Strength</span>
                      <span className={`font-semibold ${
                        strength.score >= 3 ? 'text-acacia-600' : strength.score >= 2 ? 'text-maize-600' : 'text-laterite-600'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink-500/10">
                      <div
                        className={`h-full transition-all ${
                          strength.score >= 3 ? 'bg-acacia-500' : strength.score >= 2 ? 'bg-maize-500' : 'bg-laterite-500'
                        }`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                    <ul className="text-xs text-ink-500 space-y-0.5 list-disc list-inside">
                      <li className={passwords.password.length >= 8 ? 'text-acacia-600' : ''}>At least 8 characters</li>
                      <li className={/[A-Z]/.test(passwords.password) ? 'text-acacia-600' : ''}>One uppercase letter</li>
                      <li className={/[0-9]/.test(passwords.password) ? 'text-acacia-600' : ''}>One number</li>
                      <li className={/[^A-Za-z0-9]/.test(passwords.password) ? 'text-acacia-600' : ''}>One special character</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </FormSection>
        </div>
      </div>
    </FormShell>
  );
};

export default CreateUser;