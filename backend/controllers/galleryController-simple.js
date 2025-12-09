const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');

// Simple controller for testing
exports.getGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.find().limit(10);
  res.json({ success: true, count: gallery.length, data: gallery });
});

exports.getGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }
  res.json({ success: true, data: item });
});

// Simple upload for testing (without Cloudinary)
exports.uploadMedia = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Upload endpoint (test mode)',
    data: req.body
  });
});

// Other methods...
exports.updateGalleryItem = exports.uploadMedia;
exports.deleteGalleryItem = exports.uploadMedia;
exports.getGalleryAlbums = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});
exports.getFeaturedGallery = asyncHandler(async (req, res) => {
  res.json({ success: true, count: 0, data: [] });
});
exports.getGalleryStats = asyncHandler(async (req, res) => {
  res.json({ 
    success: true, 
    data: {
      totalItems: 0,
      images: 0,
      videos: 0,
      featuredItems: 0,
      totalSize: 0
    }
  });
});