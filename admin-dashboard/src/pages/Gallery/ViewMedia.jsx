import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, EyeIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

const ViewMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState(null);

  useEffect(() => {
    // Simulate fetching media data
    setTimeout(() => {
      // Mock media data
      const mockMedia = {
        id: parseInt(id),
        title: 'Community Event',
        description: 'Annual community gathering with local partners and beneficiaries',
        type: 'image',
        category: 'Events',
        uploaded: '2024-01-15',
        views: 245,
        size: '2.4 MB',
        dimensions: '1920x1080',
        tags: ['community', 'event', '2024', 'gathering']
      };
      setMedia(mockMedia);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/gallery')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Gallery
        </button>
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <PhotoIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{media.title}</h1>
            <p className="text-gray-600 mt-2">View media details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Preview */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            {media.type === 'image' ? (
              <PhotoIcon className="h-24 w-24 text-gray-400" />
            ) : (
              <div className="relative">
                <PhotoIcon className="h-24 w-24 text-purple-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Type:</span>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                media.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Views:</span>
              <span className="flex items-center font-medium">
                <EyeIcon className="h-4 w-4 mr-1" />
                {media.views}
              </span>
            </div>
          </div>
        </div>

        {/* Media Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Media Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900">{media.title}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{media.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Uploaded
                </label>
                <p className="text-gray-900">{media.uploaded}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  media.category === 'Events' ? 'bg-green-100 text-green-800' :
                  media.category === 'Projects' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {media.category}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <p className="text-gray-900">{media.size}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <p className="text-gray-900">{media.dimensions}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {media.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/gallery`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Gallery
            </button>
            <button
              onClick={() => navigate(`/gallery/upload`)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedia;