import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  NewspaperIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { newsAPI } from '../../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0
  });

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Request all articles (include drafts) for admin view
        const res = await newsAPI.getAll({ published: 'all' });
        const payload = res.data && res.data.data ? res.data.data : res.data;
        let newsData = Array.isArray(payload) ? payload : [];

        // Normalize backend shape: backend uses `published` boolean while UI expects `status` string
        newsData = newsData.map(item => ({
          ...item,
          status: item.status || (item.published ? 'published' : 'draft')
        }));

        setNews(newsData);
        
        // Calculate stats
        const total = newsData.length;
        const published = newsData.filter(item => item.status === 'published').length;
        const drafts = newsData.filter(item => item.status === 'draft').length;
        const totalViews = newsData.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
        
        setStats({ total, published, drafts, totalViews });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Education': 'bg-primary-100 text-primary-800',
      'Reports': 'bg-purple-100 text-purple-800',
      'Health': 'bg-red-100 text-red-800',
      'Partners': 'bg-indigo-100 text-indigo-800',
      'Events': 'bg-green-100 text-green-800',
      'Announcements': 'bg-amber-100 text-amber-800',
      'Research': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setError(null);
    try {
      await newsAPI.delete(id);
      // remove from list and update stats
      setNews(prev => {
        const updated = prev.filter(n => (n._id || n.id) !== id);
        const total = updated.length;
        const published = updated.filter(item => item.status === 'published').length;
        const drafts = updated.filter(item => item.status === 'draft').length;
        const totalViews = updated.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
        setStats({ total, published, drafts, totalViews });
        return updated;
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete article');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(news.map(item => item.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading news articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium text-lg mb-2">Error Loading News</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">News Articles</h1>
            <p className="text-gray-600 mt-2">Manage news, announcements, and publications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <Link
              to="/news/create"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add News Article
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <NewspaperIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All time articles</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.published}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <NewspaperIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Live articles</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.drafts}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <NewspaperIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">In progress</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All articles combined</p>
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
                placeholder="Search articles by title or content..."
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
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredNews.length}</span> of <span className="font-semibold">{news.length}</span> articles
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">News Articles</h3>
            <p className="text-sm text-gray-600 mt-1">Manage all published and draft articles</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <NewspaperIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No articles found</p>
                        <p className="text-gray-400 text-sm mb-4">
                          {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Get started by creating your first article'}
                        </p>
                        <Link
                          to="/news/create"
                          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Article
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                            {item.title || 'Untitled'}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                            <UserIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900">
                            {item.author?.name || item.author || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(item.publishedAt || item.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <EyeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{(Number(item.views) || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${item.status === 'published' ? 'bg-green-500' : item.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/news/${item._id || item.id}`}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/news/edit/${item._id || item.id}`}
                            className="p-1.5 text-primary-500 hover:text-primary-700 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => handleDelete(item._id || item.id)}
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredNews.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {Math.min(filteredNews.length, 10)} of {filteredNews.length} results
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;


















// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   NewspaperIcon, 
//   PencilIcon, 
//   TrashIcon, 
//   PlusIcon,
//   EyeIcon,
//   CalendarIcon,
//   UserIcon 
// } from '@heroicons/react/24/outline';

// import { useEffect } from 'react';
// import { newsAPI } from '../../services/api';

// const News = () => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await newsAPI.getAll();
//         // Accept API shapes: res.data.data or res.data
//         const payload = res.data && res.data.data ? res.data.data : res.data;
//         setNews(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load news');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);
//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-500">{error}</div>
//     );
//   }

//   const getStatusColor = (status) => {
//     return status === 'published' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-yellow-100 text-yellow-800';
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       'Education': 'bg-primary-100 text-primary-800',
//       'Reports': 'bg-purple-100 text-purple-800',
//       'Health': 'bg-red-100 text-red-800',
//       'Partners': 'bg-indigo-100 text-indigo-800',
//       'Events': 'bg-green-100 text-green-800',
//     };
//     return colors[category] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">News Articles</h1>
//           <p className="text-gray-600 mt-2">Manage news and announcements</p>
//         </div>
//         <Link
//           to="/news/create"
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add News
//         </Link>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
//               <NewspaperIcon className="h-5 w-5 text-primary-500" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Articles</p>
//               <p className="text-2xl font-bold">48</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//               <NewspaperIcon className="h-5 w-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Published</p>
//               <p className="text-2xl font-bold">42</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
//               <NewspaperIcon className="h-5 w-5 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Drafts</p>
//               <p className="text-2xl font-bold">6</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
//               <EyeIcon className="h-5 w-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Views</p>
//               <p className="text-2xl font-bold">12,456</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* News Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="px-4 py-5 sm:px-6">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">News Articles</h3>
//           <p className="mt-1 max-w-2xl text-sm text-gray-500">All published and draft articles</p>
//         </div>
//         <div className="border-t border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {news.map((item) => (
//                 <tr key={item._id || item.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{item.title || 'Untitled'}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
//                       {item.category || 'General'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
//                       <span className="text-sm text-gray-900">{(item.author && (item.author.name || item.author)) || '—'}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <CalendarIcon className="h-4 w-4 mr-1" />
//                       {item.publishedAt || item.date || ''}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <EyeIcon className="h-4 w-4 mr-1" />
//                       {(Number(item.views) || 0).toLocaleString()}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
//                       {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : '—'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <Link
//                         to={`/news/edit/${item._id || item.id}`}
//                           className="text-primary-500 hover:text-primary-700"
//                       >
//                         <PencilIcon className="h-5 w-5" />
//                       </Link>
//                       <button
//                         className="text-red-600 hover:text-red-900"
//                         onClick={() => console.log('Delete news', item._id || item.id)}
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default News;