import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'editor',
    isActive: true,
    department: '',
    position: '',
    bio: '',
  });
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ createdAt: '', lastLogin: '', activityCount: 0 });

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      // Restore original data extraction logic
      const res = await usersAPI.getById(id);
      const resData = res?.data;
      const user = resData?.data ?? resData?.user ?? resData;

      const departmentObj = user?.department;
      const departmentName =
        departmentObj && typeof departmentObj === 'object'
          ? departmentObj.name || ''
          : departmentObj || '';

      const managerObj = user?.manager;
      const managerName =
        managerObj && typeof managerObj === 'object'
          ? managerObj.name || managerObj.email || ''
          : managerObj || '';

      const avatarObj = user?.avatar;
      const avatarUrl =
        avatarObj && typeof avatarObj === 'object'
          ? avatarObj.url || avatarObj.path || ''
          : avatarObj || '';

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'editor',
        isActive: user.isActive === true || user.isActive === 'true',
        department: departmentName,
        position: user.position || '',
        bio: user.bio || '',
      });

      setUserStats({
        createdAt: user.createdAt || '',
        lastLogin: user.lastLogin || user.updatedAt || '',
        activityCount: user.activityCount || 0,
      });
    } catch (err) {
      console.error('Fetch user failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load user.');
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/users');
      return;
    }
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = () => formData.name.trim() !== '' && formData.email.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (passwords.password || passwords.confirmPassword) {
        if (passwords.password !== passwords.confirmPassword) throw new Error('Passwords do not match');
        if (passwords.password.length < 6) throw new Error('Password must be at least 6 characters');
      }
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: !!formData.isActive,
        department: formData.department,
        position: formData.position,
        bio: formData.bio,
      };
      if (passwords.password) payload.password = passwords.password;
      await usersAPI.update(id, payload);
      toast.success('User updated');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 text-center py-16 text-ink-500 font-mono text-sm">
        Loading user…
      </div>
    );
  }

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

  return (
    <FormShell
      title="Edit User"
      subtitle={`Editing: ${formData.name || 'User'}`}
      backPath="/users"
      error={error}
      loading={submitting}
      isValid={isFormValid()}
      onSubmit={handleSubmit}
      submitLabel="Update User"
    >
      <div className="border border-border bg-parchment-50 p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-laterite-100 border border-laterite-500/30 flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-laterite-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-ink-800">{formData.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-ink-500 font-mono">
            <span className="flex items-center gap-1"><EnvelopeIcon className="h-3.5 w-3.5" />{formData.email}</span>
            {formData.phone && <span className="flex items-center gap-1"><PhoneIcon className="h-3.5 w-3.5" />{formData.phone}</span>}
            <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />Joined {formatDate(userStats.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('name', 'Full Name')}
              {renderInput('email', 'Email Address', 'email')}
              {renderInput('phone', 'Phone Number', 'tel')}
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

        <div className="space-y-8">
          <FormSection title="Permissions & Security">
            {renderInput('role', 'Role', 'select', '', [
              { value: 'viewer', label: 'Viewer (Read only)' },
              { value: 'editor', label: 'Editor (Create & Edit)' },
              { value: 'admin', label: 'Administrator (Full access)' },
              { value: 'manager', label: 'Manager (Team management)' },
            ])}
            <p className="text-xs text-ink-500 -mt-2">
              {formData.role === 'viewer' && 'Can only view content'}
              {formData.role === 'editor' && 'Can create and edit content'}
              {formData.role === 'admin' && 'Full system access including user management'}
              {formData.role === 'manager' && 'Can manage team members and moderate content'}
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Account Status</label>
              <select
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </FormSection>

          <FormSection title="Change Password (optional)">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={passwords.password}
                  onChange={handlePasswordChange}
                  placeholder="Leave blank to keep current"
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
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-ink-500 border border-border bg-parchment-50 p-3">
                <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Password must be at least 6 characters. Leave blank to keep current.
              </div>
            </div>
          </FormSection>

          <FormSection title="User Statistics">
            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-ink-500">Member since</span><span className="text-ink-800">{formatDate(userStats.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Last login</span><span className="text-ink-800">{userStats.lastLogin ? formatDate(userStats.lastLogin) : 'Never'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Activities</span><span className="text-ink-800">{userStats.activityCount.toLocaleString()}</span></div>
            </div>
          </FormSection>
        </div>
      </div>
    </FormShell>
  );
};

export default EditUser;