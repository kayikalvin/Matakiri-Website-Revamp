import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserGroupIcon, 
  PhotoIcon,
  TrashIcon,
  CloudArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { partnersAPI } from '../../services/api';

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
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...formData };
      if (logoFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
        form.append('logo', logoFile);
        await partnersAPI.create(form);
      } else {
        await partnersAPI.create(payload);
      }
      navigate('/partners', { state: { message: 'Partner created successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create partner');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogo = (file) => {
    const f = file || null;
    setLogoFile(f);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (f) {
      const url = URL.createObjectURL(f);
      setLogoPreview(url);
    } else {
      setLogoPreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      handleLogo(f);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/partners')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Partners
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Partner</h1>
              <p className="text-gray-600 mt-1">Register a new partner organization</p>
              
              {/* Information Card */}
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-2xl">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
                      Ensure all information is accurate before submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1 - Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>

                  {/* Organization Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter organization name"
                    />
                  </div>

                  {/* Organization Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-800 mb-2">
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="NGO">NGO</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Government">Government Agency</option>
                      <option value="Health Organization">Health Organization</option>
                      <option value="Educational">Educational Institution</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-800 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-800 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all appearance-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 - Contact & Logo */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Contact Details & Logo
                  </h3>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Organization Logo
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer
                        transition-all duration-200
                        ${dragActive 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogo(e.target.files?.[0])}
                      />
                      
                      {logoPreview ? (
                        <div className="relative w-24 h-24">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleLogo(null); 
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                            aria-label="Remove logo"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className={`h-10 w-10 mb-3 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Drop logo here or click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, SVG up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="contact" className="block text-sm font-semibold text-gray-800 mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+254 712 345 678"
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
                        placeholder="contact@organization.org"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-semibold text-gray-800 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="https://www.organization.org"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Field - Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200 mb-4">
                  Description
                </h3>
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                    Organization Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Describe the partner organization, their mission, and areas of focus..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Provide a brief overview of the organization's purpose and activities.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/partners')}
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
                      'Create Partner'
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

export default CreatePartner;






















// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// import { partnersAPI } from '../../services/api';

// const CreatePartner = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'NGO',
//     description: '',
//     country: 'Kenya',
//     contact: '',
//     email: '',
//     website: '',
//     status: 'active'
//   });
//   const [loading, setLoading] = useState(false);
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const [logoRemoved, setLogoRemoved] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (logoPreview) URL.revokeObjectURL(logoPreview);
//     };
//   }, [logoPreview]);

//   const [error, setError] = useState(null);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       // prepare payload and optional logo upload
//       const payload = { ...formData };
//       if (logoFile) {
//         const form = new FormData();
//         // append fields individually so multer exposes them as req.body
//         Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
//         form.append('logo', logoFile);
//         await partnersAPI.create(form);
//       } else {
//         await partnersAPI.create(payload);
//       }
//       setLoading(false);
//       navigate('/partners');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to create partner');
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLogo = (file) => {
//     const f = file || null;
//     setLogoFile(f);
//     if (logoPreview) {
//       URL.revokeObjectURL(logoPreview);
//     }
//     setLogoRemoved(false);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setLogoPreview(url);
//     } else {
//       setLogoPreview(null);
//     }
//   };

//   const onDrop = (e) => {
//     e.preventDefault();
//     const f = e.dataTransfer.files?.[0];
//     if (f && f.type.startsWith('image/')) handleLogo(f);
//   };

//   const onDragOver = (e) => e.preventDefault();

//   return (
//     <div className="p-6">
//       {error && (
//         <div className="mb-4 text-center text-red-500">{error}</div>
//       )}
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/partners')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Partners
//         </button>
//         <div className="flex items-center">
//             <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
//               <UserGroupIcon className="h-6 w-6 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Add New Partner</h1>
//             <p className="text-gray-600 mt-2">Register a new partner organization</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-white shadow rounded-lg p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Organization Name *
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Enter organization name"
//               />
//             </div>

//             {/* Type */}
//             <div>
//               <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
//                 Organization Type *
//               </label>
//               <select
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="NGO">NGO</option>
//                 <option value="Corporate">Corporate</option>
//                 <option value="Government">Government Agency</option>
//                 <option value="Health Organization">Health Organization</option>
//                 <option value="Educational">Educational Institution</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="4"
//                 value={formData.description}
//                 onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Describe the partner organization"
//               />
//             </div>

//             {/* Country */}
//             <div>
//               <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
//                 Country *
//               </label>
//               <select
//                 id="country"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="Kenya">Kenya</option>
//                 <option value="Tanzania">Tanzania</option>
//                 <option value="Uganda">Uganda</option>
//                 <option value="Rwanda">Rwanda</option>
//                 <option value="Burundi">Burundi</option>
//                 <option value="Ethiopia">Ethiopia</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Contact */}
//             <div>
//               <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Number *
//               </label>
//               <input
//                 type="tel"
//                 id="contact"
//                 name="contact"
//                 required
//                 value={formData.contact}
//                 onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="+254 712 345 678"
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
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="contact@organization.org"
//               />
//             </div>

//             {/* Website */}
//             <div>
//               <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
//                 Website
//               </label>
//               <input
//                 type="url"
//                 id="website"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="https://www.organization.org"
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
//                 Status *
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//               {/* Logo upload */}
//               <div className="flex items-center gap-3 mr-auto">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">Logo</label>
//                   <div
//                     onDrop={onDrop}
//                     onDragOver={onDragOver}
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-white"
//                   >
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => handleLogo(e.target.files?.[0])}
//                     />
//                     {logoPreview ? (
//                         <div className="relative w-full h-full">
//                           <img src={logoPreview} alt="logo" className="w-full h-full object-cover rounded-md" />
//                           <button
//                             type="button"
//                             onClick={(e) => { e.stopPropagation(); handleLogo(null); setLogoRemoved(true); }}
//                             className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600"
//                             aria-label="Remove logo"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="text-center text-sm text-gray-500">Drag or click<br/>to upload</div>
//                       )}
//                   </div>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => navigate('/partners')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//               >
//                 {loading ? 'Creating...' : 'Create Partner'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePartner;