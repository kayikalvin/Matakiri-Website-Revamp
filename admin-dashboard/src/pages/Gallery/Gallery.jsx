// import React from 'react';

// const Gallery = () => {
//   const images = [
//     { id: 1, title: 'Community Meeting', category: 'events', date: '2024-01-15' },
//     { id: 2, title: 'School Construction', category: 'projects', date: '2024-01-10' },
//     { id: 3, title: 'Medical Camp', category: 'health', date: '2023-12-20' },
//     { id: 4, title: 'Farm Training', category: 'agriculture', date: '2023-12-15' },
//     { id: 5, title: 'Infrastructure Work', category: 'projects', date: '2023-12-10' },
//     { id: 6, title: 'Youth Program', category: 'education', date: '2023-12-05' },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
//           <p className="text-gray-600 mt-2">Manage photos and media files</p>
//         </div>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           Upload Media
//         </button>
//       </div>

//       {/* Gallery Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {images.map((image) => (
//           <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="h-48 bg-gray-200 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-4xl mb-2">📷</div>
//                 <p className="text-sm text-gray-600">Image Preview</p>
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="font-medium text-gray-900">{image.title}</h3>
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-sm text-gray-500">{image.category}</span>
//                 <span className="text-sm text-gray-500">{image.date}</span>
//               </div>
//               <div className="flex space-x-2 mt-3">
//                 <button className="text-sm text-blue-600 hover:text-blue-800">
//                   View
//                 </button>
//                 <button className="text-sm text-red-600 hover:text-red-800">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {images.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-6xl mb-4">🖼️</div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No media yet</h3>
//           <p className="text-gray-600">Upload your first image to get started</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Gallery;




import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalItems: 0, images: 0, videos: 0, totalSize: 0 });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState(null);
  const refreshTimeoutRef = useRef(null);

  const formatBytes = (bytes) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const getTypeColor = (type) => (type === 'image' ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800');

  const getCategoryColor = (category) => {
    const colors = {
      Events: 'bg-green-100 text-green-800',
      Projects: 'bg-yellow-100 text-yellow-800',
      Reports: 'bg-red-100 text-red-800',
      Partners: 'bg-indigo-100 text-indigo-800',
      Education: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const fetchMedia = useCallback(async (p = page, l = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await galleryAPI.getAll({ page: p, limit: l });
      const items = res.data?.data || res.data?.gallery || res.data || [];
      setMedia(items);
      if (res.data?.pagination) setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchMedia(page, limit);
  }, [fetchMedia, page, limit]);

  // Debounced refresh handler for uploads
  useEffect(() => {
    const handler = () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = setTimeout(() => {
        fetchMedia(1, limit);
        refreshTimeoutRef.current = null;
      }, 250);
    };
    window.addEventListener('gallery:refresh', handler);
    return () => {
      window.removeEventListener('gallery:refresh', handler);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [fetchMedia, limit]);

  // fetch stats
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await galleryAPI.getAll({ page: 1, limit: 1 });
        // some APIs return stats from a separate endpoint; try getStats if available
        if (galleryAPI.getStats) {
          const s = await galleryAPI.getStats();
          const data = s.data?.data || s.data;
          if (data) setStats(data);
        } else if (res.data) {
          // infer simple stats
          setStats(prev => ({ ...prev, totalItems: res.data.pagination?.total || (res.data?.length || media.length) }));
        }
      } catch (e) {
        // ignore stats errors but keep console for debugging
        console.debug('Gallery stats fetch failed', e.message || e);
      }
    };
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media item?')) return;
    try {
      await galleryAPI.delete(id);
      setMedia(prev => prev.filter(m => (m._id || m.id) !== id));
      toast.success('Media deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const totalPages = pagination?.totalPages || pagination?.pages || (pagination?.total ? Math.ceil(pagination.total / limit) : null);
  const currentPage = pagination?.page || pagination?.currentPage || page;

  const goToPage = (p) => {
    if (!p || p < 1) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => goToPage(currentPage > 1 ? currentPage - 1 : 1);
  const handleNextPage = () => (totalPages ? goToPage(currentPage < totalPages ? currentPage + 1 : totalPages) : goToPage(page + 1));
  const handleLimitChange = (e) => { setLimit(Number(e.target.value) || 12); setPage(1); };

  return (
    <div className="p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-600 mt-2">Manage images and videos</p>
        </div>
        <Link to="/gallery/upload" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600">
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Media
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3"><PhotoIcon className="h-5 w-5 text-primary-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Media</p>
              <p className="text-2xl font-bold">{stats.totalItems || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3"><PhotoIcon className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-2xl font-bold">{stats.images || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3"><EyeIcon className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Videos</p>
              <p className="text-2xl font-bold">{stats.videos || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3"><EyeIcon className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-2xl font-bold">{stats.totalSize ? formatBytes(stats.totalSize) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Media</h3>
          <p className="text-sm text-gray-500">Recently uploaded media files</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading gallery...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : media.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No media found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div key={item._id || item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {item.thumbnail || item.url ? (
                    <img src={item.thumbnail || item.url} alt={item.title || 'Media'} className="h-48 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      {item.type === 'image' ? <PhotoIcon className="h-16 w-16 text-gray-400" /> : (
                        <div className="relative"><PhotoIcon className="h-16 w-16 text-purple-400" /><div className="absolute inset-0 flex items-center justify-center"><div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center"><span className="text-white text-sm">▶</span></div></div></div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>{item.category}</span>
                      <span className="flex items-center"><EyeIcon className="h-4 w-4 mr-1" />{item.metadata?.size ? formatBytes(item.metadata.size) : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4"><span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1" />{item.createdAt ? item.createdAt.slice(0,10) : ''}</span></div>
                    <div className="flex justify-between border-t border-gray-100 pt-3">
                      <Link to={`/gallery/view/${item._id || item.id}`} className="text-primary-500 hover:text-primary-700 flex items-center"><EyeIcon className="h-4 w-4 mr-1" />View</Link>
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-900"><PencilIcon className="h-4 w-4" /></button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(item._id || item.id)}><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button onClick={handlePrevPage} disabled={currentPage <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                <button onClick={handleNextPage} className="px-3 py-1 border rounded">Next</button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}</span>
                <label className="text-sm text-gray-500">Per page:</label>
                <select value={limit} onChange={handleLimitChange} className="p-1 border rounded"><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;