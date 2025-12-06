const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const cloudinary = require('../config/cloudinary');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getGallery = asyncHandler(async (req, res, next) => {
  const {
    type,
    album,
    isFeatured,
    page = 1,
    limit = 12,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = {};

  // Filter by type
  if (type) {
    query.type = type;
  }

  // Filter by album
  if (album) {
    query.album = album;
  }

  // Filter by featured
  if (isFeatured === 'true') {
    query.isFeatured = true;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const gallery = await Gallery.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('uploadedBy', 'name email')
    .populate('project', 'title slug');

  // Get total count for pagination
  const total = await Gallery.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: gallery.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: gallery
  });
});

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id)
    .populate('uploadedBy', 'name email avatar')
    .populate('project', 'title slug images');

  if (!item) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Upload media to gallery
// @route   POST /api/gallery
// @access  Private/Admin
exports.uploadMedia = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.media) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.media;

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
  if (!allowedTypes.includes(file.mimetype)) {
    return next(new ErrorResponse('Invalid file type', 400));
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return next(new ErrorResponse('File size too large', 400));
  }

  // Determine media type
  const type = file.mimetype.startsWith('image/') ? 'image' : 'video';

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'matakiri-gallery',
    resource_type: type === 'video' ? 'video' : 'image',
    quality: 'auto',
    format: type === 'image' ? 'webp' : undefined
  });

  // Create gallery item
  const galleryItem = await Gallery.create({
    title: req.body.title,
    description: req.body.description,
    type,
    url: result.secure_url,
    thumbnail: type === 'video' ? result.secure_url.replace('.mp4', '.jpg') : undefined,
    album: req.body.album || 'General',
    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
    isFeatured: req.body.isFeatured === 'true',
    uploadedBy: req.user.id,
    metadata: {
      width: result.width,
      height: result.height,
      size: result.bytes,
      format: result.format,
      duration: result.duration || null
    },
    project: req.body.project,
    location: req.body.location,
    captureDate: req.body.captureDate
  });

  res.status(201).json({
    success: true,
    message: 'Media uploaded successfully',
    data: galleryItem
  });
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateGalleryItem = asyncHandler(async (req, res, next) => {
  let item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  // Check if user uploaded the item or is admin
  if (item.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this item', 403));
  }

  item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: item
  });
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  // Check if user uploaded the item or is admin
  if (item.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this item', 403));
  }

  // Delete from Cloudinary
  const publicId = item.url.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`matakiri-gallery/${publicId}`, {
    resource_type: item.type === 'video' ? 'video' : 'image'
  });

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
    data: {}
  });
});

// @desc    Get gallery albums
// @route   GET /api/gallery/albums
// @access  Public
exports.getGalleryAlbums = asyncHandler(async (req, res, next) => {
  const albums = await Gallery.distinct('album');

  res.status(200).json({
    success: true,
    data: albums
  });
});

// @desc    Get featured gallery items
// @route   GET /api/gallery/featured
// @access  Public
exports.getFeaturedGallery = asyncHandler(async (req, res, next) => {
  const items = await Gallery.find({ isFeatured: true })
    .sort('-createdAt')
    .limit(12)
    .populate('uploadedBy', 'name');

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Public
exports.getGalleryStats = asyncHandler(async (req, res, next) => {
  const stats = await Gallery.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        images: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        },
        videos: {
          $sum: { $cond: [{ $eq: ['$type', 'video'] }, 1, 0] }
        },
        featuredItems: {
          $sum: { $cond: ['$isFeatured', 1, 0] }
        },
        totalSize: { $sum: '$metadata.size' }
      }
    },
    {
      $project: {
        _id: 0,
        totalItems: 1,
        images: 1,
        videos: 1,
        featuredItems: 1,
        totalSize: { $ifNull: ['$totalSize', 0] }
      }
    }
  ]);

  // Album distribution
  const albumStats = await Gallery.aggregate([
    {
      $group: {
        _id: '$album',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      albumDistribution: albumStats
    }
  });
});
