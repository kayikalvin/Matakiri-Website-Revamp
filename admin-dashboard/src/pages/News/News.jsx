import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { newsAPI } from '../../services/api';
import {
  NewspaperIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import FilterBar from '../../components/Common/FilterBar';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/StatCard';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsAPI.getAll({ published: 'all' });
      const payload = res.data?.data || res.data;
      let newsData = Array.isArray(payload) ? payload : [];
      newsData = newsData.map(item => ({
        ...item,
        status: item.status || (item.published ? 'published' : 'draft'),
      }));
      setNews(newsData);
      toast.success('News loaded');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load news');
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title || 'Untitled Article'}"? This cannot be undone.`)) return;
    try {
      await newsAPI.delete(id);
      setNews(prev => prev.filter(n => (n._id || n.id) !== id));
      toast.success('Article deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: news.length,
    published: news.filter(item => item.status === 'published').length,
    drafts: news.filter(item => item.status === 'draft').length,
    totalViews: news.reduce((sum, item) => sum + (Number(item.views) || 0), 0),
  };

  const uniqueCategories = [...new Set(news.map(item => item.category).filter(Boolean))];

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns = [
    {
      key: 'title',
      header: 'Article',
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-ink-800 font-sans line-clamp-1">{row.title || 'Untitled'}</div>
          {row.description && (
            <div className="text-xs text-ink-500 line-clamp-1 mt-0.5">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-xs font-mono text-ink-600">{row.category || 'General'}</span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-parchment-100 border border-border flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-ink-500" />
          </div>
          <span className="text-xs">{row.author?.name || row.author || '—'}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <CalendarIcon className="h-3.5 w-3.5" />
          {formatDate(row.publishedAt || row.date)}
        </div>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
          <EyeIcon className="h-3.5 w-3.5 text-ink-500" />
          {(Number(row.views) || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          label={row.status || 'Draft'}
          variant={row.status === 'published' ? 'success' : 'warning'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-1',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/news/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="View">
            <EyeIcon className="h-4 w-4" />
          </Link>
          <Link to={`/news/edit/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="Edit">
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row._id || row.id, row.title)}
            className="p-1.5 text-ink-500 hover:text-status-danger"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">News</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">News & Updates</h1>
          <p className="text-ink-500 text-sm mt-1">Manage articles, announcements, and publications</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchNews} className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors" title="Refresh">
            <ArrowPathIcon className="h-4 w-4 text-ink-500" />
          </button>
          <Link to="/news/create" className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors">
            <PlusIcon className="h-4 w-4" />
            Add Article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Articles" value={stats.total} icon={NewspaperIcon} loading={loading} tone="laterite" />
        <StatCard label="Published" value={stats.published} icon={NewspaperIcon} loading={loading} tone="acacia" />
        <StatCard label="Drafts" value={stats.drafts} icon={NewspaperIcon} loading={loading} tone="maize" />
        <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} icon={ChartBarIcon} loading={loading} tone="laterite" />
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search articles by title or content..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
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
            key: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ],
          },
        ]}
        resultCount={filteredNews.length}
        totalCount={news.length}
        resultLabel="articles"
      />

      {/* Content */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={fetchNews} className="mt-4 text-laterite-500 underline text-xs font-mono">Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredNews}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No articles found</p>
              {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
                <Link to="/news/create" className="text-laterite-500 text-xs mt-2 inline-block">Create first article →</Link>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};

export default News;