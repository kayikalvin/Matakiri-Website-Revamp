import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';
import { toast, Toaster } from 'react-hot-toast';

import FilterBar from '../../components/Common/FilterBar';
import CardGrid from '../../components/Common/CardGrid';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/StatCard';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    images: 0,
    videos: 0,
    totalSize: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState(null);

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchMedia = useCallback(
    async (p = page, l = limit) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: p,
          limit: l,
          ...(searchTerm && { search: searchTerm }),
          ...(typeFilter !== 'all' && { type: typeFilter }),
          ...(categoryFilter !== 'all' && { category: categoryFilter }),
          ...(sortBy && { sort: sortBy }),
        };
        const res = await galleryAPI.getAll(params);
        const items = res.data?.data || res.data?.gallery || res.data || [];
        setMedia(items);
        if (res.data?.pagination) setPagination(res.data.pagination);
        if (res.data?.stats) setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load gallery');
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, searchTerm, typeFilter, categoryFilter, sortBy]
  );

  useEffect(() => {
    fetchMedia(page, limit);
  }, [fetchMedia, page, limit]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchMedia(1, limit);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, typeFilter, categoryFilter, sortBy]);

  // Refresh on upload event
  useEffect(() => {
    const handler = () => {
      setRefreshing(true);
      fetchMedia(1, limit);
    };
    window.addEventListener('gallery:refresh', handler);
    return () => window.removeEventListener('gallery:refresh', handler);
  }, [fetchMedia, limit]);

  // Stats fallback
  useEffect(() => {
    const getStats = async () => {
      try {
        if (galleryAPI.getStats) {
          const res = await galleryAPI.getStats();
          const data = res.data?.data || res.data;
          if (data) setStats(data);
        }
      } catch (e) {
        console.debug('Gallery stats fetch failed', e.message || e);
      }
    };
    getStats();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title || 'this media'}"?`)) return;
    try {
      await galleryAPI.delete(id);
      setMedia(prev => prev.filter(m => (m._id || m.id) !== id));
      toast.success('Media deleted');
      fetchMedia(page, limit);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete media');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMedia(page, limit);
  };

  const totalPages = pagination?.totalPages || pagination?.pages ||
    (pagination?.total ? Math.ceil(pagination.total / limit) : 1);
  const currentPage = pagination?.page || pagination?.currentPage || page;

  const goToPage = (p) => {
    if (!p || p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uniqueCategories = [...new Set(media.map(item => item.category).filter(Boolean))];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Media</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Media Gallery</h1>
          <p className="text-ink-500 text-sm mt-1">Manage images, videos, and documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className={`h-4 w-4 text-ink-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/gallery/upload" className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors">
            <ArrowUpTrayIcon className="h-4 w-4" />
            Upload Media
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Media" value={stats.totalItems || 0} icon={PhotoIcon} loading={loading} tone="laterite" />
        <StatCard label="Images" value={stats.images || 0} icon={PhotoIcon} loading={loading} tone="acacia" />
        <StatCard label="Videos" value={stats.videos || 0} icon={VideoCameraIcon} loading={loading} tone="maize" />
        <StatCard label="Total Size" value={stats.totalSize ? formatBytes(stats.totalSize) : '—'} icon={ChartBarIcon} loading={loading} tone="laterite" />
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search by title, description..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            key: 'type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'image', label: 'Images' },
              { value: 'video', label: 'Videos' },
            ],
          },
          {
            key: 'category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: 'all', label: 'All Categories' },
              ...uniqueCategories.map(cat => ({ value: cat, label: cat })),
            ],
          },
          {
            key: 'sort',
            value: sortBy,
            onChange: setSortBy,
            options: [
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'name', label: 'Name A-Z' },
              { value: 'size', label: 'Size' },
            ],
          },
        ]}
        resultCount={media.length}
        totalCount={pagination?.total || media.length}
        resultLabel="media items"
      />

      {/* Content */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={() => fetchMedia(page, limit)} className="mt-4 text-laterite-500 underline text-xs font-mono">Retry</button>
        </div>
      ) : (
        <CardGrid
          items={media}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No media found</p>
              <Link to="/gallery/upload" className="text-laterite-500 text-xs mt-2 inline-block">Upload first file →</Link>
            </div>
          }
          renderCard={(item) => (
            <div className="bg-white border border-border hover:border-laterite-500/30 transition-colors group">
              <div className="relative aspect-video overflow-hidden border-b border-border">
                {item.thumbnail || item.url ? (
                  <img src={item.thumbnail || item.url} alt={item.title || 'Media'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-parchment-100 flex items-center justify-center">
                    {item.type === 'image' ? <PhotoIcon className="h-12 w-12 text-ink-400" /> : <VideoCameraIcon className="h-12 w-12 text-ink-400" />}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <StatusBadge label={(item.type || 'image').toUpperCase()} variant={item.type === 'image' ? 'acacia' : 'maize'} />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-sans text-sm font-semibold text-ink-800 truncate">{item.title || 'Untitled'}</h4>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>{item.category || 'Uncategorized'}</span>
                  <span className="font-mono">{item.metadata?.size ? formatBytes(item.metadata.size) : '—'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{formatDate(item.createdAt)}</span>
                  {item.views !== undefined && (
                    <span className="flex items-center gap-1"><EyeIcon className="h-3 w-3" />{item.views.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex gap-1">
                    <Link to={`/gallery/view/${item._id || item.id}`} className="p-1 text-ink-500 hover:text-laterite-500"><EyeIcon className="h-4 w-4" /></Link>
                    <Link to={`/gallery/edit/${item._id || item.id}`} className="p-1 text-ink-500 hover:text-laterite-500"><PencilIcon className="h-4 w-4" /></Link>
                  </div>
                  <button onClick={() => handleDelete(item._id || item.id, item.title)} className="p-1 text-ink-500 hover:text-status-danger"><TrashIcon className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <p className="text-xs font-mono text-ink-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1.5 border text-xs font-mono transition-colors ${
                    currentPage === pageNum
                      ? 'bg-soil-900 text-parchment-50 border-soil-900'
                      : 'border-border text-ink-800 hover:border-laterite-500'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="px-3 py-1.5 border border-border bg-white text-xs font-mono text-ink-800 focus:outline-none focus:border-laterite-500"
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Gallery;