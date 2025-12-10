// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Toaster, toast } from 'react-hot-toast';
// import { themesAPI } from '../services/api';

// const Settings = () => {
//   const { user } = useAuth();
//   const [settings, setSettings] = useState({
//     emailNotifications: true,
//     projectUpdates: true,
//     newsletter: false,
//     theme: 'light'
//   });
//   const [themes, setThemes] = useState([]);
//   const [activeTheme, setActiveTheme] = useState(null);
//   const [loadingThemes, setLoadingThemes] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [form, setForm] = useState({ name: '', primaryColor: '#10B981', secondaryColor: '#065F46', accentColor: '#059669', textColor: '#111827', backgroundColor: '#ffffff' });
//   const [editingId, setEditingId] = useState(null);

//   const handleToggle = (key) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const handleSave = () => {
//     // Save settings (mock implementation)
//     toast.success('Settings saved successfully!');
//   };

//   useEffect(() => {
//     fetchThemes();
//     fetchActiveTheme();
//   }, []);

//   const fetchThemes = async () => {
//     setLoadingThemes(true);
//     try {
//       const res = await themesAPI.getAll({ limit: 50, sort: '-createdAt' });
//       const payload = res?.data?.data ?? res?.data ?? res;
//       setThemes(payload);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load themes');
//     } finally {
//       setLoadingThemes(false);
//     }
//   };

//   const fetchActiveTheme = async () => {
//     try {
//       const res = await themesAPI.getActive();
//       const payload = res?.data?.data ?? res?.data ?? res;
//       setActiveTheme(payload);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCreateOrUpdate = async (activate = false) => {
//     setCreating(true);
//     try {
//       let res;
//       if (editingId) {
//         res = await themesAPI.update(editingId, form);
//         toast.success('Theme updated');
//       } else {
//         res = await themesAPI.create(form);
//         toast.success('Theme created');
//       }

//       // Reset form
//       setForm({ name: '', primaryColor: '#10B981', secondaryColor: '#065F46', accentColor: '#059669', textColor: '#111827', backgroundColor: '#ffffff' });
//       setEditingId(null);

//       // Refresh list
//       await fetchThemes();
//       await fetchActiveTheme();

//       // If requested, activate the newly created/updated theme and reload
//       if (activate) {
//         // determine id from response (controller returns data)
//         const payload = res?.data?.data ?? res?.data ?? res;
//         const id = payload?._id || payload?.id || editingId;
//         if (id) {
//           await themesAPI.activate(id);
//           toast.success('Theme activated — reloading to apply across the app');
//           window.location.reload();
//         } else {
//           toast.error('Could not determine theme id to activate');
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Failed to save theme');
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleEdit = (theme) => {
//     setEditingId(theme._id);
//     setForm({
//       name: theme.name || '',
//       primaryColor: theme.primaryColor || '#10B981',
//       secondaryColor: theme.secondaryColor || '#065F46',
//       accentColor: theme.accentColor || '#059669',
//       textColor: theme.textColor || '#111827',
//       backgroundColor: theme.backgroundColor || '#ffffff'
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this theme? This action cannot be undone.')) return;
//     try {
//       await themesAPI.delete(id);
//       toast.success('Theme deleted');
//       await fetchThemes();
//       await fetchActiveTheme();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete theme');
//     }
//   };

//   const handleActivate = async (id) => {
//     try {
//       // Call activate on backend
//       await themesAPI.activate(id);
//       toast.success('Theme activated — applying and reloading');

//       // fetch the newly active theme and apply immediately for preview
//       try {
//         const res = await themesAPI.getActive();
//         const payload = res?.data?.data ?? res?.data ?? res;
//         // apply to current session so admin sees it immediately
//         try { applyThemeToRoot(payload); } catch (e) { /* ignore */ }
//       } catch (e) {
//         // ignore
//       }

//       // Reload to ensure bootstrapped values are applied across the whole app
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to activate theme');
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      
//       <div className="max-w-4xl space-y-8">
//         {/* Profile Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
//                   <span className="text-2xl text-primary-600 font-bold">
//                   {user?.name?.charAt(0) || 'A'}
//                 </span>
//               </div>
//               <div className="ml-6">
//                 <h3 className="text-lg font-medium">{user?.name || 'Admin User'}</h3>
//                 <p className="text-gray-600">{user?.email || 'admin@matakiritrust.org'}</p>
//                 <p className="text-sm text-gray-500 mt-1">Administrator</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Notification Settings */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
//           <div className="space-y-4">
//             {Object.entries(settings).map(([key, value]) => (
//               <div key={key} className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-700 capitalize">
//                     {key.replace(/([A-Z])/g, ' $1').trim()}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleToggle(key)}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full ${
//                       value ? 'bg-primary-600' : 'bg-gray-200'
//                     }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                       value ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                   />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={handleSave}
//             className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>

//       {/* Theme Management */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Theme Management</h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Create / Edit Theme</h3>
//             <div className="space-y-3">
//               <input name="name" value={form.name} onChange={handleFormChange} placeholder="Theme name" className="w-full p-2 border border-gray-200 rounded" />
//               <div className="grid grid-cols-2 gap-2">
//                 <label className="flex items-center gap-2">
//                   <input name="primaryColor" value={form.primaryColor} onChange={handleFormChange} type="color" />
//                   <span className="text-sm text-gray-600">Primary</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input name="secondaryColor" value={form.secondaryColor} onChange={handleFormChange} type="color" />
//                   <span className="text-sm text-gray-600">Secondary</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input name="accentColor" value={form.accentColor} onChange={handleFormChange} type="color" />
//                   <span className="text-sm text-gray-600">Accent</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input name="textColor" value={form.textColor} onChange={handleFormChange} type="color" />
//                   <span className="text-sm text-gray-600">Text</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input name="backgroundColor" value={form.backgroundColor} onChange={handleFormChange} type="color" />
//                   <span className="text-sm text-gray-600">Background</span>
//                 </label>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button onClick={() => handleCreateOrUpdate(false)} disabled={creating} className="px-4 py-2 bg-primary-600 text-white rounded">
//                   {editingId ? (creating ? 'Updating...' : 'Update Theme') : (creating ? 'Creating...' : 'Create Theme')}
//                 </button>
//                 <button onClick={() => handleCreateOrUpdate(true)} disabled={creating} className="px-4 py-2 bg-primary-500 text-white rounded">
//                   {editingId ? (creating ? 'Updating & Activating...' : 'Update & Activate') : (creating ? 'Creating & Activating...' : 'Create & Activate')}
//                 </button>
//                 {editingId && (
//                   <button onClick={() => { setEditingId(null); setForm({ name: '', primaryColor: '#10B981', secondaryColor: '#065F46', accentColor: '#059669', textColor: '#111827', backgroundColor: '#ffffff' }); }} className="px-3 py-2 border rounded">Cancel</button>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Available Themes</h3>
//             <div className="space-y-3">
//               {loadingThemes ? (
//                 <div className="text-gray-400">Loading themes...</div>
//               ) : themes.length === 0 ? (
//                 <div className="text-gray-400">No themes yet.</div>
//               ) : (
//                 themes.map(t => (
//                   <div key={t._id} className={`p-3 border rounded flex items-center justify-between ${activeTheme && activeTheme._id === t._id ? 'ring-2 ring-primary-300' : ''}`}>
//                     <div className="flex items-center gap-3">
//                       <div style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` }} className="w-10 h-10 rounded-sm shadow-sm" />
//                       <div>
//                         <div className="font-medium text-gray-800">{t.name}</div>
//                         <div className="text-xs text-gray-500">Primary: {t.primaryColor}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => handleActivate(t._id)} className="px-3 py-1 text-sm bg-primary-600 text-white rounded">Activate</button>
//                       <button onClick={() => handleEdit(t)} className="px-3 py-1 text-sm border rounded">Edit</button>
//                       <button onClick={() => handleDelete(t._id)} className="px-3 py-1 text-sm text-red-600 border rounded">Delete</button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <Toaster />
//     </div>
//   );
// };

// export default Settings;



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
  XMarkIcon
} from '@heroicons/react/24/outline';

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
    primaryColor: '#10B981', 
    secondaryColor: '#065F46', 
    accentColor: '#059669', 
    textColor: '#111827', 
    backgroundColor: '#ffffff' 
  });
  const [editingId, setEditingId] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      icon: '✅'
    });
  };

  useEffect(() => {
    fetchThemes();
    fetchActiveTheme();
  }, []);

  const fetchThemes = async () => {
    setLoadingThemes(true);
    try {
      const res = await themesAPI.getAll({ limit: 50, sort: '-createdAt' });
      const payload = res?.data?.data ?? res?.data ?? res;
      setThemes(payload);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
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
        toast.success('Theme updated successfully', {
          icon: '🔄'
        });
      } else {
        res = await themesAPI.create(form);
        toast.success('Theme created successfully', {
          icon: '🎨'
        });
      }

      // Reset form
      setForm({ 
        name: '', 
        primaryColor: '#10B981', 
        secondaryColor: '#065F46', 
        accentColor: '#059669', 
        textColor: '#111827', 
        backgroundColor: '#ffffff' 
      });
      setEditingId(null);

      // Refresh list
      await fetchThemes();
      await fetchActiveTheme();

      // If requested, activate the newly created/updated theme and reload
      if (activate) {
        const payload = res?.data?.data ?? res?.data ?? res;
        const id = payload?._id || payload?.id || editingId;
        if (id) {
          await themesAPI.activate(id);
          toast.success('Theme activated! Reloading to apply across the app...', {
            icon: '✨'
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error('Could not determine theme ID to activate');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save theme');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (theme) => {
    setEditingId(theme._id);
    setForm({
      name: theme.name || '',
      primaryColor: theme.primaryColor || '#10B981',
      secondaryColor: theme.secondaryColor || '#065F46',
      accentColor: theme.accentColor || '#059669',
      textColor: theme.textColor || '#111827',
      backgroundColor: theme.backgroundColor || '#ffffff'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theme? This action cannot be undone.')) return;
    try {
      await themesAPI.delete(id);
      toast.success('Theme deleted successfully', {
        icon: '🗑️'
      });
      await fetchThemes();
      await fetchActiveTheme();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete theme');
    }
  };

  const handleActivate = async (id) => {
    try {
      await themesAPI.activate(id);
      toast.success('Activating theme and reloading...', {
        icon: '🔄'
      });
      
      // Apply preview before reload
      try {
        const res = await themesAPI.getActive();
        const payload = res?.data?.data ?? res?.data ?? res;
        applyThemeToRoot(payload);
      } catch (e) {
        console.warn('Could not apply theme preview:', e);
      }
      
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to activate theme');
    }
  };

  const formatSettingName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account preferences and theme customization</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
              Last updated: Today
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl">
                <UserCircleIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            </div>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
              Administrator
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Admin User'}</h3>
                <p className="text-gray-600">{user?.email || 'admin@example.com'}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    Verified
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Account Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="font-medium">January 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="font-medium">Today, 10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Timezone</span>
                  <span className="font-medium">UTC+5:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notification Settings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                <BellIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-6">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {formatSettingName(key)}
                      </h3>
                      {value && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {getSettingDescription(key)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      value ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Theme Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 md:p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl">
                <PaintBrushIcon className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Active Theme</h2>
                <p className="text-gray-300 text-sm">Current visual appearance</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeTheme ? (
                <>
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{activeTheme.name}</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['primaryColor', 'secondaryColor', 'accentColor', 'textColor'].map((colorKey) => (
                        <div key={colorKey} className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border border-gray-700"
                            style={{ backgroundColor: activeTheme[colorKey] }}
                          />
                          <span className="text-xs text-gray-300 capitalize">
                            {colorKey.replace('Color', '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleActivate(activeTheme._id)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    <span>Re-apply Theme</span>
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <PaintBrushIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No theme activated yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                <PaintBrushIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Theme Management</h2>
                <p className="text-gray-600 text-sm">Create and customize your interface themes</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {themes.length} theme{themes.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Creation Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {editingId ? 'Edit Theme' : 'Create New Theme'}
                </h3>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setForm({ 
                        name: '', 
                        primaryColor: '#10B981', 
                        secondaryColor: '#065F46', 
                        accentColor: '#059669', 
                        textColor: '#111827', 
                        backgroundColor: '#ffffff' 
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter theme name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Palette
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'primaryColor', label: 'Primary' },
                      { key: 'secondaryColor', label: 'Secondary' },
                      { key: 'accentColor', label: 'Accent' },
                      { key: 'textColor', label: 'Text' },
                      { key: 'backgroundColor', label: 'Background' }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <span className="text-xs font-mono text-gray-500">{form[key]}</span>
                        </div>
                        <div className="relative">
                          <input
                            name={key}
                            value={form[key]}
                            onChange={handleFormChange}
                            type="color"
                            className="w-full h-10 cursor-pointer rounded-lg border border-gray-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleCreateOrUpdate(false)}
                      disabled={creating}
                      className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium rounded-xl hover:from-gray-900 hover:to-gray-800 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {editingId ? (
                        <>
                          <PencilIcon className="h-5 w-5" />
                          <span>{creating ? 'Updating...' : 'Update Theme'}</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-5 w-5" />
                          <span>{creating ? 'Creating...' : 'Create Theme'}</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleCreateOrUpdate(true)}
                      disabled={creating}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>
                        {editingId 
                          ? (creating ? 'Updating & Activating...' : 'Update & Activate')
                          : (creating ? 'Creating & Activating...' : 'Create & Activate')
                        }
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Themes List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Available Themes</h3>
                {loadingThemes && (
                  <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                )}
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {loadingThemes ? (
                  <div className="text-center py-8">
                    <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-2">Loading themes...</p>
                  </div>
                ) : themes.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <PaintBrushIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No themes created yet</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first theme to get started</p>
                  </div>
                ) : (
                  themes.map(theme => (
                    <div
                      key={theme._id}
                      className={`p-4 rounded-xl border transition-all ${
                        activeTheme && activeTheme._id === theme._id
                          ? 'ring-2 ring-primary-500 ring-offset-2 border-primary-500'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-12 h-12 rounded-lg shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                            }}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                              {activeTheme && activeTheme._id === theme._id && (
                                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: theme.primaryColor }}
                                />
                                <span className="text-xs text-gray-500">Primary</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: theme.secondaryColor }}
                                />
                                <span className="text-xs text-gray-500">Secondary</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleActivate(theme._id)}
                            className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => handleEdit(theme)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit theme"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(theme._id)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete theme"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;