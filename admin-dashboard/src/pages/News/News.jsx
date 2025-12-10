// import React from 'react';

// const News = () => {
//   const newsItems = [
//     { id: 1, title: 'New Community Center Opening', date: '2024-01-20', status: 'published', author: 'Admin' },
//     { id: 2, title: 'Annual Report 2023 Released', date: '2024-01-15', status: 'published', author: 'Editor' },
//     { id: 3, title: 'Upcoming Health Awareness Camp', date: '2024-01-25', status: 'draft', author: 'Admin' },
//     { id: 4, title: 'Success Story: Local Farmer Training', date: '2024-01-10', status: 'published', author: 'Reporter' },
//     { id: 5, title: 'Partnership with New Organization', date: '2024-01-05', status: 'published', author: 'Admin' },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'published': return 'bg-green-100 text-green-800';
//       case 'draft': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">News & Articles</h1>
//           <p className="text-gray-600 mt-2">Manage news content and announcements</p>
//         </div>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           Create News
//         </button>
//       </div>

//       {/* News Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Author
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {newsItems.map((item) => (
//               <tr key={item.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{item.title}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{item.date}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
//                     {item.status.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.author}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-blue-600 hover:text-blue-900 mr-3">
//                     Edit
//                   </button>
//                   <button className="text-red-600 hover:text-red-900">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Empty State */}
//         {newsItems.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📰</div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No news articles yet</h3>
//             <p className="text-gray-600">Create your first news article to get started</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default News;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  NewspaperIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon 
} from '@heroicons/react/24/outline';

import { useEffect } from 'react';
import { newsAPI } from '../../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsAPI.getAll();
        // Accept API shapes: res.data.data or res.data
        const payload = res.data && res.data.data ? res.data.data : res.data;
        setNews(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">{error}</div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Education': 'bg-primary-100 text-primary-800',
      'Reports': 'bg-purple-100 text-purple-800',
      'Health': 'bg-red-100 text-red-800',
      'Partners': 'bg-indigo-100 text-indigo-800',
      'Events': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">News Articles</h1>
          <p className="text-gray-600 mt-2">Manage news and announcements</p>
        </div>
        <Link
          to="/news/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add News
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <NewspaperIcon className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Articles</p>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <NewspaperIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <NewspaperIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <EyeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">12,456</p>
            </div>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">News Articles</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All published and draft articles</p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title || 'Untitled'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{(item.author && (item.author.name || item.author)) || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {item.publishedAt || item.date || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {(Number(item.views) || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/news/edit/${item._id || item.id}`}
                          className="text-primary-500 hover:text-primary-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => console.log('Delete news', item._id || item.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default News;