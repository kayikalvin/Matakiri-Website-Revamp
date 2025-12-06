import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaImage, FaVideo, FaFilter, FaTimes, FaPlay, FaDownload } from 'react-icons/fa';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Media', count: 45 },
    { id: 'projects', name: 'Projects', count: 18 },
    { id: 'community', name: 'Community', count: 12 },
    { id: 'events', name: 'Events', count: 8 },
    { id: 'ai', name: 'AI Initiatives', count: 5 },
    { id: 'team', name: 'Team Activities', count: 7 }
  ];

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      category: 'projects',
      title: 'Agricultural Training Session',
      description: 'Farmers learning modern farming techniques',
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-10-15'
    },
    {
      id: 2,
      type: 'video',
      category: 'ai',
      title: 'AI Farming App Demo',
      description: 'Demonstration of our AI-powered agricultural advisor',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-11-20'
    },
    {
      id: 3,
      type: 'image',
      category: 'community',
      title: 'Clean Water Project',
      description: 'Community members at new water point',
      url: 'https://images.unsplash.com/photo-1564053489984-317bbd824340?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-09-05'
    },
    {
      id: 4,
      type: 'image',
      category: 'events',
      title: 'Annual Health Camp',
      description: 'Free medical checkup for community members',
      url: 'https://images.unsplash.com/photo-1516549655669-df6654e435de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-08-12'
    },
    {
      id: 5,
      type: 'image',
      category: 'team',
      title: 'Volunteer Training',
      description: 'Training session for new volunteers',
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-10-30'
    },
    {
      id: 6,
      type: 'video',
      category: 'ai',
      title: 'Mobile Health App',
      description: 'Overview of our mobile health records system',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-11-25'
    },
    {
      id: 7,
      type: 'image',
      category: 'projects',
      title: 'School Renovation',
      description: 'Newly renovated classroom building',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-07-18'
    },
    {
      id: 8,
      type: 'image',
      category: 'community',
      title: 'Women Empowerment',
      description: 'Women entrepreneurship training',
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '2023-09-22'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

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
                {categories.map((category) => (
                  <button
                    key={category.id}
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
            {filteredItems.length === 0 ? (
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
                      key={item.id}
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
                          src={item.type === 'video' ? item.thumbnail : item.url}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {categories.find(c => c.id === item.category)?.name}
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
                <div className="text-4xl font-bold text-primary-600 mb-2">45+</div>
                <div className="text-gray-600">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">12+</div>
                <div className="text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">6</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">2023</div>
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
            <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Submit Media
            </button>
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
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
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
                          {categories.find(c => c.id === selectedImage.category)?.name}
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
                        Date: {new Date(selectedImage.date).toLocaleDateString()}
                      </span>
                      <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                        <FaDownload className="mr-2" />
                        Download
                      </button>
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