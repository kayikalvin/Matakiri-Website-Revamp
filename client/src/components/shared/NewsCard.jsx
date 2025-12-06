// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaCalendar, FaUser, FaEye, FaHeart } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// const NewsCard = ({ news }) => {
//   // Fallback data if news object is incomplete
//   const newsData = {
//     _id: news._id || Math.random().toString(36).substr(2, 9),
//     title: news.title || 'News Title',
//     excerpt: news.excerpt || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     image: news.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     category: news.category || 'General',
//     author: news.author || 'Admin',
//     views: news.views || Math.floor(Math.random() * 1000),
//     likes: news.likes || Math.floor(Math.random() * 500),
//     createdAt: news.createdAt || new Date().toISOString(),
//     slug: news.slug || `news-${Math.random().toString(36).substr(2, 9)}`
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Recent';
//     }
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
//     >
//       {/* Image */}
//       <div className="h-48 overflow-hidden">
//         <img
//           src={newsData.image}
//           alt={newsData.title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//         />
//         <div className="absolute top-4 left-4">
//           <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full shadow-md">
//             {newsData.category}
//           </span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {/* Date */}
//         <div className="flex items-center text-gray-500 text-sm mb-3">
//           <FaCalendar className="mr-2" />
//           <span>{formatDate(newsData.createdAt)}</span>
//         </div>

//         {/* Title */}
//         <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
//           {newsData.title}
//         </h3>

//         {/* Excerpt */}
//         <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
//           {newsData.excerpt}
//         </p>

//         {/* Stats */}
//         <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
//           <div className="flex items-center text-sm text-gray-500">
//             <FaUser className="mr-2" />
//             <span>{newsData.author}</span>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center text-sm text-gray-500">
//               <FaEye className="mr-1" />
//               <span>{newsData.views.toLocaleString()}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-500">
//               <FaHeart className="mr-1 text-red-500" />
//               <span>{newsData.likes.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* Read More Button */}
//         <Link
//           to={`/news/${newsData.slug}`}
//           className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           Read More
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export default NewsCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaEye, FaHeart } from 'react-icons/fa';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-48 overflow-hidden">
        <img
          src={news?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={news?.title || 'News'}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
            {news?.category || 'General'}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <FaCalendar className="mr-1" />
            {new Date(news?.createdAt || new Date()).toLocaleDateString()}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {news?.title || 'News Title'}
        </h3>
        <p className="text-gray-600 mb-4">
          {news?.excerpt || 'News excerpt...'}
        </p>
        <Link
          to={`/news/${news?.slug || news?._id || '1'}`}
          className="inline-block w-full text-center py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;