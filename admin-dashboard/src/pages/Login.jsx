// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Toaster, toast } from 'react-hot-toast';
// import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// const Login = () => {
//   const [email, setEmail] = useState('admin@matakiritrust.org');
//   const [password, setPassword] = useState('password');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isFocused, setIsFocused] = useState({ email: false, password: false });
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const result = await login({ email, password });
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/dashboard');
//       } else {
//         toast.error(result.error || 'Login failed');
//       }
//     } catch (error) {
//       toast.error(error.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       <Toaster />
      
//       {/* Left side - Brand/Image Section */}
//       <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 flex-col justify-center p-12">
//         <div className="max-w-md mx-auto">
//           <div className="flex items-center mb-8">
//               <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
//               <div className="h-8 w-8 bg-primary-600 rounded-md"></div>
//             </div>
//             <div className="ml-4">
//               <h1 className="text-3xl font-bold text-white">Matakiri Tumaini</h1>
//               <p className="text-primary-100 text-lg">Trust Foundation</p>
//             </div>
//           </div>
          
//           <h2 className="text-4xl font-bold text-white mb-6">
//             Welcome Back
//           </h2>
//           <p className="text-primary-100 text-lg mb-8">
//             Access the administrative dashboard to manage projects, partners, and content for the Matakiri Tumaini Trust Foundation.
//           </p>
          
//           <div className="space-y-4">
//             <div className="flex items-center text-primary-100">
//               <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center mr-3">
//                 <span className="text-sm font-semibold">✓</span>
//               </div>
//               <span>Manage Projects & Initiatives</span>
//             </div>
//             <div className="flex items-center text-primary-100">
//               <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center mr-3">
//                 <span className="text-sm font-semibold">✓</span>
//               </div>
//               <span>Update News & Gallery</span>
//             </div>
//             <div className="flex items-center text-primary-100">
//               <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center mr-3">
//                 <span className="text-sm font-semibold">✓</span>
//               </div>
//               <span>Monitor Trust Activities</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right side - Login Form Section */}
//       <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//               <div className="md:hidden flex justify-center mb-10">
//             <div className="flex items-center">
//               <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
//                 <div className="h-6 w-6 bg-white rounded-md"></div>
//               </div>
//               <div className="ml-3">
//                 <h1 className="text-xl font-bold text-gray-900">Matakiri Tumaini</h1>
//                 <p className="text-gray-600 text-sm">Admin Dashboard</p>
//               </div>
//             </div>
//           </div>

//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-gray-900">
//               Admin Dashboard
//             </h2>
//             <p className="mt-2 text-gray-600">
//               Sign in to manage your foundation
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* Email Input */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className={`relative transition-all duration-200 ${isFocused.email ? 'transform scale-[1.02]' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <EnvelopeIcon className={`h-5 w-5 ${isFocused.email ? 'text-primary-500' : 'text-gray-400'}`} />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition duration-200"
//                     placeholder="you@matakiritrust.org"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
//                     onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
//                   />
//                 </div>
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className={`relative transition-all duration-200 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <LockClosedIcon className={`h-5 w-5 ${isFocused.password ? 'text-primary-500' : 'text-gray-400'}`} />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition duration-200"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
//                     onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                     Remember me
//                   </label>
//                 </div>
//                 <div className="text-sm">
//                   <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing in...
//                   </>
//                 ) : (
//                   'Sign in'
//                 )}
//               </button>
//             </form>

//             {/* Demo Credentials Card */}
//               <div className="mt-8 pt-8 border-t border-gray-200">
//               <div className="bg-primary-50 rounded-lg p-4">
//                 <h3 className="text-sm font-medium text-primary-800 mb-2">Demo Credentials</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <div className="h-5 w-5 rounded bg-primary-100 flex items-center justify-center mr-2">
//                       <EnvelopeIcon className="h-3 w-3 text-primary-600" />
//                     </div>
//                     <span className="text-sm text-primary-700">admin@matakiritrust.org</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="h-5 w-5 rounded bg-primary-100 flex items-center justify-center mr-2">
//                       <LockClosedIcon className="h-3 w-3 text-primary-600" />
//                     </div>
//                     <span className="text-sm text-primary-700">password123</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <p className="text-xs text-gray-500">
//                 By signing in, you agree to our{' '}
//                 <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>
//                 {' '}and{' '}
//                 <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
//               </p>
//               <p className="mt-4 text-xs text-gray-500">
//                 © {new Date().getFullYear()} Matakiri Tumaini Trust Foundation. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Background Pattern */}
//       <div className="hidden md:block fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/2 w-1/2 h-full">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('admin@matakiritrust.org');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await login({ email, password });
      if (result.success) {
        toast.success('Welcome back! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const featureItems = [
    {
      icon: DocumentChartBarIcon,
      title: 'Project Management',
      description: 'Track and manage all trust initiatives'
    },
    {
      icon: UserGroupIcon,
      title: 'Partner Coordination',
      description: 'Coordinate with stakeholders and partners'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Portal',
      description: 'Enterprise-grade security for sensitive data'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Panel - Brand & Features */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-8 lg:p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800/20 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/10 rounded-full translate-y-64 -translate-x-64"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Brand Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="h-4 w-4 bg-primary-600 rounded-md"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Matakiri Tumaini</h1>
                  <p className="text-primary-100 text-sm">Trust Foundation Portal</p>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-10">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Transforming Communities,<br />
                  <span className="text-primary-200">One Project at a Time</span>
                </h2>
                <p className="text-primary-100 text-lg lg:text-xl opacity-90">
                  Access the centralized management system for all foundation activities, 
                  partnerships, and community initiatives.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {featureItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-primary-100 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-primary-100 text-sm">
                "Empowering communities through sustainable development and collaborative partnerships."
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Brand */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <div className="h-6 w-6 bg-white rounded-md"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Matakiri Tumaini</h1>
                  <p className="text-gray-600 text-sm">Admin Dashboard</p>
                </div>
              </div>
            </div>

            {/* Login Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue your important work
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className={`h-5 w-5 transition-colors ${isFocused.email ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-400"
                      placeholder="admin@matakiritrust.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
                      onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className={`h-5 w-5 transition-colors ${isFocused.password ? 'text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-400"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                      onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Remember this device</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl p-5 border border-primary-100">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
                      <ShieldCheckIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <h3 className="font-medium text-primary-800">Demo Access</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-primary-700 font-medium">Email:</span>
                      <code className="ml-2 px-2 py-1 bg-white/50 rounded text-primary-800 font-mono">
                        admin@matakiritrust.org
                      </code>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-primary-700 font-medium">Password:</span>
                      <code className="ml-2 px-2 py-1 bg-white/50 rounded text-primary-800 font-mono">
                        password
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6">
                <p className="text-xs text-gray-500 text-center">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                    Privacy Policy
                  </a>
                </p>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  © {new Date().getFullYear()} Matakiri Tumaini Trust Foundation. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;