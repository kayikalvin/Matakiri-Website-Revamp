import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
  NewspaperIcon,
  PhotoIcon,
  TagIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsAPI } from '../../services/api';
import FormShell, { FormSection } from '../../components/Common/FormShell';

const CreateNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'projects',
    status: 'draft',
    tags: '',
    author: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.content.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags,
      featuredImage: featuredImageFile,
    };

    try {
      if (featuredImageFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            fd.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
          }
        });
        await newsAPI.create(fd);
      } else {
        await newsAPI.create(payload);
      }
      toast.success('Article created');
      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', placeholder = '', options = null, rows = 0) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label} {['title'].includes(name) && <span className="text-laterite-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows || 3}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 resize-none outline-none focus:border-laterite-500 transition-colors"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
        />
      )}
    </div>
  );

  // Custom footer with dual buttons
  const footer = (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-4 border-t border-border">
      <div className="flex items-center gap-2 text-xs font-mono text-ink-500">
        <InformationCircleIcon className="h-4 w-4" />
        Drafts are saved automatically.
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate('/news')}
          disabled={loading}
          className="px-4 py-2 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={loading}
          className="px-4 py-2 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          type="submit"
          name="status"
          value="published"
          disabled={loading}
          className="px-5 py-2 bg-soil-900 text-parchment-50 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing…' : 'Publish Now'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <FormShell
        title="Create News Article"
        subtitle="Write and publish a new article"
        backPath="/news"
        error={error}
        loading={loading}
        isValid={isFormValid()}
        onSubmit={handleSubmit}
        submitLabel=""
        imageFile={featuredImageFile}
        setImageFile={setFeaturedImageFile}
        footerChildren={footer}
      >
        {/* Info banner */}
        <div className="border border-border bg-parchment-50 p-4 text-xs text-ink-500 flex items-start gap-2">
          <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Fields marked with <span className="text-laterite-500">*</span> are required. Save as draft to continue later.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-8">
            <FormSection title="Article Content">
              {renderInput('title', 'Title', 'text', 'Enter article title')}
              {renderInput('excerpt', 'Excerpt', 'textarea', 'Brief summary (max 160 chars)', [], 3)}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">
                  Content <span className="text-laterite-500">*</span>
                </label>
                <div className="border border-border bg-white">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    placeholder="Write your article..."
                    className="h-80"
                  />
                </div>
              </div>
            </FormSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-parchment-50 border border-border p-5 space-y-4">
              <FormSection title="Status">
                {renderInput('status', 'Status', 'select', '', [
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ])}
              </FormSection>
            </div>

            <div className="bg-parchment-50 border border-border p-5 space-y-4">
              <FormSection title="Category">
                {renderInput('category', 'Category', 'select', '', [
                  { value: 'announcements', label: 'Announcements' },
                  { value: 'projects', label: 'Projects' },
                  { value: 'partnerships', label: 'Partnerships' },
                  { value: 'events', label: 'Events' },
                  { value: 'research', label: 'Research' },
                  { value: 'community', label: 'Community' },
                ])}
              </FormSection>
            </div>

            <div className="bg-parchment-50 border border-border p-5 space-y-4">
              <FormSection title="Tags">
                {renderInput('tags', 'Tags (comma separated)', 'text', 'education, project')}
              </FormSection>
            </div>

            <div className="bg-parchment-50 border border-border p-5 space-y-4">
              <FormSection title="SEO">
                {renderInput('metaTitle', 'Meta Title')}
                {renderInput('metaDescription', 'Meta Description', 'textarea', '', [], 3)}
              </FormSection>
            </div>
          </div>
        </div>
      </FormShell>
    </>
  );
};

export default CreateNews;