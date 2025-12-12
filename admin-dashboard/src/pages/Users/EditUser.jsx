import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  PencilIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

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
    bio: ''
  });
  
  const [passwords, setPasswords] = useState({ 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    createdAt: '',
    lastLogin: '',
    activityCount: 0
  });

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getById(id);
      const resData = res?.data;
      const user = resData?.data ?? resData?.user ?? resData;

      // Extract nested data
      const departmentObj = user?.department;
      const departmentName = departmentObj && typeof departmentObj === 'object' 
        ? (departmentObj.name || '') 
        : (departmentObj || '');

      const managerObj = user?.manager;
      const managerName = managerObj && typeof managerObj === 'object' 
        ? (managerObj.name || managerObj.email || '') 
        : (managerObj || '');

      const avatarObj = user?.avatar;
      const avatarUrl = avatarObj && typeof avatarObj === 'object' 
        ? (avatarObj.url || avatarObj.path || '') 
        : (avatarObj || '');

      setFormData({
        id: user._id || user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'editor',
        isActive: typeof user.isActive === 'boolean' 
          ? user.isActive 
          : (user.isActive === 'false' ? false : true),
        department: departmentName,
        position: user.position || '',
        bio: user.bio || '',
        avatar: avatarUrl,
        manager: managerName
      });

      setUserStats({
        createdAt: user.createdAt || '',
        lastLogin: user.lastLogin || user.updatedAt || '',
        activityCount: user.activityCount || 0
      });
    } catch (err) {
      console.error('Fetch user failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load user.';
      setError(msg);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Validate passwords if provided
      if (passwords.password || passwords.confirmPassword) {
        if (passwords.password !== passwords.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (passwords.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: !!formData.isActive,
        department: formData.department,
        position: formData.position,
        bio: formData.bio
      };
      
      if (passwords.password) {
        payload.password = passwords.password;
      }

      await usersAPI.update(id, payload);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Users
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium text-lg mb-2">Error Loading User</div>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate('/users')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Users
              </button>
              <button
                onClick={fetchUser}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <PencilIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">Update user details and permissions</p>
              
              {/* User Info Card */}
              <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-2 border-white shadow">
                    <UserIcon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{formData.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {formData.email}
                      </div>
                      {formData.phone && (
                        <div className="flex items-center text-gray-500">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {formData.phone}
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Joined {formatDate(userStats.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1 - Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+1 (234) 567-8900"
                      />
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-semibold text-gray-800 mb-2">
                        Position / Title
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Marketing Manager"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-800 mb-2">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="">Select Department</option>
                      <option value="Administration">Administration</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Support">Support</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">Human Resources</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-800 mb-2">
                      Bio / Description
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Brief description about the user..."
                    />
                  </div>
                </div>

                {/* Column 2 - Permissions & Security */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Permissions & Security
                  </h3>

                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all appearance-none"
                      >
                        <option value="viewer">Viewer (Read only)</option>
                        <option value="editor">Editor (Create & Edit)</option>
                        <option value="admin">Administrator (Full access)</option>
                        <option value="manager">Manager (Team management)</option>
                      </select>
                      <ShieldCheckIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {formData.role === 'viewer' && 'Can only view content'}
                      {formData.role === 'editor' && 'Can create and edit content'}
                      {formData.role === 'admin' && 'Full system access including user management'}
                      {formData.role === 'manager' && 'Can manage team members and moderate content'}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="isActive" className="block text-sm font-semibold text-gray-800 mb-2">
                      Account Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="isActive"
                      name="isActive"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        isActive: e.target.value === 'true' 
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  {/* Password Change */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4">Password Change (Optional)</h4>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={passwords.password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-10"
                          placeholder="Leave blank to keep current"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <div className="flex items-start">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          Password must be at least 6 characters. Leave blank to keep current password.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4">User Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Member since</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(userStats.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last login</span>
                        <span className="font-medium text-gray-900">
                          {userStats.lastLogin ? formatDate(userStats.lastLogin) : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Activities</span>
                        <span className="font-medium text-gray-900">
                          {userStats.activityCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Update User'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;


























// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { PencilIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
// import { usersAPI } from '../../services/api';
// import { Toaster, toast } from 'react-hot-toast';

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'editor',
//     isActive: true
//   });
//   // allow optional password update
//   const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

//   const [error, setError] = useState(null);

//   // fetchUser is exposed so Retry can call it without reloading
//   const fetchUser = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await usersAPI.getById(id);
//       const resData = res?.data;
//       // normalize possible shapes: { data: {...} } | { user: {...} } | direct object
//       const user = resData?.data ?? resData?.user ?? resData;

//       // normalize department/manager/avatar which may be objects or null
//       const departmentObj = user?.department;
//       const departmentId = departmentObj && (departmentObj._id || departmentObj.id) || (typeof departmentObj === 'string' ? departmentObj : undefined);
//       const departmentName = departmentObj && typeof departmentObj === 'object' ? (departmentObj.name || '') : (departmentObj || '');

//       const managerObj = user?.manager;
//       const managerId = managerObj && (managerObj._id || managerObj.id) || (typeof managerObj === 'string' ? managerObj : undefined);
//       const managerName = managerObj && typeof managerObj === 'object' ? (managerObj.name || managerObj.email || '') : (managerObj || '');

//       const avatarObj = user?.avatar;
//       const avatarUrl = avatarObj && typeof avatarObj === 'object' ? (avatarObj.url || avatarObj.path || '') : (avatarObj || '');

//       setFormData({
//         id: user._id || user.id,
//         name: user.name || '',
//         email: user.email || '',
//         role: user.role || 'editor',
//         isActive: typeof user.isActive === 'boolean' ? user.isActive : (user.isActive === 'false' ? false : true),
//         createdAt: user.createdAt || '',
//         avatar: avatarUrl,
//         department: departmentName,
//         departmentId: departmentId,
//         manager: managerName,
//         managerId: managerId
//       });
//     } catch (err) {
//       console.error('Fetch user failed:', err);
//       const msg = err.response?.data?.message || err.message || 'Failed to load user.';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchUser();
//   }, [id]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       // validate optional password if provided
//       if (passwords.password || passwords.confirmPassword) {
//         if (passwords.password !== passwords.confirmPassword) {
//           throw new Error('Passwords do not match');
//         }
//       }

//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         role: formData.role,
//         isActive: !!formData.isActive
//       };
//       if (passwords.password) payload.password = passwords.password;

//       await usersAPI.update(id, payload);
//       toast.success('User updated successfully!');
//       navigate('/users');
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Failed to update user.';
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handlePasswordChange = (e) => {
//     setPasswords({
//       ...passwords,
//       [e.target.name]: e.target.value
//     });
//   };


//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="text-gray-700 mb-4">{error}</p>
//           <button
//             onClick={() => fetchUser()}
//             className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/users')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Users
//         </button>
//         <div className="flex items-center">
//           <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
//             <PencilIcon className="h-6 w-6 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
//             <p className="text-gray-600 mt-2">Update user details and permissions</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* User Info Summary */}
//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
//                 <UserIcon className="h-6 w-6 text-primary-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
//                 <p className="text-sm text-gray-500">User ID: {formData.id}</p>
//                 <p className="text-sm text-gray-500">Joined: {formData.createdAt ? formData.createdAt.slice(0, 10) : ''}</p>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             {/* Role */}
//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
//                 Role *
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="viewer">Viewer (Read only)</option>
//                 <option value="editor">Editor (Create & Edit)</option>
//                 <option value="admin">Administrator (Full access)</option>
//               </select>
//             </div>

//             {/* Status */}
//             <div>
//                 <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
//                 Active *
//               </label>
//               <select
//                 id="isActive"
//                 name="isActive"
//                 value={formData.isActive ? 'true' : 'false'}
//                 onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>

//             {/* Optional Password Change */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 New Password (optional)
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={passwords.password}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Leave blank to keep current password"
//               />
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm New Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={passwords.confirmPassword}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Confirm new password"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => navigate('/users')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//               >
//                 {loading ? 'Updating...' : 'Update User'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditUser;