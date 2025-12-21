import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  NewspaperIcon, 
  PencilIcon,
  PhotoIcon,
  TrashIcon,
  CloudArrowUpIcon,
  CalendarIcon,
  EyeIcon,
  UserIcon,
  TagIcon,
  InformationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsAPI } from '../../services/api';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Education',
    status: 'draft',
    tags: '',
    author: '',
    metaTitle: '',
    metaDescription: ''
  });
  
  const [error, setError] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [articleStats, setArticleStats] = useState({
    views: 0,
    publishedAt: '',
    createdAt: '',
    updatedAt: ''
  });
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

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsAPI.getById(id);
        const resData = res?.data;
        const news = resData?.data ?? resData?.news ?? resData;
        
        setFormData({
          id: news._id || news.id,
          title: news.title || '',
          content: news.content || '',
          excerpt: news.excerpt || '',
          category: news.category || 'Education',
          status: news.status || 'draft',
          tags: Array.isArray(news.tags) ? news.tags.join(', ') : (news.tags || ''),
          author: typeof news.author === 'object' 
            ? (news.author.name || news.author.email || news.author._id) 
            : (news.author || ''),
          metaTitle: news.metaTitle || '',
          metaDescription: news.metaDescription || ''
        });

        setArticleStats({
          views: news.views || 0,
          publishedAt: news.publishedAt || news.publishedDate || '',
          createdAt: news.createdAt || '',
          updatedAt: news.updatedAt || ''
        });

        // Set featured image preview if exists
        if (news.featuredImage || news.image || news.thumbnail) {
          setFeaturedImagePreview(news.featuredImage || news.image || news.thumbnail);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      ...formData,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
        : formData.tags
    };
    const doUpdate = async () => {
      if (featuredImageFile) {
        const formDataObj = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === 'featuredImage' && value) {
            formDataObj.append('featuredImage', value);
          } else if (Array.isArray(value)) {
            formDataObj.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formDataObj.append(key, value);
          }
        });
        await newsAPI.update(id, formDataObj);
      } else {
        await newsAPI.update(id, payload);
      }
    };
    toast.promise(
      doUpdate(),
      {
        loading: 'Saving article...',
        success: () => {
          setTimeout(() => navigate('/news', { state: { message: 'Article updated successfully' } }), 500);
          return 'Article updated successfully!';
        },
        error: (err) => {
          setError(err?.response?.data?.message || err?.message || 'Failed to update article');
          setSubmitting(false);
          return err?.response?.data?.message || err?.message || 'Failed to update article';
        }
      }
    );
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
    if (featuredImagePreview && !featuredImagePreview.startsWith('blob:')) {
      // Don't revoke if it's a URL from server
    } else if (featuredImagePreview) {
      URL.revokeObjectURL(featuredImagePreview);
    }
    if (f) {
      const url = URL.createObjectURL(f);
      setFeaturedImagePreview(url);
    } else {
      setFeaturedImagePreview(null);
      toast.success('Image removed');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium text-lg mb-2">Error Loading Article</div>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate('/news')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Articles
              </button>
              <button
                onClick={() => window.location.reload()}
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
    <>
      <Toaster position="top-right" />
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
                <PencilIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit News Article</h1>
                <p className="text-gray-600 mt-1">Update article details and content</p>
                
                {/* Article Stats Card */}
                <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <NewspaperIcon className="h-4 w-4 mr-1" />
                        Article ID
                      </div>
                      <p className="font-mono text-sm font-semibold text-gray-900">{formData.id}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        Views
                      </div>
                      <p className="font-semibold text-gray-900">{articleStats.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <UserIcon className="h-4 w-4 mr-1" />
                        Author
                      </div>
                      <p className="font-medium text-gray-900">{formData.author || '—'}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Published
                      </div>
                      <p className="font-medium text-gray-900">
                        {articleStats.publishedAt 
                          ? new Date(articleStats.publishedAt).toLocaleDateString() 
                          : 'Not published'}
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
                        placeholder="Enter article title"
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
                        placeholder="Brief summary of the article"
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
                              <TrashIcon className="h-5 w-5" />
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
                              disabled={submitting}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <span className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </span>
                              ) : formData.status === 'draft' ? 'Save Draft' : 'Update'}
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
                            placeholder="SEO title"
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
                            placeholder="SEO description"
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
                        <span>Last updated: {articleStats.updatedAt ? new Date(articleStats.updatedAt).toLocaleString() : '—'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate('/news')}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="draft"
                        disabled={submitting}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setFormData({...formData, status: 'draft'})}
                      >
                        Save Draft
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="published"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setFormData({...formData, status: 'published'})}
                      >
                        {submitting ? 'Updating...' : 'Update & Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditNews;