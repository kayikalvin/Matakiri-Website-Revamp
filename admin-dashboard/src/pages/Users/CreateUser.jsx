import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'editor',
    department: '',
    position: '',
    bio: ''
  });
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords
    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }
    
    if (passwords.password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
        bio: formData.bio
      });
      
      toast.success('User created successfully!');
      navigate('/users');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create user.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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
              <UserPlusIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New User</h1>
              <p className="text-gray-600 mt-1">Create a new user account with specific permissions</p>
              
              {/* Information Card */}
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-2xl">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
                      Ensure the email is correct as a verification link may be sent.
                    </p>
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
                        placeholder="John Doe"
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
                        placeholder="user@matakiritrust.org"
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
                        placeholder="+447935335065"
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

                {/* Column 2 - Account & Security */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Account & Security
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
                    <div className="mt-3 space-y-2">
                      <div className={`p-3 rounded-lg border ${formData.role === 'viewer' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="font-medium text-gray-900">Viewer</div>
                        <div className="text-sm text-gray-600 mt-1">Can only view content, no editing rights</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${formData.role === 'editor' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="font-medium text-gray-900">Editor</div>
                        <div className="text-sm text-gray-600 mt-1">Can create and edit content, moderate comments</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${formData.role === 'admin' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="font-medium text-gray-900">Administrator</div>
                        <div className="text-sm text-gray-600 mt-1">Full system access including user management</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${formData.role === 'manager' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="font-medium text-gray-900">Manager</div>
                        <div className="text-sm text-gray-600 mt-1">Can manage team members and moderate content</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4">
                      Password <span className="text-red-500">*</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          required
                          value={passwords.password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-10"
                          placeholder="Create a strong password"
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
                          Confirm Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Confirm your password"
                        />
                      </div>

                      {/* Password Strength Indicator */}
                      {passwords.password && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Password Strength: <span className={`font-semibold ${
                                strength.score >= 3 ? 'text-green-600' :
                                strength.score >= 2 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {strength.label}
                              </span>
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                strength.score >= 3 ? 'bg-green-500' :
                                strength.score >= 2 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${(strength.score / 4) * 100}%` }}
                            />
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            <p>Password should contain:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li className={passwords.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                                At least 8 characters
                              </li>
                              <li className={/[A-Z]/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}>
                                One uppercase letter
                              </li>
                              <li className={/[0-9]/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}>
                                One number
                              </li>
                              <li className={/[^A-Za-z0-9]/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}>
                                One special character
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <InformationCircleIcon className="h-4 w-4 mr-2" />
                      <span>All fields marked with * are required</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/users')}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;



















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserPlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
// import { usersAPI } from '../../services/api';
// import { Toaster, toast } from 'react-hot-toast';

// const CreateUser = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'editor',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match.');
//       toast.error('Passwords do not match.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await usersAPI.create({
//         name: formData.name,
//         email: formData.email,
//         role: formData.role,
//         password: formData.password
//       });
//       toast.success('User created successfully!');
//       navigate('/users');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create user.');
//       toast.error(err.response?.data?.message || 'Failed to create user.');
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
//             <UserPlusIcon className="h-6 w-6 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
//             <p className="text-gray-600 mt-2">Create a new user account</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-white shadow rounded-lg p-6">
//           {error && (
//             <div className="mb-4 text-red-600 font-medium">{error}</div>
//           )}
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
//                 placeholder="John Doe"
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
//                 placeholder="user@matakiritrust.org"
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
//               <div className="mt-2 text-sm text-gray-500">
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li><strong>Viewer:</strong> Can only view content</li>
//                   <li><strong>Editor:</strong> Can create and edit content</li>
//                   <li><strong>Admin:</strong> Full system access including user management</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password *
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Enter password"
//               />
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password *
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Confirm password"
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
//                 {loading ? 'Creating...' : 'Create User'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateUser;