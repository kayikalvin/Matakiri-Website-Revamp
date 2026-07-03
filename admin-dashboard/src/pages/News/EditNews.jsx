import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
  NewspaperIcon,
  PencilIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsAPI } from '../../services/api';
import FormShell, { FormSection } from '../../components/Common/FormShell';

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
    metaDescription: '',
  });
  const [articleStats, setArticleStats] = useState({
    views: 0,
    publishedAt: '',
    createdAt: '',
    updatedAt: '',
  });
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

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsAPI.getById(id);
        const news = res?.data?.data ?? res?.data?.news ?? res?.data;
        setFormData({
          title: news.title || '',
          content: news.content || '',
          excerpt: news.excerpt || '',
          category: news.category || 'Education',
          status: news.status || 'draft',
          tags: Array.isArray(news.tags) ? news.tags.join(', ') : news.tags || '',
          author: typeof news.author === 'object' ? (news.author.name || news.author.email) : news.author || '',
          metaTitle: news.metaTitle || '',
          metaDescription: news.metaDescription || '',
        });
        setArticleStats({
          views: news.views || 0,
          publishedAt: news.publishedAt || '',
          createdAt: news.createdAt || '',
          updatedAt: news.updatedAt || '',
        });
        // pre‑fill featured image preview if exists
        if (news.featuredImage || news.image) {
          setFeaturedImageFile(null); // we don't have file object, but FormShell will show the URL? Actually FormShell's imageFile expects a File object for preview. We'll handle separately.
          // We'll rely on the existing preview in the form; we'll display the current image below the upload zone.
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const intendedStatus = e.nativeEvent.submitter?.value || formData.status;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        published: intendedStatus === 'published',
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : formData.tags,
      };
      delete payload.status;

      if (featuredImageFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
          }
        });
        fd.append('featuredImage', featuredImageFile);
        await newsAPI.update(id, fd);
      } else {
        await newsAPI.update(id, payload);
      }
      toast.success('Article updated');
      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center py-16 text-ink-500 font-mono text-sm">
        Loading article…
      </div>
    );
  }

  // Current featured image from server (not file) – display below upload zone
  const currentImage = (formData.id && !featuredImageFile && (formData.image || formData.featuredImage)) || null;

  // Custom footer with sidebar buttons and bottom bar
  const footer = (
    <div className="space-y-4">
      {/* Bottom action bar (same as original) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
        <div className="text-xs font-mono text-ink-500">
          {articleStats.updatedAt
            ? `Last updated: ${new Date(articleStats.updatedAt).toLocaleString()}`
            : ''}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="px-4 py-2 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            name="status"
            value="draft"
            className="px-4 py-2 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors"
            disabled={submitting}
          >
            Save Draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            className="px-5 py-2 bg-soil-900 text-parchment-50 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Updating…' : 'Update & Publish'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <FormShell
      title="Edit News Article"
      subtitle={`Editing: ${formData.title || 'Article'}`}
      backPath="/news"
      error={error}
      loading={submitting}
      isValid={formData.title.trim() !== ''}
      onSubmit={handleSubmit}
      submitLabel=""
      imageFile={featuredImageFile}
      setImageFile={setFeaturedImageFile}
      footerChildren={footer}
    >
      {/* Article stats header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-border bg-parchment-50 text-xs">
        <div>
          <span className="text-ink-500">Article ID</span>
          <p className="font-mono font-medium text-ink-800">{formData.id || '—'}</p>
        </div>
        <div>
          <span className="text-ink-500">Views</span>
          <p className="font-mono text-ink-800">{articleStats.views.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-ink-500">Author</span>
          <p className="text-ink-800">{formData.author || '—'}</p>
        </div>
        <div>
          <span className="text-ink-500">Published</span>
          <p className="text-ink-800">
            {articleStats.publishedAt
              ? new Date(articleStats.publishedAt).toLocaleDateString()
              : 'Not published'}
          </p>
        </div>
      </div>

      {/* Main layout: content left, sidebar right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <FormSection title="Article Content">
            {renderInput('title', 'Title', 'text', 'Enter article title')}
            {renderInput('excerpt', 'Excerpt', 'textarea', 'Brief summary (max 160 chars)', [], 3)}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">
                Content *
              </label>
              <div className="border border-border bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  className="h-80"
                />
              </div>
            </div>
            {currentImage && (
              <div className="border border-border p-4 bg-parchment-50">
                <p className="text-xs text-ink-500 mb-2">Current featured image</p>
                <img src={currentImage} alt="" className="max-h-40 border border-border object-cover" />
              </div>
            )}
          </FormSection>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-8">
          {/* Status & Publish */}
          <div className="bg-parchment-50 border border-border p-5 space-y-4">
            <FormSection title="Status">
              {renderInput('status', 'Status', 'select', '', [
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ])}
            </FormSection>
          </div>

          {/* Category */}
          <div className="bg-parchment-50 border border-border p-5 space-y-4">
            <FormSection title="Category">
              {renderInput('category', 'Category', 'select', '', [
                { value: 'Education', label: 'Education' },
                { value: 'Health', label: 'Health' },
                { value: 'Events', label: 'Events' },
                { value: 'Partners', label: 'Partners' },
                { value: 'Reports', label: 'Reports' },
                { value: 'Projects', label: 'Projects' },
                { value: 'Announcements', label: 'Announcements' },
                { value: 'Research', label: 'Research' },
                { value: 'Other', label: 'Other' },
              ])}
            </FormSection>
          </div>

          {/* Tags */}
          <div className="bg-parchment-50 border border-border p-5 space-y-4">
            <FormSection title="Tags">
              {renderInput('tags', 'Tags (comma separated)', 'text', 'education, project')}
            </FormSection>
          </div>

          {/* SEO */}
          <div className="bg-parchment-50 border border-border p-5 space-y-4">
            <FormSection title="SEO Settings">
              {renderInput('metaTitle', 'Meta Title', 'text', 'SEO title')}
              {renderInput('metaDescription', 'Meta Description', 'textarea', 'SEO description', [], 3)}
            </FormSection>
          </div>
        </div>
      </div>
    </FormShell>
  );
};

export default EditNews;