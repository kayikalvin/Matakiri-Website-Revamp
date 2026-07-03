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
  InformationCircleIcon,
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
    tags: '',
  });
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => {
      const valid = ['image', 'video', 'application'].includes(f.type.split('/')[0]);
      const okSize = f.size <= 50 * 1024 * 1024;
      if (!okSize) toast.error(`${f.name} exceeds 50MB`);
      return valid && okSize;
    });
    if (droppedFiles.length) {
      setFiles(prev => [...prev, ...droppedFiles]);
      toast.success(`Added ${droppedFiles.length} file(s)`);
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).filter(f => {
      const valid = ['image', 'video', 'application'].includes(f.type.split('/')[0]);
      const okSize = f.size <= 50 * 1024 * 1024;
      if (!okSize) toast.error(`${f.name} exceeds 50MB`);
      return valid && okSize;
    });
    if (selected.length) {
      setFiles(prev => [...prev, ...selected]);
      toast.success(`Added ${selected.length} file(s)`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const t = file.type.split('/')[0];
    switch (t) {
      case 'image': return <PhotoIcon className="h-5 w-5 text-laterite-500" />;
      case 'video': return <VideoCameraIcon className="h-5 w-5 text-maize-500" />;
      default: return <DocumentIcon className="h-5 w-5 text-ink-500" />;
    }
  };

  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
  const clearAllFiles = () => {
    setFiles([]);
    toast.success('All files cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return toast.error('Select at least one file');
    if (!formData.title.trim()) return toast.error('Title is required');

    setUploading(true);
    try {
      const data = new FormData();
      files.forEach(f => data.append('media', f));
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.tags) data.append('tags', formData.tags);

      await galleryAPI.upload(data);
      toast.success(`Uploaded ${files.length} file(s)`);
      window.dispatchEvent(new Event('gallery:refresh'));
      setTimeout(() => navigate('/gallery'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/gallery')}
          className="inline-flex items-center gap-1.5 text-ink-500 hover:text-laterite-500 text-xs font-mono transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Gallery
        </button>
        <div className="border-b border-border pb-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Media</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Upload Media</h1>
          <p className="text-ink-500 text-sm mt-1">Add images, videos, and documents to the gallery</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="border border-border bg-parchment-50 p-4 text-xs text-ink-500 flex items-start gap-2">
        <InformationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>Supported formats: JPG, PNG, GIF, SVG, MP4, PDF, DOC. Max 50MB per file.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload area (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border p-6 space-y-6">
            {/* Drop zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-laterite-500 bg-laterite-50'
                  : files.length > 0
                  ? 'border-border'
                  : 'border-border hover:border-laterite-400 bg-parchment-50'
              }`}
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
                  <CloudArrowUpIcon className="h-14 w-14 text-ink-400 mb-3" />
                  <p className="text-sm font-medium text-ink-800 mb-1">Drop files here or click to browse</p>
                  <p className="text-xs text-ink-500">Images, videos, documents – up to 50MB each</p>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-12 w-12 text-laterite-500 mb-2" />
                  <p className="text-sm font-medium text-ink-800">{files.length} file{files.length !== 1 && 's'} selected</p>
                  <p className="text-xs text-ink-500">Total: {formatFileSize(totalSize)}</p>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); clearAllFiles(); }}
                    className="mt-3 text-xs text-status-danger hover:underline"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border bg-parchment-50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 flex items-center justify-center">{getFileIcon(file)}</div>
                      <div className="min-w-0">
                        <p className="text-sm text-ink-800 truncate">{file.name}</p>
                        <p className="text-xs text-ink-500">{formatFileSize(file.size)} · {file.type.split('/')[0]}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(i)} className="p-1 text-ink-500 hover:text-status-danger" title="Remove">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details & summary (1/3) */}
        <div className="space-y-6">
          <div className="bg-white border border-border p-5 space-y-5">
            <h2 className="font-display text-lg font-medium text-ink-800">Media Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">
                  Title <span className="text-laterite-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter media title"
                  className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description"
                  className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 resize-none outline-none focus:border-laterite-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
                >
                  {['General','Events','Projects','Reports','Partners','Education','Team','Office'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="event, project"
                  className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-laterite-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border p-5 space-y-4">
            <h2 className="font-display text-lg font-medium text-ink-800">Upload Summary</h2>
            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-ink-500">Files</span><span className="text-ink-800">{files.length}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Total size</span><span className="text-ink-800">{formatFileSize(totalSize)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Category</span><span className="text-ink-800">{formData.category}</span></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/gallery')}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={uploading || files.length === 0 || !formData.title.trim()}
                className="flex-1 px-4 py-2.5 bg-soil-900 text-parchment-50 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;