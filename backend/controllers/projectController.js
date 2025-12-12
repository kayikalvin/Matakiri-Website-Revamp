const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  const {
    category,
    status,
    isFeatured,
    isAIPowered,
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

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by featured
  if (isFeatured === 'true') {
    query.isFeatured = true;
  }

  // Filter by AI powered
  if (isAIPowered === 'true') {
    query.isAIPowered = true;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const projects = await Project.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('partners', 'name logo website')
    .populate('createdBy', 'name email');

  // Get total count for pagination
  const total = await Project.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('partners', 'name logo website description')
    .populate('createdBy', 'name email avatar')
    .populate('updatedBy', 'name email avatar');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add createdBy to request body
  req.body.createdBy = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Add updatedBy to request body
  req.body.updatedBy = req.user.id;

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {}
  });
});

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ isFeatured: true })
    .limit(6)
    .populate('partners', 'name logo')
    .select('title shortDescription images category status location');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get AI projects
// @route   GET /api/projects/ai
// @access  Public
exports.getAIProjects = asyncHandler(async (req, res, next) => {
  const projectsRaw = await Project.find({ isAIPowered: true })
    .populate('partners', 'name logo')
    .select('title description images aiComponents status startDate');

  // Map startDate to launchDate for frontend compatibility
  const projects = projectsRaw.map(p => {
    const obj = p.toObject();
    obj.launchDate = obj.startDate || null;
    return obj;
  });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Public
exports.getProjectStats = asyncHandler(async (req, res, next) => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        activeProjects: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        completedProjects: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        aiProjects: {
          $sum: { $cond: ['$isAIPowered', 1, 0] }
        },
        totalBeneficiaries: { $sum: '$impactMetrics.beneficiaries' },
        totalCommunities: { $sum: '$impactMetrics.communitiesReached' }
      }
    },
    {
      $project: {
        _id: 0,
        totalProjects: 1,
        activeProjects: 1,
        completedProjects: 1,
        aiProjects: 1,
        totalBeneficiaries: { $ifNull: ['$totalBeneficiaries', 0] },
        totalCommunities: { $ifNull: ['$totalCommunities', 0] }
      }
    }
  ]);

  // Category distribution
  const categoryStats = await Project.aggregate([
    {
      $group: {
        _id: '$category',
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
      categoryDistribution: categoryStats
    }
  });
});

// @desc    Upload images for a project
// @route   POST /api/projects/:id/images
// @access  Private/Admin/Editor
exports.addProjectImages = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Ensure files are present
  const files = (req.files && req.files.images) || [];

  if (!files.length) {
    return next(new ErrorResponse('No images uploaded', 400));
  }

  // Optional captions can be sent as JSON array in `captions` field
  let captions = [];
  try {
    if (req.body.captions) captions = JSON.parse(req.body.captions);
  } catch (e) {
    captions = [];
  }

  const newImages = files.map((file, i) => ({
    url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
    caption: captions[i] || '',
    isFeatured: false
  }));

  project.images = project.images ? project.images.concat(newImages) : newImages;
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: project
  });
});