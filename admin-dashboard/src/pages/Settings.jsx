import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import { themesAPI } from '../services/api';
import {
  UserCircleIcon,
  BellIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { applyThemeToRoot } from '../utils/theme';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    newsletter: false,
    theme: 'light'
  });
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    primaryColor: '#B5522E',       // laterite
    secondaryColor: '#9A4526',     // laterite-600
    accentColor: '#4F7942',        // acacia
    textColor: '#2B2620',          // ink-800
    backgroundColor: '#F7F3EA'     // parchment-50
  });
  const [editingId, setEditingId] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  useEffect(() => { fetchThemes(); fetchActiveTheme(); }, []);

  const fetchThemes = async () => {
    setLoadingThemes(true);
    try {
      const res = await themesAPI.getAll({ limit: 50, sort: '-createdAt' });
      const payload = res?.data?.data ?? res?.data ?? res;
      setThemes(payload);
    } catch (err) {
      toast.error('Failed to load themes');
    } finally {
      setLoadingThemes(false);
    }
  };

  const fetchActiveTheme = async () => {
    try {
      const res = await themesAPI.getActive();
      const payload = res?.data?.data ?? res?.data ?? res;
      setActiveTheme(payload);
    } catch (err) { /* ignore */ }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (activate = false) => {
    setCreating(true);
    try {
      let res;
      if (editingId) {
        res = await themesAPI.update(editingId, form);
        toast.success('Theme updated');
      } else {
        res = await themesAPI.create(form);
        toast.success('Theme created');
      }
      // reset form
      setForm({ name: '', primaryColor: '#B5522E', secondaryColor: '#9A4526', accentColor: '#4F7942', textColor: '#2B2620', backgroundColor: '#F7F3EA' });
      setEditingId(null);
      await fetchThemes();
      await fetchActiveTheme();

      if (activate) {
        const payload = res?.data?.data ?? res?.data ?? res;
        const id = payload?._id || payload?.id || editingId;
        if (id) {
          await themesAPI.activate(id);
          toast.success('Theme activated! Reloading…');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error('Could not determine theme ID');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save theme');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (theme) => {
    setEditingId(theme._id);
    setForm({
      name: theme.name || '',
      primaryColor: theme.primaryColor || '#B5522E',
      secondaryColor: theme.secondaryColor || '#9A4526',
      accentColor: theme.accentColor || '#4F7942',
      textColor: theme.textColor || '#2B2620',
      backgroundColor: theme.backgroundColor || '#F7F3EA'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theme? This cannot be undone.')) return;
    try {
      await themesAPI.delete(id);
      toast.success('Theme deleted');
      await fetchThemes();
      await fetchActiveTheme();
    } catch (err) {
      toast.error('Failed to delete theme');
    }
  };

  const handleActivate = async (id) => {
    try {
      await themesAPI.activate(id);
      toast.success('Theme applied — reloading…');
      try {
        const res = await themesAPI.getActive();
        const payload = res?.data?.data ?? res?.data ?? res;
        applyThemeToRoot(payload);
      } catch (e) {}
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error('Failed to activate theme');
    }
  };

  const formatSettingName = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  const getSettingDescription = (key) => {
    const descriptions = {
      emailNotifications: 'Receive email notifications for important updates',
      projectUpdates: 'Get notified about project progress and changes',
      newsletter: 'Subscribe to our monthly newsletter and updates',
      theme: 'Choose your preferred interface theme'
    };
    return descriptions[key] || `Manage ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} settings`;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Settings</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Settings</h1>
          <p className="text-ink-500 text-sm mt-1">Manage account preferences and theme customization</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-border p-6 space-y-5">
        <div className="flex items-center gap-3">
          <UserCircleIcon className="h-7 w-7 text-laterite-500" />
          <h2 className="font-display text-lg font-medium text-ink-800">Profile Information</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border bg-parchment-50">
          <div className="h-14 w-14 rounded-full bg-laterite-100 flex items-center justify-center">
            <span className="font-mono text-lg text-laterite-600">{(user?.name || 'A')[0].toUpperCase()}</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="font-sans font-semibold text-ink-800">{user?.name || 'Admin User'}</h3>
            <p className="text-ink-500 text-sm">{user?.email || 'admin@example.com'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-acacia-600 border border-acacia-500/30 px-2 py-0.5">Administrator</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 border border-border px-2 py-0.5">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <BellIcon className="h-7 w-7 text-laterite-500" />
          <h2 className="font-display text-lg font-medium text-ink-800">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <h3 className="font-sans font-semibold text-ink-800">{formatSettingName(key)}</h3>
                <p className="text-ink-500 text-xs mt-0.5">{getSettingDescription(key)}</p>
              </div>
              <button
                onClick={() => handleToggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-none transition-colors ${
                  value ? 'bg-acacia-500' : 'bg-ink-500/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-5 py-2 text-sm hover:bg-laterite-50 transition-colors"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Theme Management */}
      <div className="bg-white border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <PaintBrushIcon className="h-7 w-7 text-laterite-500" />
          <h2 className="font-display text-lg font-medium text-ink-800">Theme Management</h2>
        </div>

        {/* Active Theme Preview (dark card) */}
        {activeTheme ? (
          <div className="bg-soil-900 p-5 space-y-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-maize-400">Active Theme</span>
              <h3 className="font-display text-lg text-parchment-50 mt-0.5">{activeTheme.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              {['primaryColor', 'secondaryColor', 'accentColor', 'textColor'].map(key => (
                <div key={key} className="flex items-center gap-2">
                  <span className="h-4 w-4 border border-parchment-100/20" style={{ backgroundColor: activeTheme[key] }} />
                  <span className="text-parchment-100/70">{key.replace('Color', '')}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleActivate(activeTheme._id)}
              className="w-full py-2.5 border border-laterite-500 text-laterite-400 text-sm hover:bg-laterite-500/10 transition-colors"
            >
              Re-apply Theme
            </button>
          </div>
        ) : (
          <div className="bg-soil-900 p-5 text-center text-parchment-100/60 text-sm font-mono">
            No active theme
          </div>
        )}

        {/* Create / Edit Form */}
        <div className="border border-border p-5 bg-parchment-50 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-semibold text-ink-800 text-sm">
              {editingId ? 'Edit Theme' : 'Create New Theme'}
            </h3>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', primaryColor: '#B5522E', secondaryColor: '#9A4526', accentColor: '#4F7942', textColor: '#2B2620', backgroundColor: '#F7F3EA' });
                }}
                className="p-1 text-ink-500 hover:text-laterite-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 mb-2">Theme Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Enter theme name"
                className="w-full px-4 py-2.5 border border-border bg-white text-ink-800 text-sm focus:outline-none focus:border-laterite-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 mb-3">Color Palette</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'primaryColor', label: 'Primary' },
                  { key: 'secondaryColor', label: 'Secondary' },
                  { key: 'accentColor', label: 'Accent' },
                  { key: 'textColor', label: 'Text' },
                  { key: 'backgroundColor', label: 'Background' }
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <span className="text-xs text-ink-500">{label}</span>
                    <input
                      name={key}
                      value={form[key]}
                      onChange={handleFormChange}
                      type="color"
                      className="w-full h-10 border border-border cursor-pointer p-0.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleCreateOrUpdate(false)}
                disabled={creating}
                className="inline-flex items-center gap-2 border border-ink-800 text-ink-800 px-5 py-2 text-sm hover:bg-ink-800 hover:text-parchment-50 transition-colors disabled:opacity-50"
              >
                {editingId ? <PencilIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                {editingId ? (creating ? 'Updating…' : 'Update Theme') : (creating ? 'Creating…' : 'Create Theme')}
              </button>
              <button
                onClick={() => handleCreateOrUpdate(true)}
                disabled={creating}
                className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-5 py-2 text-sm hover:bg-laterite-50 transition-colors disabled:opacity-50"
              >
                <CheckCircleIcon className="h-4 w-4" />
                {editingId ? (creating ? 'Updating…' : 'Update & Activate') : (creating ? 'Creating…' : 'Create & Activate')}
              </button>
            </div>
          </div>
        </div>

        {/* Themes List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-ink-800 text-sm">Available Themes</h3>
            {loadingThemes && <ArrowPathIcon className="h-4 w-4 animate-spin text-ink-500" />}
          </div>

          {loadingThemes ? (
            <div className="py-12 text-center text-ink-500 text-sm font-mono">loading themes…</div>
          ) : themes.length === 0 ? (
            <div className="border border-dashed border-border p-10 text-center text-ink-500 text-sm font-mono">
              No themes created yet
            </div>
          ) : (
            <div className="space-y-2">
              {themes.map(theme => (
                <div
                  key={theme._id}
                  className={`flex items-center justify-between p-4 border ${
                    activeTheme?._id === theme._id ? 'border-laterite-500 bg-laterite-50' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 border border-border"
                      style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                    />
                    <div>
                      <h4 className="font-sans font-semibold text-ink-800 text-sm">{theme.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="h-2.5 w-2.5 border border-ink-500/20" style={{ backgroundColor: theme.primaryColor }} />
                        <span className="text-xs text-ink-500">Primary</span>
                        <span className="h-2.5 w-2.5 border border-ink-500/20" style={{ backgroundColor: theme.secondaryColor }} />
                        <span className="text-xs text-ink-500">Secondary</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleActivate(theme._id)}
                      className="px-3 py-1.5 border border-laterite-500 text-laterite-600 text-xs font-mono hover:bg-laterite-50 transition-colors"
                    >
                      Activate
                    </button>
                    <button onClick={() => handleEdit(theme)} className="p-1.5 text-ink-500 hover:text-laterite-500">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(theme._id)} className="p-1.5 text-ink-500 hover:text-status-danger">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;