// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

// const LatestNews = () => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fallback news items for demo
//   const fallbackNews = [
//     {
//       id: 1,
//       title: "AI-Powered Agriculture Initiative Launches in Kisumu",
//       excerpt: "New AI tools help local farmers increase crop yields by 40% through predictive analytics.",
//       date: "2024-01-15",
//       image: "https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//     },
//     {
//       id: 2,
//       title: "Community Digital Literacy Program Expands",
//       excerpt: "Over 1,000 community members trained in digital skills through our learning centers.",
//       date: "2024-01-10",
//       image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//     },
//     {
//       id: 3,
//       title: "New Partnership with Nairobi Tech Hub",
//       excerpt: "Collaboration aims to bring innovative AI solutions to rural healthcare clinics.",
//       date: "2024-01-05",
//       image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//     }
//   ];

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const { data } = await require('../../services/api').newsAPI.getLatest();
//         setNews(data?.slice(0, 3) || []);
//       } catch (err) {
//         console.error('News API error:', err);
//         // Use fallback news for demo
//         setNews(fallbackNews);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center mb-4">
//             <div className="w-8 h-0.5 bg-emerald-300 mr-3"></div>
//             <span className="text-sm font-medium text-emerald-600 tracking-wider">LATEST UPDATES</span>
//             <div className="w-8 h-0.5 bg-emerald-300 ml-3"></div>
//           </div>
          
//           <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
//             Latest <span className="font-medium text-emerald-700">News & Updates</span>
//           </h2>
          
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Stay updated with our latest developments, success stories, and community impact.
//           </p>
//         </div>

//         {/* News Grid */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
//             <div className="mt-4 text-gray-500">Loading news...</div>
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500 py-8">{error}</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             {news.map((item) => (
//               <div 
//                 key={item?._id || item?.id || item?.slug} 
//                 className="group bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 overflow-hidden"
//               >
//                 {/* Image Container */}
//                 <div className="h-48 overflow-hidden bg-neutral-100">
//                   {item?.images && item?.images[0] && item?.images[0].url ? (
//                     <img
//                       src={(() => {
//                         const src = item.images[0].url;
//                         if (src && src.startsWith('/api/uploads')) {
//                           const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
//                           return `${base}${src.replace('/api/uploads', '/uploads')}`;
//                         }
//                         return src;
//                       })()}
//                       alt={item?.title || 'News'}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//                       }}
//                     />
//                   ) : item?.image ? (
//                     <img
//                       src={(() => {
//                         const src = item.image;
//                         if (src && src.startsWith('/api/uploads')) {
//                           const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
//                           return `${base}${src.replace('/api/uploads', '/uploads')}`;
//                         }
//                         return src;
//                       })()}
//                       alt={item?.title || 'News'}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
//                       <span className="text-primary-400">No Image</span>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Content */}
//                 <div className="p-6">
//                   {/* Date */}
//                   <div className="flex items-center text-sm text-gray-500 mb-3">
//                     <FaCalendarAlt className="w-3 h-3 mr-2 text-emerald-400" />
//                     <span>{formatDate(item?.publishedAt || item?.date || item?.createdAt)}</span>
//                   </div>
                  
//                   {/* Title */}
//                   <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
//                     {item?.title || 'Untitled Article'}
//                   </h3>
                  
//                   {/* Excerpt */}
//                   <p className="text-gray-600 mb-4 text-sm line-clamp-3">
//                     {item?.excerpt || item?.description || 'No description available.'}
//                   </p>
                  
//                   {/* Read More Link */}
//                   {/* <Link
//                     to={`/news/${item?.slug || item?._id || item?.id || ''}`}
//                     className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors"
//                   >
//                     Read More
//                     <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </Link> */}
//                 </div>
                
//                 {/* Hover Indicator */}
//                 <div className="px-6 pb-4">
//                   <div className="w-full h-0.5 bg-gray-100 group-hover:bg-gradient-to-r from-emerald-300 to-teal-300 transition-all duration-300"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* View All Button */}
//         <div className="text-center">
//           <Link
//             to="/news"
//             className="inline-flex items-center bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300"
//           >
//             View All News
//             <FaArrowRight className="w-4 h-4 ml-2" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LatestNews;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback news items for demo
  const fallbackNews = [
    {
      id: 1,
      title: "AI-Powered Agriculture Initiative Launches in Kisumu",
      excerpt: "New AI tools help local farmers increase crop yields by 40% through predictive analytics.",
      date: "2024-01-15",
      image: "https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Community Digital Literacy Program Expands",
      excerpt: "Over 1,000 community members trained in digital skills through our learning centers.",
      date: "2024-01-10",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "New Partnership with Nairobi Tech Hub",
      excerpt: "Collaboration aims to bring innovative AI solutions to rural healthcare clinics.",
      date: "2024-01-05",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').newsAPI.getLatest();
        setNews(data?.slice(0, 3) || []);
      } catch (err) {
        console.error('News API error:', err);
        // Use fallback news for demo
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get image URL
  const getImageUrl = (item) => {
    // First check if there are images array with URL
    if (item?.images && item.images[0] && item.images[0].url) {
      const src = item.images[0].url;
      // If it's a local upload path (starts with /api/uploads)
      if (src && src.startsWith('/api/uploads')) {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        return `${base}${src.replace('/api/uploads', '/uploads')}`;
      }
      return src;
    }

    // Check for direct image property
    if (item?.image) {
      const src = item.image;
      if (src && src.startsWith('/api/uploads')) {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        return `${base}${src.replace('/api/uploads', '/uploads')}`;
      }
      return src;
    }

    // Return fallback image
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-8 h-0.5 bg-emerald-300 mr-3"></div>
            <span className="text-sm font-medium text-emerald-600 tracking-wider">LATEST UPDATES</span>
            <div className="w-8 h-0.5 bg-emerald-300 ml-3"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Latest <span className="font-medium text-emerald-700">News & Updates</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest developments, success stories, and community impact.
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <div className="mt-4 text-gray-500">Loading news...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {news.map((item, index) => {
              // console.log(`News item ${index}:`, item);
              const imageUrl = getImageUrl(item);
              // console.log(`Resolved image URL for item ${index}:`, imageUrl);
              
              return (
                <div 
                  key={item?._id || item?.id || item?.slug || index} 
                  className="group bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={imageUrl}
                      alt={item?.title || 'News'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                      // onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FaCalendarAlt className="w-3 h-3 mr-2 text-emerald-400" />
                      <span>{formatDate(item?.publishedAt || item?.date || item?.createdAt)}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item?.title || 'Untitled Article'}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {item?.excerpt || item?.description || 'No description available.'}
                    </p>
                    
                    {/* Read More Link */}
                    {/* <Link
                      to={`/news/${item?.slug || item?._id || item?.id || ''}`}
                      className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors"
                    >
                      Read More
                      <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link> */}
                  </div>
                  
                  {/* Hover Indicator */}
                  <div className="px-6 pb-4">
                    <div className="w-full h-0.5 bg-gray-100 group-hover:bg-gradient-to-r from-emerald-300 to-teal-300 transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/news"
            className="inline-flex items-center bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300"
          >
            View All News
            <FaArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;