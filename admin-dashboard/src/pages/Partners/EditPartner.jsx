import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserGroupIcon, 
  PencilIcon, 
  PhotoIcon,
  TrashIcon,
  CloudArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { partnersAPI } from '../../services/api';

const EditPartner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'NGO',
    description: '',
    country: 'Kenya',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    logo: '',
    status: 'active',
    since: ''
  });

  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await partnersAPI.getById(id);
        const resData = res?.data;
        const partner = resData?.data ?? resData?.partner ?? resData;
        setFormData({
          id: partner._id || partner.id,
          name: partner.name || '',
          type: partner.type || '',
          description: partner.description || '',
          country: partner.country || '',
          contactName: partner.contactPerson?.name || partner.contact || '',
          contactEmail: partner.contactPerson?.email || partner.email || '',
          contactPhone: partner.contactPerson?.phone || partner.contact || '',
          website: partner.website || '',
          logo: partner.logo || '',
          status: typeof partner.isActive === 'boolean' ? (partner.isActive ? 'active' : 'inactive') : (partner.status || 'active'),
          since: partner.partnershipStart ? String(partner.partnershipStart).slice(0,10) : (partner.since || '')
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load partner');
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...formData };
      payload.contactPerson = {
        name: formData.contactName || undefined,
        email: formData.contactEmail || undefined,
        phone: formData.contactPhone || undefined
      };
      payload.isActive = formData.status === 'active';
      if (formData.since) payload.partnershipStart = new Date(formData.since);

      delete payload.contactName;
      delete payload.contactEmail;
      delete payload.contactPhone;
      delete payload.status;
      delete payload.since;

      if (logoRemoved && !logoFile) {
        payload.logo = '';
      }

      if (logoFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
        if (payload.contactPerson) {
          form.append('contactName', payload.contactPerson.name || '');
          form.append('contactEmail', payload.contactPerson.email || '');
          form.append('contactPhone', payload.contactPerson.phone || '');
        }
        form.append('status', formData.status || '');
        form.append('since', formData.since || '');
        form.append('logo', logoFile);
        await partnersAPI.update(id, form);
      } else {
        await partnersAPI.update(id, payload);
      }
      navigate('/partners', { state: { message: 'Partner updated successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update partner');
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogo = (e) => {
    const f = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0] || e || null;
    if (!f) return;
    
    setLogoFile(f);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoRemoved(false);
    const url = URL.createObjectURL(f);
    setLogoPreview(url);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading partner details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium mb-2">Error Loading Partner</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/partners')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Partners
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <PencilIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Partner</h1>
              <p className="text-gray-600 mt-1">Update partner organization details and information</p>
              
              {/* Partner Info Card */}
              <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-2 border-white shadow">
                    <UserGroupIcon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{formData.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {formData.type}
                      </span>
                      <span className="text-gray-500">
                        ID: <span className="font-mono text-gray-700">{formData.id}</span>
                      </span>
                      {formData.since && (
                        <span className="text-gray-500">
                          Partner since: <span className="text-gray-700">{formData.since}</span>
                        </span>
                      )}
                    </div>
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
                {/* Column 1 */}
                <div className="space-y-6">
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
                        <div className="w-2 h-2 rounded-full bg-current">
                          <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Organization Logo
                    </label>
                    <div className="flex flex-col items-center">
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer
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
                          onChange={handleLogo}
                        />
                        
                        {logoPreview || formData.logo ? (
                          <div className="relative w-32 h-32">
                            <img 
                              src={logoPreview || formData.logo} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setLogoFile(null); 
                                setLogoPreview(null); 
                                setLogoRemoved(true); 
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                              aria-label="Remove logo"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <CloudArrowUpIcon className={`h-12 w-12 mb-3 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Drop logo here or click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, SVG up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                      {logoRemoved && !logoPreview && (
                        <p className="mt-2 text-sm text-amber-600">
                          Existing logo will be removed on save
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800">Contact Information</h3>
                    
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="email@organization.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+447935335065"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Brief description of the partner organization..."
                  />
                </div>

                {/* Website */}
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
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/partners')}
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
                      'Update Partner'
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

export default EditPartner;















// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeftIcon, UserGroupIcon, PencilIcon } from '@heroicons/react/24/outline';

// import { partnersAPI } from '../../services/api';

// const EditPartner = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'NGO',
//     description: '',
//     country: 'Kenya',
//     contactName: '',
//     contactEmail: '',
//     contactPhone: '',
//     website: '',
//     logo: '',
//     status: 'active',
//     since: ''
//   });

//   const [error, setError] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const [logoRemoved, setLogoRemoved] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (logoPreview) URL.revokeObjectURL(logoPreview);
//     };
//   }, [logoPreview]);
//   useEffect(() => {
//     const fetchPartner = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await partnersAPI.getById(id);
//         const resData = res?.data;
//         // normalize possible shapes: { data: {...} } | { partner: {...} } | direct object
//         const partner = resData?.data ?? resData?.partner ?? resData;
//         setFormData({
//           id: partner._id || partner.id,
//           name: partner.name || '',
//           type: partner.type || '',
//           description: partner.description || '',
//           country: partner.country || '',
//           contactName: partner.contactPerson?.name || partner.contact || '',
//           contactEmail: partner.contactPerson?.email || partner.email || '',
//           contactPhone: partner.contactPerson?.phone || partner.contact || '',
//           website: partner.website || '',
//           logo: partner.logo || '',
//           status: typeof partner.isActive === 'boolean' ? (partner.isActive ? 'active' : 'inactive') : (partner.status || 'active'),
//           since: partner.partnershipStart ? String(partner.partnershipStart).slice(0,10) : (partner.since || '')
//         });
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load partner');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPartner();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       // Map contact fields into contactPerson for backend
//       const payload = { ...formData };
//       payload.contactPerson = {
//         name: formData.contactName || undefined,
//         email: formData.contactEmail || undefined,
//         phone: formData.contactPhone || undefined
//       };
//       // Map status to isActive and since to partnershipStart
//       payload.isActive = formData.status === 'active';
//       if (formData.since) payload.partnershipStart = new Date(formData.since);

//       // Remove top-level contact fields to avoid duplication
//       delete payload.contactName;
//       delete payload.contactEmail;
//       delete payload.contactPhone;
//       delete payload.status;
//       delete payload.since;

//       // If user removed existing logo and didn't upload a new one, ensure backend clears it
//       if (logoRemoved && !logoFile) {
//         payload.logo = '';
//       }

//       // If a new logo file is selected, send as multipart with fields individually
//       if (logoFile) {
//         const form = new FormData();
//         Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
//         // Ensure contact fields are present for mapping middleware
//         if (payload.contactPerson) {
//           form.append('contactName', payload.contactPerson.name || '');
//           form.append('contactEmail', payload.contactPerson.email || '');
//           form.append('contactPhone', payload.contactPerson.phone || '');
//         }
//         // include status and since fields for mapping
//         form.append('status', formData.status || '');
//         form.append('since', formData.since || '');
//         form.append('logo', logoFile);
//         await partnersAPI.update(id, form);
//       } else {
//         await partnersAPI.update(id, payload);
//       }
//       setLoading(false);
//       navigate('/partners');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to update partner');
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLogo = (e) => {
//     const f = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0] || e || null;
//     setLogoFile(f);
//     if (logoPreview) URL.revokeObjectURL(logoPreview);
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
//     if (f && f.type.startsWith('image/')) {
//       setLogoFile(f);
//       if (logoPreview) URL.revokeObjectURL(logoPreview);
//       setLogoPreview(URL.createObjectURL(f));
//       setLogoRemoved(false);
//     }
//   };

//   const onDragOver = (e) => e.preventDefault();

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
//       <div className="p-6 text-center text-red-500">{error}</div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/partners')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Partners
//         </button>
//         <div className="flex items-center">
//           <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
//             <PencilIcon className="h-6 w-6 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Edit Partner</h1>
//             <p className="text-gray-600 mt-2">Update partner organization details</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* Partner Info Summary */}
//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
//                 <UserGroupIcon className="h-6 w-6 text-primary-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
//                 <p className="text-sm text-gray-500">Partner ID: {formData.id}</p>
//                 <p className="text-sm text-gray-500">Partner since: {formData.since}</p>
//               </div>
//             </div>
//           </div>

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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
//                 <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Person
//               </label>
//               <input
//                 type="text"
//                 id="contactName"
//                 name="contactName"
//                 required
//                 value={formData.contactName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             {/* Contact Phone */}
//             <div>
//               <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Number
//               </label>
//               <input
//                 type="tel"
//                 id="contactPhone"
//                 name="contactPhone"
//                 value={formData.contactPhone}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="contactEmail"
//                 name="contactEmail"
//                 value={formData.contactEmail}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             {/* Logo upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
//               <div className="flex items-center gap-3">
//                 <div
//                   onDrop={onDrop}
//                   onDragOver={onDragOver}
//                   onClick={() => fileInputRef.current?.click()}
//                   className="h-12 w-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-white"
//                 >
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleLogo}
//                   />
//                     {(logoPreview || formData.logo) ? (
//                       <div className="relative h-full w-full">
//                         <img src={logoPreview || formData.logo} alt="logo" className="h-full w-full object-cover rounded-md" />
//                         <button
//                           type="button"
//                           onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoPreview(null); setLogoRemoved(true); }}
//                           className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600"
//                           aria-label="Remove logo"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center text-xs text-gray-500">Drag or click to upload</div>
//                     )}
//                 </div>
//               </div>
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//               >
//                 {loading ? 'Updating...' : 'Update Partner'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPartner;