import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  FolderIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

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
    categories: {}
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState(null);
  const refreshTimeoutRef = useRef(null);

  const formatBytes = (bytes) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    return type === 'image' 
      ? 'bg-primary-100 text-primary-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Events: 'bg-green-100 text-green-800',
      Projects: 'bg-yellow-100 text-yellow-800',
      Reports: 'bg-red-100 text-red-800',
      Partners: 'bg-indigo-100 text-indigo-800',
      Education: 'bg-pink-100 text-pink-800',
      Team: 'bg-cyan-100 text-cyan-800',
      Office: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const fetchMedia = useCallback(async (p = page, l = limit) => {
    setLoading(true);
    setError(null);
    try {
      const params = { 
        page: p, 
        limit: l,
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(sortBy && { sort: sortBy })
      };
      
      const res = await galleryAPI.getAll(params);
      const items = res.data?.data || res.data?.gallery || res.data || [];
      setMedia(items);
      if (res.data?.pagination) setPagination(res.data.pagination);
      
      // Update stats if available in response
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load gallery');
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, searchTerm, typeFilter, categoryFilter, sortBy]);

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

  // Event listener for uploads
  useEffect(() => {
    const handler = () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshing(true);
        fetchMedia(1, limit);
      }, 500);
    };
    window.addEventListener('gallery:refresh', handler);
    return () => {
      window.removeEventListener('gallery:refresh', handler);
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [fetchMedia, limit]);

  // Fetch stats on mount
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

  const handleDelete = (id, title) => {
    toast((t) => (
      <span>
        Are you sure you want to delete <b>{title || 'this media'}</b>?<br/>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              await galleryAPI.delete(id);
              setMedia(prev => prev.filter(m => (m._id || m.id) !== id));
              toast.success('Media deleted successfully');
              fetchMedia(page, limit);
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed to delete media');
            }
          }}
          className="mt-2 mr-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </span>
    ), { duration: 8000 });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMedia(page, limit);
  };

  const handleBulkSelect = (e, id) => {
    // Implementation for bulk selection
    console.log('Selected:', id, e.target.checked);
  };

  const totalPages = pagination?.totalPages || pagination?.pages || 
    (pagination?.total ? Math.ceil(pagination.total / limit) : 1);
  const currentPage = pagination?.page || pagination?.currentPage || page;

  const goToPage = (p) => {
    if (!p || p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => goToPage(currentPage - 1);
  const handleNextPage = () => goToPage(currentPage + 1);

  const uniqueCategories = [...new Set(media.map(item => item.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Media Gallery</h1>
            <p className="text-gray-600 mt-1">Manage images, videos, and documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/gallery/upload"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload Media
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Media</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems || 0}</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All media items</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Images</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.images || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Videos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.videos || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <VideoCameraIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">MP4, MOV, AVI</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Size</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalSize ? formatBytes(stats.totalSize) : '—'}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Storage used</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, description..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">Size</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{media.length}</span> media items
            {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all') && ' (filtered)'}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setCategoryFilter('all');
              setSortBy('newest');
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* Media Grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Media Library</h3>
            <p className="text-sm text-gray-600 mt-1">All uploaded media files</p>
          </div>
          
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading media...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="text-red-500 font-medium mb-2">Failed to load media</div>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => fetchMedia(page, limit)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          ) : media.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No media found</p>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms' 
                  : 'Get started by uploading your first media file'}
              </p>
              <Link
                to="/gallery/upload"
                className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Upload Media
              </Link>
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {media.map((item) => (
                    <div 
                      key={item._id || item.id} 
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 bg-white group"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {item.thumbnail || item.url ? (
                          <img 
                            src={item.thumbnail || item.url} 
                            alt={item.title || 'Media'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            {item.type === 'image' ? (
                              <PhotoIcon className="h-16 w-16 text-gray-300" />
                            ) : (
                              <div className="relative">
                                <VideoCameraIcon className="h-16 w-16 text-gray-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">▶</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <Link
                              to={`/gallery/view/${item._id || item.id}`}
                              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5 text-gray-700" />
                            </Link>
                            <Link
                              to={`/gallery/edit/${item._id || item.id}`}
                              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5 text-primary-600" />
                            </Link>
                          </div>
                        </div>
                        
                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate" title={item.title}>
                          {item.title || 'Untitled'}
                        </h4>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                            {item.category || 'Uncategorized'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.metadata?.size ? formatBytes(item.metadata.size) : '-'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                          {item.views !== undefined && (
                            <div className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {item.views.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="text-sm text-gray-500 truncate mr-2">
                            {item.description && (
                              <p className="truncate" title={item.description}>
                                {item.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id || item.id, item.title)}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Page <span className="font-semibold">{currentPage}</span> of{' '}
                      <span className="font-semibold">{totalPages}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-primary-600 text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Show:</span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setPage(1);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;











// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   PhotoIcon,
//   PencilIcon,
//   TrashIcon,
//   PlusIcon,
//   EyeIcon,
//   CalendarIcon
// } from '@heroicons/react/24/outline';
// import { galleryAPI } from '../../services/api';
// import { Toaster, toast } from 'react-hot-toast';

// const Gallery = () => {
//   const [media, setMedia] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({ totalItems: 0, images: 0, videos: 0, totalSize: 0 });

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(12);
//   const [pagination, setPagination] = useState(null);
//   const refreshTimeoutRef = useRef(null);

//   const formatBytes = (bytes) => {
//     if (!bytes) return '-';
//     const kb = bytes / 1024;
//     if (kb < 1024) return `${Math.round(kb)} KB`;
//     return `${(kb / 1024).toFixed(2)} MB`;
//   };

//   const getTypeColor = (type) => (type === 'image' ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800');

//   const getCategoryColor = (category) => {
//     const colors = {
//       Events: 'bg-green-100 text-green-800',
//       Projects: 'bg-yellow-100 text-yellow-800',
//       Reports: 'bg-red-100 text-red-800',
//       Partners: 'bg-indigo-100 text-indigo-800',
//       Education: 'bg-pink-100 text-pink-800'
//     };
//     return colors[category] || 'bg-gray-100 text-gray-800';
//   };

//   const fetchMedia = useCallback(async (p = page, l = limit) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await galleryAPI.getAll({ page: p, limit: l });
//       const items = res.data?.data || res.data?.gallery || res.data || [];
//       setMedia(items);
//       if (res.data?.pagination) setPagination(res.data.pagination);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to load gallery');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit]);

//   useEffect(() => {
//     fetchMedia(page, limit);
//   }, [fetchMedia, page, limit]);

//   // Debounced refresh handler for uploads
//   useEffect(() => {
//     const handler = () => {
//       if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
//       refreshTimeoutRef.current = setTimeout(() => {
//         fetchMedia(1, limit);
//         refreshTimeoutRef.current = null;
//       }, 250);
//     };
//     window.addEventListener('gallery:refresh', handler);
//     return () => {
//       window.removeEventListener('gallery:refresh', handler);
//       if (refreshTimeoutRef.current) {
//         clearTimeout(refreshTimeoutRef.current);
//         refreshTimeoutRef.current = null;
//       }
//     };
//   }, [fetchMedia, limit]);

//   // fetch stats
//   useEffect(() => {
//     const getStats = async () => {
//       try {
//         const res = await galleryAPI.getAll({ page: 1, limit: 1 });
//         // some APIs return stats from a separate endpoint; try getStats if available
//         if (galleryAPI.getStats) {
//           const s = await galleryAPI.getStats();
//           const data = s.data?.data || s.data;
//           if (data) setStats(data);
//         } else if (res.data) {
//           // infer simple stats
//           setStats(prev => ({ ...prev, totalItems: res.data.pagination?.total || (res.data?.length || media.length) }));
//         }
//       } catch (e) {
//         // ignore stats errors but keep console for debugging
//         console.debug('Gallery stats fetch failed', e.message || e);
//       }
//     };
//     getStats();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this media item?')) return;
//     try {
//       await galleryAPI.delete(id);
//       setMedia(prev => prev.filter(m => (m._id || m.id) !== id));
//       toast.success('Media deleted');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete');
//     }
//   };

//   const totalPages = pagination?.totalPages || pagination?.pages || (pagination?.total ? Math.ceil(pagination.total / limit) : null);
//   const currentPage = pagination?.page || pagination?.currentPage || page;

//   const goToPage = (p) => {
//     if (!p || p < 1) return;
//     setPage(p);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePrevPage = () => goToPage(currentPage > 1 ? currentPage - 1 : 1);
//   const handleNextPage = () => (totalPages ? goToPage(currentPage < totalPages ? currentPage + 1 : totalPages) : goToPage(page + 1));
//   const handleLimitChange = (e) => { setLimit(Number(e.target.value) || 12); setPage(1); };

//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
//           <p className="text-gray-600 mt-2">Manage images and videos</p>
//         </div>
//         <Link to="/gallery/upload" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600">
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Upload Media
//         </Link>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3"><PhotoIcon className="h-5 w-5 text-primary-500" /></div>
//             <div>
//               <p className="text-sm text-gray-500">Total Media</p>
//               <p className="text-2xl font-bold">{stats.totalItems || 0}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3"><PhotoIcon className="h-5 w-5 text-green-600" /></div>
//             <div>
//               <p className="text-sm text-gray-500">Images</p>
//               <p className="text-2xl font-bold">{stats.images || 0}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3"><EyeIcon className="h-5 w-5 text-purple-600" /></div>
//             <div>
//               <p className="text-sm text-gray-500">Videos</p>
//               <p className="text-2xl font-bold">{stats.videos || 0}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3"><EyeIcon className="h-5 w-5 text-yellow-600" /></div>
//             <div>
//               <p className="text-sm text-gray-500">Total Size</p>
//               <p className="text-2xl font-bold">{stats.totalSize ? formatBytes(stats.totalSize) : '—'}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-900">Recent Media</h3>
//           <p className="text-sm text-gray-500">Recently uploaded media files</p>
//         </div>

//         {loading ? (
//           <div className="text-center py-8 text-gray-500">Loading gallery...</div>
//         ) : error ? (
//           <div className="text-center py-8 text-red-500">{error}</div>
//         ) : media.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">No media found.</div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {media.map((item) => (
//                 <div key={item._id || item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                   {item.thumbnail || item.url ? (
//                     <img src={item.thumbnail || item.url} alt={item.title || 'Media'} className="h-48 w-full object-cover" loading="lazy" />
//                   ) : (
//                     <div className="h-48 bg-gray-100 flex items-center justify-center">
//                       {item.type === 'image' ? <PhotoIcon className="h-16 w-16 text-gray-400" /> : (
//                         <div className="relative"><PhotoIcon className="h-16 w-16 text-purple-400" /><div className="absolute inset-0 flex items-center justify-center"><div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center"><span className="text-white text-sm">▶</span></div></div></div>
//                       )}
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
//                       <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>{item.type}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
//                       <span className={`inline-flex px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>{item.category}</span>
//                       <span className="flex items-center"><EyeIcon className="h-4 w-4 mr-1" />{item.metadata?.size ? formatBytes(item.metadata.size) : '-'}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm text-gray-500 mb-4"><span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1" />{item.createdAt ? item.createdAt.slice(0,10) : ''}</span></div>
//                     <div className="flex justify-between border-t border-gray-100 pt-3">
//                       <Link to={`/gallery/view/${item._id || item.id}`} className="text-primary-500 hover:text-primary-700 flex items-center"><EyeIcon className="h-4 w-4 mr-1" />View</Link>
//                       <div className="flex space-x-2">
//                         <button className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-4 w-4" /></button>
//                         <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(item._id || item.id)}><TrashIcon className="h-4 w-4" /></button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <button onClick={handlePrevPage} disabled={currentPage <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
//                 <button onClick={handleNextPage} className="px-3 py-1 border rounded">Next</button>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm text-gray-600">Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}</span>
//                 <label className="text-sm text-gray-500">Per page:</label>
//                 <select value={limit} onChange={handleLimitChange} className="p-1 border rounded"><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Gallery;