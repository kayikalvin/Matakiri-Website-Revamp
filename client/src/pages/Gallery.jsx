import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../services/api';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Media', count: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([galleryAPI.getAll(), galleryAPI.getAlbums()])
      .then(([galleryRes, albumsRes]) => {
        const items =
          galleryRes.data?.data || galleryRes.data?.gallery || galleryRes.data || [];
        setGalleryItems(items);

        let cats = [{ id: 'all', name: 'All Media', count: items.length }];
        const albums = albumsRes.data?.data || albumsRes.data || [];
        if (Array.isArray(albums)) {
          cats = cats.concat(
            albums.map((album) => ({
              id: album._id || album.id || album.name,
              name: album.name || album,
              count:
                album.count ||
                items.filter(
                  (i) =>
                    i.category === (album._id || album.id || album.name || album)
                ).length,
            }))
          );
        }
        setCategories(cats);
      })
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => {
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

  const resolveImageUrl = (src) => {
    if (!src) return '/images/placeholder.png';
    if (src.startsWith('http')) return src;
    const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    if (src.startsWith('/api/uploads')) return `${base}${src.replace('/api/uploads', '/uploads')}`;
    if (src.startsWith('/uploads')) return `${base}${src}`;
    return src;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryName = (item) => {
    const cat = categories.find(
      (c) =>
        c.id === item.category ||
        c.name === item.category ||
        c.id === item.category?._id ||
        c.id === item.category?.id ||
        c.name === item.category?.name
    );
    return cat?.name || item.category?.name || item.category || 'Uncategorized';
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Browse our collection of photos and videos showcasing our projects, community activities, and impact stories."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-soil-900 text-parchment-50 py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
              Visual Stories
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-medium mt-3 mb-6">
              Our Gallery
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm">
              Visual stories of impact, innovation, and community transformation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-10 bg-parchment-50 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-4">
            <FunnelIcon className="h-5 w-5 text-ink-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
              Filter by:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-mono border transition-colors ${
                  selectedCategory === cat.id
                    ? 'border-laterite-500 text-laterite-600 bg-laterite-50'
                    : 'border-border text-ink-500 hover:border-laterite-400'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-20 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">
              Loading gallery…
            </div>
          ) : error ? (
            <div className="text-center py-16 text-status-danger font-mono text-sm">
              {error}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <PhotoIcon className="h-12 w-12 text-ink-300 mx-auto mb-4" />
              <p className="text-ink-500 font-mono text-sm">No media found in this category.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item._id || item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-border hover:border-laterite-500/40 transition-colors cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(item)}
                  >
                    <div className="relative aspect-video bg-soil-900/5 group overflow-hidden">
                      <img
                        src={resolveImageUrl(
                          item.type === 'video'
                            ? item.thumbnail || item.url
                            : item.url || item.fileUrl
                        )}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                      />
                      <div className="absolute inset-0 bg-soil-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {item.type === 'video' ? (
                          <PlayIcon className="h-10 w-10 text-white" />
                        ) : (
                          <PhotoIcon className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 border ${
                            item.type === 'video'
                              ? 'bg-maize-50 text-maize-600 border-maize-400/40'
                              : 'bg-acacia-50 text-acacia-600 border-acacia-500/30'
                          }`}
                        >
                          {item.type === 'video' ? 'Video' : 'Photo'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-sans font-semibold text-ink-800 text-sm truncate">
                        {item.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-ink-500 line-clamp-2">
                        {item.description || ''}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border text-xs font-mono text-ink-500">
                        <span>{formatDate(item.createdAt || item.date)}</span>
                        <span>{getCategoryName(item)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-soil-900/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-10 right-0 text-parchment-50 hover:text-laterite-400 transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>

              {/* Content */}
              <div className="bg-white border border-border overflow-auto">
                {selectedImage.type === 'video' ? (
                  <div className="aspect-video bg-black">
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
                    src={resolveImageUrl(selectedImage.url || selectedImage.fileUrl)}
                    alt={selectedImage.title}
                    className="w-full max-h-[70vh] object-contain bg-soil-900"
                    onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                  />
                )}

                {/* Info */}
                <div className="p-6 space-y-4">
                  <h3 className="font-display text-xl font-medium text-ink-800">
                    {selectedImage.title || 'Untitled'}
                  </h3>
                  <p className="text-ink-500 text-sm">{selectedImage.description || ''}</p>
                  <div className="flex items-center gap-3 text-xs font-mono text-ink-500">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border ${
                        selectedImage.type === 'video'
                          ? 'bg-maize-50 text-maize-600 border-maize-400/40'
                          : 'bg-acacia-50 text-acacia-600 border-acacia-500/30'
                      }`}
                    >
                      {selectedImage.type === 'video' ? 'Video' : 'Photo'}
                    </span>
                    <span>{getCategoryName(selectedImage)}</span>
                    <span className="ml-auto">{formatDate(selectedImage.createdAt || selectedImage.date)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;