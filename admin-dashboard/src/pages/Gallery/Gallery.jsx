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




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhotoIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Gallery = () => {
  const [media] = useState([
    { id: 1, title: 'Community Event', type: 'image', category: 'Events', uploaded: '2024-01-15', views: 245 },
    { id: 2, title: 'Project Inauguration', type: 'image', category: 'Projects', uploaded: '2024-01-20', views: 189 },
    { id: 3, title: 'Annual Report Video', type: 'video', category: 'Reports', uploaded: '2024-02-01', views: 312 },
    { id: 4, title: 'Partner Meeting', type: 'image', category: 'Partners', uploaded: '2024-02-10', views: 156 },
    { id: 5, title: 'School Donation', type: 'image', category: 'Education', uploaded: '2024-02-15', views: 278 },
  ]);

  const getTypeColor = (type) => {
    return type === 'image' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Events': 'bg-green-100 text-green-800',
      'Projects': 'bg-yellow-100 text-yellow-800',
      'Reports': 'bg-red-100 text-red-800',
      'Partners': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-600 mt-2">Manage images and videos</p>
        </div>
        <Link
          to="/gallery/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Media
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <PhotoIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Media</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <PhotoIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-2xl font-bold">142</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <EyeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Videos</p>
              <p className="text-2xl font-bold">14</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <EyeIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">3,245</p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Media</h3>
          <p className="text-sm text-gray-500">Recently uploaded media files</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {item.type === 'image' ? (
                  <PhotoIcon className="h-16 w-16 text-gray-400" />
                ) : (
                  <div className="relative">
                    <PhotoIcon className="h-16 w-16 text-purple-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">▶</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className={`inline-flex px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {item.views} views
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {item.uploaded}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <Link
                    to={`/gallery/view/${item.id}`}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <div className="flex space-x-2">
                    <button className="text-gray-600 hover:text-gray-900">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;