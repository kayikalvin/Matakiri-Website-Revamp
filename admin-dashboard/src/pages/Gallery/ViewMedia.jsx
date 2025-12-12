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
  ArrowTopRightOnSquareIcon
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
        // Try to use getById if available
        if (galleryAPI.getById) {
          const res = await galleryAPI.getById(id);
          const mediaData = res.data?.data || res.data;
          setMedia(mediaData);
          
          // Fetch related media
          try {
            const relatedRes = await galleryAPI.getAll({ 
              category: mediaData.category,
              limit: 4 
            });
            const relatedItems = relatedRes.data?.data || relatedRes.data?.gallery || relatedRes.data || [];
            setRelatedMedia(relatedItems.filter(item => 
              String(item._id || item.id) !== String(id)
            ).slice(0, 3));
          } catch (err) {
            console.debug('Failed to fetch related media:', err.message);
          }
        } else {
          // Fallback to fetching all
          const res = await galleryAPI.getAll();
          const items = res.data?.data || res.data?.gallery || res.data || [];
          const found = items.find((item) => String(item._id || item.id) === String(id));
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
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Events: 'bg-green-100 text-green-800',
      Projects: 'bg-yellow-100 text-yellow-800',
      Reports: 'bg-red-100 text-red-800',
      Partners: 'bg-indigo-100 text-indigo-800',
      Education: 'bg-pink-100 text-pink-800',
      Team: 'bg-cyan-100 text-cyan-800',
      Office: 'bg-gray-100 text-gray-800',
      General: 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleDownload = async () => {
    try {
      toast.loading('Preparing download...');
      // Implement download logic here
      // This would typically be a direct link to the file or a download endpoint
      window.open(media.url || media.fileUrl, '_blank');
      toast.dismiss();
      toast.success('Download started');
    } catch (err) {
      toast.error('Failed to download file');
    }
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
      toast.success('Link copied to clipboard');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${media.title}"?`)) return;
    
    try {
      await galleryAPI.delete(id);
      toast.success('Media deleted successfully');
      navigate('/gallery');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete media');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading media details...</p>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Gallery
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium text-lg mb-2">
              {error || 'Media not found'}
            </div>
            <p className="text-gray-600 mb-4">The requested media could not be loaded.</p>
            <button
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Return to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <PhotoIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{media.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(media.category)}`}>
                    <FolderIcon className="h-4 w-4 mr-1" />
                    {media.category || 'Uncategorized'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    media.type === 'image' 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {media.type?.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {media.views?.toLocaleString() || '0'} views
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              </div>
              
              <div className="p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                  {media.type === 'image' ? (
                    media.url || media.fileUrl ? (
                      <img 
                        src={media.url || media.fileUrl} 
                        alt={media.title} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <PhotoIcon className="h-32 w-32 text-gray-300" />
                    )
                  ) : media.type === 'video' ? (
                    media.url || media.fileUrl ? (
                      <video 
                        src={media.url || media.fileUrl} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="relative">
                        <VideoCameraIcon className="h-32 w-32 text-gray-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl">▶</span>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <DocumentTextIcon className="h-32 w-32 text-gray-300" />
                  )}
                </div>
              </div>
              
              <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                    File Type
                  </div>
                  <div className="font-medium text-gray-900">
                    {media.mimeType || media.type || 'Unknown'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                    File Size
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatBytes(media.size || media.fileSize)}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Uploaded
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatDate(media.createdAt || media.uploadedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {media.description || 'No description provided.'}
                  </p>
                </div>
                
                {media.tags && media.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <TagIcon className="h-4 w-4 mr-2" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(media.tags) ? media.tags : media.tags.split(',')).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dimensions</span>
                        <span className="font-medium text-gray-900">
                          {media.dimensions || media.metadata?.dimensions || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-gray-900">
                          {media.duration || media.metadata?.duration || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Resolution</span>
                        <span className="font-medium text-gray-900">
                          {media.resolution || media.metadata?.resolution || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Uploaded By</span>
                        <span className="font-medium text-gray-900">
                          {media.uploadedBy || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Modified</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(media.updatedAt || media.modifiedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">File ID</span>
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    to={`/gallery/edit/${id}`}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <PencilIcon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium text-gray-900">Edit Details</span>
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                  
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <ArrowDownTrayIcon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium text-gray-900">Download File</span>
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <ShareIcon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium text-gray-900">Share</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-between w-full p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <TrashIcon className="h-5 w-5 text-red-500 mr-3" />
                      <span className="font-medium text-red-700">Delete Media</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Related Media */}
            {relatedMedia.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Related Media</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {relatedMedia.map((item) => (
                      <Link
                        key={item._id || item.id}
                        to={`/gallery/view/${item._id || item.id}`}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.type === 'image' ? (
                            <PhotoIcon className="h-6 w-6 text-gray-600" />
                          ) : (
                            <VideoCameraIcon className="h-6 w-6 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate group-hover:text-primary-600">
                            {item.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="capitalize">{item.type}</span>
                            <span className="mx-2">•</span>
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* File Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">File Information</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">File Name</div>
                    <div className="font-mono text-sm text-gray-900 truncate">
                      {media.originalName || media.filename || 'unknown'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Storage Path</div>
                    <div className="font-mono text-sm text-gray-900 truncate">
                      {media.path || media.storagePath || '/'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">URL</div>
                    <a
                      href={media.url || media.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-primary-600 hover:text-primary-700 truncate block"
                    >
                      {media.url || media.fileUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedia;





























// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeftIcon, PhotoIcon, EyeIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

// import { galleryAPI } from '../../services/api';

// const ViewMedia = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [media, setMedia] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMedia = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await galleryAPI.getAll();
//         // Try to find the media by id (API may not have getById)
//         const items = res.data?.gallery || res.data || [];
//         const found = items.find((item) => String(item._id || item.id) === String(id));
//         if (!found) throw new Error('Media not found');
//         setMedia(found);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load media');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="p-6">
//           <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-500">{error}</div>
//     );
//   }
//   if (!media) {
//     return null;
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/gallery')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Gallery
//         </button>
//         <div className="flex items-center">
//           <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
//             <PhotoIcon className="h-6 w-6 text-primary-500" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">{media.title}</h1>
//             <p className="text-gray-600 mt-2">View media details</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Media Preview */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
//             {media.type === 'image' ? (
//               <PhotoIcon className="h-24 w-24 text-gray-400" />
//             ) : (
//               <div className="relative">
//                 <PhotoIcon className="h-24 w-24 text-purple-400" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
//                     <span className="text-white text-2xl">▶</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">Type:</span>
//               <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                 media.type === 'image' ? 'bg-primary-100 text-primary-700' : 'bg-purple-100 text-purple-800'
//               }`}>
//                 {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
//               </span>
//             </div>
            
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">Views:</span>
//               <span className="flex items-center font-medium">
//                 <EyeIcon className="h-4 w-4 mr-1" />
//                 {media.views}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Media Details */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Media Information</h3>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//               <p className="text-gray-900">{media.title}</p>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <p className="text-gray-900">{media.description}</p>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                   <CalendarIcon className="h-4 w-4 mr-1" />
//                   Uploaded
//                 </label>
//                 <p className="text-gray-900">{media.uploaded}</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                   media.category === 'Events' ? 'bg-green-100 text-green-800' :
//                   media.category === 'Projects' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {media.category}
//                 </span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
//                 <p className="text-gray-900">{media.size}</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
//                 <p className="text-gray-900">{media.dimensions}</p>
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                 <TagIcon className="h-4 w-4 mr-1" />
//                 Tags
//               </label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {media.tags.map((tag, index) => (
//                   <span 
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => navigate(`/gallery`)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Back to Gallery
//             </button>
//             <button
//               onClick={() => navigate(`/gallery/upload`)}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
//             >
//               Edit Media
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewMedia;