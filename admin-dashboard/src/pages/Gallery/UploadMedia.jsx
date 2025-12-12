import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  TrashIcon,
  XMarkIcon,
  FolderIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Toaster, toast } from 'react-hot-toast';
import { galleryAPI } from '../../services/api';

const UploadMedia = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    tags: ''
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const fileType = file.type.split('/')[0];
      const isValidType = ['image', 'video', 'application'].includes(fileType);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 50MB limit`);
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type.split('/')[0];
      const isValidType = ['image', 'video', 'application'].includes(fileType);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 50MB limit`);
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'image':
        return <PhotoIcon className="h-6 w-6 text-primary-600" />;
      case 'video':
        return <VideoCameraIcon className="h-6 w-6 text-purple-600" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title for the media');
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const data = new FormData();
      
      // Append files
      files.forEach((file) => {
        data.append('files', file);
      });
      
      // Append metadata
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.tags) {
        data.append('tags', formData.tags);
      }

      // You can implement progress tracking if your API supports it
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({
            ...prev,
            [files[0]?.name]: percentCompleted // Simple progress for first file
          }));
        },
      };

      await galleryAPI.upload(data, config);
      
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      
      // Dispatch refresh event for gallery page
      window.dispatchEvent(new Event('gallery:refresh'));
      
      // Navigate back after delay
      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <CloudArrowUpIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Upload Media</h1>
              <p className="text-gray-600 mt-1">Add images, videos, and documents to the gallery</p>
              
              {/* Information Card */}
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-2xl">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Supported formats: JPG, PNG, GIF, SVG, MP4, PDF, DOC, XLS
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Maximum file size: 50MB per file
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Upload Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
                <p className="text-sm text-gray-600 mt-1">Drag and drop or click to browse</p>
              </div>
              
              <div className="p-8">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer p-12
                    transition-all duration-200
                    ${dragActive 
                      ? 'border-primary-500 bg-primary-50' 
                      : files.length > 0
                        ? 'border-gray-200'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                  
                  {files.length === 0 ? (
                    <>
                      <CloudArrowUpIcon className={`h-16 w-16 mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-sm text-gray-500 text-center max-w-md">
                        Supports images, videos, PDFs, and documents. Max 50MB per file.
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CloudArrowUpIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        {files.length} file{files.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-sm text-gray-500">
                        Total size: {formatFileSize(totalSize)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAllFiles();
                        }}
                        className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear all files
                      </button>
                    </div>
                  )}
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Selected Files ({files.length})
                      </h3>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(totalSize)}
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                              {getFileIcon(file)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>{formatFileSize(file.size)}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{file.type.split('/')[0]}</span>
                              </div>
                            </div>
                          </div>
                          
                          {uploadProgress[file.name] !== undefined ? (
                            <div className="w-24">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 transition-all duration-300"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 text-center mt-1">
                                {uploadProgress[file.name]}%
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                              title="Remove file"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section (1/3 width) */}
          <div className="space-y-8">
            {/* Media Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Media Details</h2>
                <p className="text-sm text-gray-600 mt-1">Add metadata for your files</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter media title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Describe the media content"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="General">General</option>
                        <option value="Events">Events</option>
                        <option value="Projects">Projects</option>
                        <option value="Reports">Reports</option>
                        <option value="Partners">Partners</option>
                        <option value="Education">Education</option>
                        <option value="Team">Team</option>
                        <option value="Office">Office</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-semibold text-gray-800 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="event, project, 2024"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Add tags to help with search and organization
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Upload Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upload Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files selected</span>
                    <span className="font-semibold text-gray-900">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total size</span>
                    <span className="font-semibold text-gray-900">{formatFileSize(totalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{formData.category}</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/gallery')}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={uploading || files.length === 0 || !formData.title.trim()}
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        'Upload Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;














// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';

// import { galleryAPI } from '../../services/api';

// const UploadMedia = () => {
//   const navigate = useNavigate();
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'general'
//   });

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       toast.error('Please select at least one file');
//       return;
//     }
//     setUploading(true);
//     try {
//       const data = new FormData();
//       files.forEach((file) => {
//         data.append('files', file);
//       });
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('category', formData.category);

//       await galleryAPI.upload(data);
//       toast.success(`Successfully uploaded ${files.length} file(s)`);
//       setUploading(false);
//       // dispatch a refresh event so the Gallery list can reload without relying on navigation
//       try {
//         window.dispatchEvent(new Event('gallery:refresh'));
//       } catch (e) {
//         // ignore if event dispatch fails in some environments
//       }
//       navigate('/gallery');
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || 'Upload failed');
//       setUploading(false);
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="p-6">
//       <Toaster />
      
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Upload Media</h1>
//         <p className="text-gray-600 mt-2">Add new images or documents to the gallery</p>
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <form onSubmit={handleSubmit}>
//           {/* File Upload Area */}
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Select Files</h2>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <div className="text-4xl mb-4">📁</div>
//               <p className="text-gray-600 mb-2">Drag & drop files here or</p>
//               <input
//                 type="file"
//                 id="file-upload"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer"
//               >
//                 Browse Files
//               </label>
//               <p className="text-sm text-gray-500 mt-4">
//                 Supported formats: JPG, PNG, GIF, PDF (Max 10MB each)
//               </p>
//             </div>

//             {/* Selected Files List */}
//             {files.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="font-medium text-gray-900 mb-2">Selected Files ({files.length})</h3>
//                 <ul className="space-y-2">
//                   {files.map((file, index) => (
//                     <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
//                       <div className="flex items-center">
//                         <span className="mr-3">📄</span>
//                         <span>{file.name}</span>
//                         <span className="text-sm text-gray-500 ml-2">
//                           ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                         </span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeFile(index)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Media Details */}
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Media Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full p-2 border border-gray-300 rounded"
//                   placeholder="Enter media title"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   placeholder="Enter description (optional)"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 >
//                   <option value="general">General</option>
//                   <option value="projects">Projects</option>
//                   <option value="events">Events</option>
//                   <option value="reports">Reports</option>
//                   <option value="people">People</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => navigate('/gallery')}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={uploading || files.length === 0}
//               className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {uploading ? 'Uploading...' : 'Upload Media'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UploadMedia;
