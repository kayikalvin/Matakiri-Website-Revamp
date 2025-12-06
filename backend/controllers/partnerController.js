const Partner = require('../models/Partner');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
exports.getPartners = asyncHandler(async (req, res, next) => {
  const {
    category,
    partnershipLevel,
    page = 1,
    limit = 10,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by partnership level
  if (partnershipLevel) {
    query.partnershipLevel = partnershipLevel;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const partners = await Partner.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Partner.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: partners.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: partners
  });
});

// @desc    Get single partner
// @route   GET /api/partners/:id
// @access  Public
exports.getPartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorResponse('Partner not found', 404));
  }

  res.status(200).json({
    success: true,
    data: partner
  });
});

// @desc    Create new partner
// @route   POST /api/partners
// @access  Private/Admin
exports.createPartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Partner created successfully',
    data: partner
  });
});

// @desc    Update partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
exports.updatePartner = asyncHandler(async (req, res, next) => {
  let partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorResponse('Partner not found', 404));
  }

  partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Partner updated successfully',
    data: partner
  });
});

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
exports.deletePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorResponse('Partner not found', 404));
  }

  await partner.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Partner deleted successfully',
    data: {}
  });
});

// @desc    Get featured partners
// @route   GET /api/partners/featured
// @access  Public
exports.getFeaturedPartners = asyncHandler(async (req, res, next) => {
  const partners = await Partner.find({ isFeatured: true })
    .sort('-createdAt')
    .limit(12);

  res.status(200).json({
    success: true,
    count: partners.length,
    data: partners
  });
});

// @desc    Get partner statistics
// @route   GET /api/partners/stats
// @access  Public
exports.getPartnerStats = asyncHandler(async (req, res, next) => {
  const stats = await Partner.aggregate([
    {
      $group: {
        _id: null,
        totalPartners: { $sum: 1 },
        featuredPartners: {
          $sum: { $cond: ['$isFeatured', 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalPartners: 1,
        featuredPartners: 1
      }
    }
  ]);

  // Partnership level distribution
  const levelStats = await Partner.aggregate([
    {
      $group: {
        _id: '$partnershipLevel',
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
      partnershipLevelDistribution: levelStats
    }
  });
});
