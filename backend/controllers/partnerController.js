const Partner = require('../models/Partner');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const fs = require('fs');
const path = require('path');

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
  // If form-data was sent with a JSON payload field, merge it
  if (req.body && req.body.payload) {
    try {
      const parsed = JSON.parse(req.body.payload);
      req.body = { ...req.body, ...parsed };
    } catch (e) {}
  }

  // If logo file uploaded, set logo URL before validation/create
  if (req.files && req.files.logo && req.files.logo[0]) {
    const file = req.files.logo[0];
    req.body.logo = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  }

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

  // If form-data was sent with a JSON payload field, merge it
  if (req.body && req.body.payload) {
    try {
      const parsed = JSON.parse(req.body.payload);
      req.body = { ...req.body, ...parsed };
    } catch (e) {}
  }

  // If logo file uploaded, set logo URL in body and remove previous logo file if present
  if (req.files && req.files.logo && req.files.logo[0]) {
    const file = req.files.logo[0];
    req.body.logo = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    // remove previous logo file from uploads if exists and is local
    try {
      if (partner.logo && partner.logo.includes('/uploads/')) {
        const prevFilename = partner.logo.split('/uploads/').pop();
        const prevPath = path.join(process.cwd(), 'uploads', prevFilename);
        if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
      }
    } catch (e) {
      // non-fatal
    }
  } else if (typeof req.body.logo !== 'undefined' && req.body.logo === '') {
    // client requested removal of existing logo
    try {
      if (partner.logo && partner.logo.includes('/uploads/')) {
        const prevFilename = partner.logo.split('/uploads/').pop();
        const prevPath = path.join(process.cwd(), 'uploads', prevFilename);
        if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
      }
    } catch (e) {
      // ignore errors
    }
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
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const pipeline = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });

  pipeline.push({
    $group: {
      _id: null,
      totalPartners: { $sum: 1 },
      featuredPartners: {
        $sum: { $cond: ['$isFeatured', 1, 0] }
      }
    }
  });

  pipeline.push({
    $project: {
      _id: 0,
      totalPartners: 1,
      featuredPartners: 1
    }
  });

  const stats = await Partner.aggregate(pipeline);

  // Partnership level distribution
  const levelPipeline = [];
  if (Object.keys(match).length) levelPipeline.push({ $match: match });
  levelPipeline.push({
    $group: {
      _id: '$partnershipLevel',
      count: { $sum: 1 }
    }
  });
  levelPipeline.push({ $sort: { count: -1 } });
  const levelStats = await Partner.aggregate(levelPipeline);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      partnershipLevelDistribution: levelStats
    }
  });
});
