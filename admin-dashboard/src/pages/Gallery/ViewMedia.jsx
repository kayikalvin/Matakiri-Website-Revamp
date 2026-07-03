import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FolderIcon,
  ClockIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const ViewMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const [relatedMedia, setRelatedMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        if (galleryAPI.getById) {
          const res = await galleryAPI.getById(id);
          const mediaData = res.data?.data || res.data;
          setMedia(mediaData);

          // Related media
          if (mediaData?.category) {
            try {
              const relatedRes = await galleryAPI.getAll({ category: mediaData.category, limit: 4 });
              const items = relatedRes.data?.data || relatedRes.data?.gallery || relatedRes.data || [];
              setRelatedMedia(
                items
                  .filter(item => String(item._id || item.id) !== String(id))
                  .slice(0, 3)
              );
            } catch (err) {
              // silently ignore
            }
          }
        } else {
          const res = await galleryAPI.getAll();
          const items = res.data?.data || res.data?.gallery || res.data || [];
          const found = items.find(item => String(item._id || item.id) === String(id));
          if (!found) throw new Error('Media not found');
          setMedia(found);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load media');
        toast.error('Failed to load media details');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [id]);

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    window.open(media.url || media.fileUrl, '_blank');
    toast.success('Download started');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: media.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    }
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${media.title}"?`)) return;
    toast.promise(
      galleryAPI.delete(id).then(() => navigate('/gallery')),
      {
        loading: 'Deleting…',
        success: 'Media deleted',
        error: 'Failed to delete',
      }
    );
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 text-center py-16 text-ink-500 font-mono text-sm">
        Loading media…
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <button onClick={() => navigate('/gallery')} className="inline-flex items-center gap-1.5 text-ink-500 hover:text-laterite-500 text-xs font-mono">
          <ArrowLeftIcon className="h-4 w-4" /> Back to Gallery
        </button>
        <div className="border border-status-danger/30 p-8 text-center text-status-danger text-sm font-mono">
          {error || 'Media not found'}
        </div>
      </div>
    );
  }

  const isImage = media.type === 'image' || media.mimeType?.startsWith('image/');
  const isVideo = media.type === 'video' || media.mimeType?.startsWith('video/');

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

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Media</span>
            <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">{media.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-mono text-ink-500 flex items-center gap-1">
                <FolderIcon className="h-3.5 w-3.5" />
                {media.category || 'Uncategorized'}
              </span>
              <span className="text-xs font-mono text-ink-500 flex items-center gap-1">
                <EyeIcon className="h-3.5 w-3.5" />
                {(media.views || 0).toLocaleString()} views
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 border border-border text-ink-700 text-sm hover:bg-parchment-50 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-1.5 inline" />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 border border-laterite-500 text-laterite-600 text-sm hover:bg-laterite-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5 inline" />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview */}
          <div className="bg-white border border-border p-6">
            <div className="aspect-video bg-parchment-50 border border-border flex items-center justify-center overflow-hidden">
              {isImage && (media.url || media.fileUrl) ? (
                <img src={media.url || media.fileUrl} alt={media.title} className="w-full h-full object-contain" />
              ) : isVideo && (media.url || media.fileUrl) ? (
                <video src={media.url || media.fileUrl} controls className="w-full h-full" />
              ) : (
                <PhotoIcon className="h-24 w-24 text-ink-300" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
              <div className="border border-border p-3">
                <span className="text-ink-500">Type</span>
                <p className="font-mono text-ink-800 mt-0.5">{media.mimeType || media.type || 'Unknown'}</p>
              </div>
              <div className="border border-border p-3">
                <span className="text-ink-500">Size</span>
                <p className="font-mono text-ink-800 mt-0.5">{formatBytes(media.size || media.fileSize)}</p>
              </div>
              <div className="border border-border p-3">
                <span className="text-ink-500">Uploaded</span>
                <p className="font-mono text-ink-800 mt-0.5">{formatDate(media.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-border p-6 space-y-5">
            <h2 className="font-display text-lg font-medium text-ink-800">Details</h2>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Description</p>
              <p className="text-sm text-ink-800 whitespace-pre-wrap">{media.description || 'No description.'}</p>
            </div>

            {media.tags?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(media.tags) ? media.tags : media.tags.split(',')).map((tag, i) => (
                    <span key={i} className="text-xs font-mono border border-border px-2 py-0.5 text-ink-600">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Metadata</p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-ink-500">Dimensions</span><span className="text-ink-800">{media.dimensions || media.metadata?.dimensions || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Duration</span><span className="text-ink-800">{media.duration || media.metadata?.duration || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Resolution</span><span className="text-ink-800">{media.resolution || media.metadata?.resolution || '—'}</span></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">Upload Info</p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-ink-500">Uploaded By</span><span className="text-ink-800">{media.uploadedBy || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Modified</span><span className="text-ink-800">{formatDate(media.updatedAt)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">ID</span><span className="text-ink-800 truncate max-w-[120px]">{id}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white border border-border p-5 space-y-3">
            <h3 className="font-display text-lg font-medium text-ink-800">Actions</h3>
            <Link
              to={`/gallery/edit/${id}`}
              className="flex items-center justify-between p-3 border border-border hover:border-laterite-500 transition-colors text-sm text-ink-800"
            >
              <span className="flex items-center gap-2"><PencilIcon className="h-4 w-4 text-ink-500" />Edit Details</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-ink-400" />
            </Link>
            <button
              onClick={handleDownload}
              className="flex items-center justify-between w-full p-3 border border-border hover:border-laterite-500 transition-colors text-sm text-ink-800"
            >
              <span className="flex items-center gap-2"><ArrowDownTrayIcon className="h-4 w-4 text-ink-500" />Download</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-between w-full p-3 border border-border hover:border-laterite-500 transition-colors text-sm text-ink-800"
            >
              <span className="flex items-center gap-2"><ShareIcon className="h-4 w-4 text-ink-500" />Share</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-between w-full p-3 border border-status-danger/30 hover:bg-status-danger/5 transition-colors text-sm text-status-danger"
            >
              <span className="flex items-center gap-2"><TrashIcon className="h-4 w-4" />Delete</span>
            </button>
          </div>

          {/* Related Media */}
          {relatedMedia.length > 0 && (
            <div className="bg-white border border-border p-5 space-y-3">
              <h3 className="font-display text-lg font-medium text-ink-800">Related Media</h3>
              {relatedMedia.map(item => (
                <Link
                  key={item._id || item.id}
                  to={`/gallery/view/${item._id || item.id}`}
                  className="flex items-center gap-3 p-3 border border-border hover:border-laterite-500 transition-colors"
                >
                  <div className="h-10 w-10 bg-parchment-100 border border-border flex items-center justify-center">
                    {item.type === 'image' ? <PhotoIcon className="h-5 w-5 text-ink-500" /> : <VideoCameraIcon className="h-5 w-5 text-ink-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{item.title}</p>
                    <p className="text-xs text-ink-500 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* File Info */}
          <div className="bg-white border border-border p-5 space-y-3">
            <h3 className="font-display text-lg font-medium text-ink-800">File Information</h3>
            <div className="text-xs space-y-2 font-mono">
              <div>
                <span className="text-ink-500">Name</span>
                <p className="text-ink-800 truncate">{media.originalName || media.filename || '—'}</p>
              </div>
              <div>
                <span className="text-ink-500">Path</span>
                <p className="text-ink-800 truncate">{media.path || media.storagePath || '/'}</p>
              </div>
              <div>
                <span className="text-ink-500">URL</span>
                <a
                  href={media.url || media.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-laterite-500 underline block truncate"
                >
                  {media.url || media.fileUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedia;