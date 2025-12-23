import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaImage, FaVideo, FaFilter, FaTimes, FaPlay, FaDownload } from 'react-icons/fa';
import { galleryAPI } from '../services/api';

const Gallery = () => {

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Media', count: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ photos: 0, videos: 0, categories: 0, latest: null });

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      galleryAPI.getAll(),
      galleryAPI.getAlbums(),
      galleryAPI.getStats()
    ])
      .then(([galleryRes, albumsRes, statsRes]) => {
        // Support both {data: []} and []
        const items = galleryRes.data?.data || galleryRes.data?.gallery || galleryRes.data || [];
        setGalleryItems(items);
        // Build categories from albums or items
        let cats = [{ id: 'all', name: 'All Media', count: items.length }];
        const albums = albumsRes.data?.data || albumsRes.data || [];
        if (Array.isArray(albums)) {
          cats = cats.concat(albums.map(album => ({
            id: album._id || album.id || album.name,
            name: album.name || album,
            count: album.count || (items.filter(i => i.category === (album._id || album.id || album.name || album)).length)
          })));
        }
        setCategories(cats);
        // Stats
        let photos = 0, videos = 0, latest = null;
        if (statsRes?.data) {
          // If backend provides stats
          photos = statsRes.data.photos || statsRes.data.images || 0;
          videos = statsRes.data.videos || 0;
          latest = statsRes.data.latest || null;
        } else {
          // Fallback: calculate from items
          photos = items.filter(i => i.type === 'image' || i.type === 'photo').length;
          videos = items.filter(i => i.type === 'video').length;
          latest = items.length > 0 ? items.reduce((a, b) => (new Date(a.createdAt || a.date) > new Date(b.createdAt || b.date) ? a : b)).createdAt || null : null;
        }
        setStats({
          photos,
          videos,
          categories: cats.length - 1, // exclude 'all'
          latest
        });
      })
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => {
        // Support both string and object for category
        return (
          item.category === selectedCategory ||
          item.category?._id === selectedCategory ||
          item.category?.id === selectedCategory ||
          item.category?.name === selectedCategory
        );
      });

  const openLightbox = (item) => {
    setSelectedImage(item);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Matakiri Tumaini Centre</title>
        <meta name="description" content="Browse our collection of photos and videos showcasing our projects, community activities, and impact stories." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <FaImage className="text-3xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                Our Gallery
              </h1>
              <p className="text-xl text-gray-200">
                Visual stories of impact, innovation, and community transformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category, idx) => (
                  <button
                    key={category.id || category.name || idx}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-10 text-lg text-gray-500">Loading gallery...</div>
            ) : error ? (
              <div className="text-center py-10 text-lg text-red-500">{error}</div>
            ) : filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No media found in this category
                </h3>
                <p className="text-gray-500">
                  Try selecting a different category or check back later.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item._id || item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => openLightbox(item)}
                    >
                      <div className="relative overflow-hidden group">
                        {/* Thumbnail */}
                        <img
                          src={(() => {
                              const isImage = item.type === 'image' || item.type === 'photo';
                              const src = item.type === 'video'
                                ? (item.thumbnail || item.url || item.fileUrl)
                                : (item.url || item.fileUrl);
                              if (src && src.startsWith('/api/uploads')) {
                                // Use /uploads for static file serving, not /api/uploads
                                const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                                return `${base}${src.replace('/api/uploads', '/uploads')}`;
                              }
                              return src || '/images/placeholder.png';
                            })()}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={e => { e.target.src = '/images/placeholder.png'; }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {item.type === 'video' ? (
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <FaPlay className="text-white text-2xl" />
                            </div>
                          ) : (
                            <FaImage className="text-white text-3xl" />
                          )}
                        </div>
                        
                        {/* Type Indicator */}
                        <div className="absolute top-3 right-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'video' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {item.type === 'video' ? 'Video' : 'Photo'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {(() => {
                              const d = item.createdAt || item.date;
                              const dateObj = d ? new Date(d) : null;
                              return (dateObj && !isNaN(dateObj))
                                ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                : 'Unknown date';
                            })()}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {(() => {
                              const cat = categories.find(c =>
                                c.id === item.category ||
                                c.name === item.category ||
                                c.id === item.category?._id ||
                                c.id === item.category?.id ||
                                c.name === item.category?.name
                              );
                              return cat?.name || item.category?.name || item.category || 'Uncategorized';
                            })()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stats.photos}</div>
                <div className="text-gray-600">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stats.videos}</div>
                <div className="text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stats.categories}</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stats.latest ? new Date(stats.latest).getFullYear() : '—'}
                </div>
                <div className="text-gray-600">Latest Updates</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Share Your Photos With Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Are you a community member with photos or videos of our projects in action? 
              We'd love to feature your content in our gallery!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Submit Media
            </Link>
          </div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>

                {/* Content */}
                <div className="bg-white rounded-xl overflow-hidden">
                      {selectedImage.type === 'video' ? (
                    <div className="aspect-video">
                      <iframe
                        src={selectedImage.url}
                        title={selectedImage.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <img
                      src={(() => {
                        const src = selectedImage.url || selectedImage.fileUrl;
                        if (src && src.startsWith('/api/uploads')) {
                          const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                          return `${base}${src.replace('/api/uploads', '/uploads')}`;
                        }
                        return src || '/images/placeholder.png';
                      })()}
                      alt={selectedImage.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                      onError={e => { e.target.src = '/images/placeholder.png'; }}
                    />
                  )}

                  {/* Info Section */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {selectedImage.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {selectedImage.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {(() => {
                            const cat = categories.find(c =>
                              c.id === selectedImage.category ||
                              c.name === selectedImage.category ||
                              c.id === selectedImage.category?._id ||
                              c.id === selectedImage.category?.id ||
                              c.name === selectedImage.category?.name
                            );
                            return cat?.name || selectedImage.category?.name || selectedImage.category || 'Uncategorized';
                          })()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          selectedImage.type === 'video' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {selectedImage.type === 'video' ? 'Video' : 'Photo'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-gray-500 text-sm">
                        Date: {(() => {
                          const d = selectedImage.createdAt || selectedImage.date;
                          const dateObj = d ? new Date(d) : null;
                          return (dateObj && !isNaN(dateObj))
                            ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'Unknown date';
                        })()}
                      </span>
                      {/* <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                        <FaDownload className="mr-2" />
                        Download
                      </button> */}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Gallery;