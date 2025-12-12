import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  NewspaperIcon, 
  PhotoIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsAPI } from '../../services/api';

const CreateNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Education',
    status: 'draft',
    tags: '',
    featuredImage: null,
    author: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
          : formData.tags,
        featuredImage: featuredImageFile
      };

      if (featuredImageFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === 'featuredImage' && value) {
            formData.append('featuredImage', value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
        await newsAPI.create(formData);
      } else {
        await newsAPI.create(payload);
      }
      
      navigate('/news', { state: { message: 'Article created successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create article');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value
    });
  };

  const handleImageUpload = (file) => {
    const f = file || null;
    setFeaturedImageFile(f);
    if (featuredImagePreview) URL.revokeObjectURL(featuredImagePreview);
    if (f) {
      const url = URL.createObjectURL(f);
      setFeaturedImagePreview(url);
    } else {
      setFeaturedImagePreview(null);
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
      handleImageUpload(f);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <NewspaperIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create News Article</h1>
              <p className="text-gray-600 mt-1">Write and publish a new article</p>
              
              {/* Information Card */}
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-2xl">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
                      Save as draft to continue editing later.
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
                {/* Main Content Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                      Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter a compelling article title..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-800 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows="3"
                      value={formData.excerpt}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Brief summary of the article (displayed in article lists)"
                      maxLength={160}
                    />
                    <div className="mt-2 text-sm text-gray-500 flex justify-end">
                      {formData.excerpt.length}/160 characters
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        className="h-96"
                        placeholder="Write your article content here..."
                      />
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Featured Image
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer p-8
                        transition-all duration-200
                        ${dragActive 
                          ? 'border-primary-500 bg-primary-50' 
                          : featuredImagePreview
                            ? 'border-gray-200'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      />
                      
                      {featuredImagePreview ? (
                        <div className="relative w-full max-w-2xl">
                          <img 
                            src={featuredImagePreview} 
                            alt="Featured preview" 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleImageUpload(null); 
                            }}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                            aria-label="Remove image"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className={`h-12 w-12 mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Drop featured image here or click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            Recommended: 1200×630px, JPG or PNG, max 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Column (1/3) */}
                <div className="space-y-8">
                  {/* Publish Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => navigate('/news')}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </span>
                            ) : formData.status === 'draft' ? 'Save Draft' : 'Publish'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
                      >
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Events">Events</option>
                        <option value="Partners">Partners</option>
                        <option value="Reports">Reports</option>
                        <option value="Projects">Projects</option>
                        <option value="Announcements">Announcements</option>
                        <option value="Research">Research</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                    </div>
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Add Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="education, project, 2024"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Separate tags with commas. Helps with search and organization.
                      </p>
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          id="metaTitle"
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="SEO title (defaults to article title)"
                        />
                      </div>
                      <div>
                        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          id="metaDescription"
                          name="metaDescription"
                          rows="3"
                          value={formData.metaDescription}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="SEO description (defaults to excerpt)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <InformationCircleIcon className="h-4 w-4 mr-2" />
                      <span>All changes are auto-saved locally</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/news')}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="draft"
                      disabled={loading}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setFormData({...formData, status: 'draft'})}
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="published"
                      disabled={loading}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setFormData({...formData, status: 'published'})}
                    >
                      {loading ? 'Publishing...' : 'Publish Now'}
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

export default CreateNews;































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeftIcon, NewspaperIcon } from '@heroicons/react/24/outline';

// import { newsAPI } from '../../services/api';

// const CreateNews = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     category: 'Education',
//     status: 'draft',
//     tags: '',
//     featuredImage: null
//   });
//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState(null);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       // Prepare tags as array if needed
//       const payload = {
//         ...formData,
//         tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
//       };
//       await newsAPI.create(payload);
//       setLoading(false);
//       navigate('/news');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to create news');
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
//       {error && (
//         <div className="mb-4 text-center text-red-500">{error}</div>
//       )}
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/news')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to News
//         </button>
//         <div className="flex items-center">
//           <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
//             <NewspaperIcon className="h-6 w-6 text-primary-500" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Create News Article</h1>
//             <p className="text-gray-600 mt-2">Write and publish a new article</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl">
//         <div className="bg-white shadow rounded-lg p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Enter article title"
//               />
//             </div>

//             {/* Content */}
//             <div>
//               <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
//               <textarea
//                 id="content"
//                 name="content"
//                 rows="10"
//                 required
//                 value={formData.content}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Write your article content here..."
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="Education">Education</option>
//                 <option value="Health">Health</option>
//                 <option value="Events">Events</option>
//                 <option value="Partners">Partners</option>
//                 <option value="Reports">Reports</option>
//                 <option value="Projects">Projects</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Tags */}
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
//               <input
//                 type="text"
//                 id="tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="education, project, 2024"
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => navigate('/news')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
//               >
//                 {loading ? 'Saving...' : 'Save Article'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateNews;