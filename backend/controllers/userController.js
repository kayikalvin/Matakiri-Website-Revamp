const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const {
    role,
    department,
    isActive,
    page = 1,
    limit = 10,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = {};

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by department
  if (department) {
    query.department = department;
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select('-password');

  // Get total count for pagination
  const total = await User.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {}
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res, next) => {
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
      totalUsers: { $sum: 1 },
      activeUsers: {
        $sum: { $cond: ['$isActive', 1, 0] }
      }
    }
  });
  pipeline.push({
    $project: {
      _id: 0,
      totalUsers: 1,
      activeUsers: 1
    }
  });
  const stats = await User.aggregate(pipeline);

  // Role distribution
  const rolePipeline = [];
  if (Object.keys(match).length) rolePipeline.push({ $match: match });
  rolePipeline.push({
    $group: {
      _id: '$role',
      count: { $sum: 1 }
    }
  });
  rolePipeline.push({ $sort: { count: -1 } });
  const roleStats = await User.aggregate(rolePipeline);

  // Department distribution
  const deptPipeline = [];
  if (Object.keys(match).length) deptPipeline.push({ $match: match });
  deptPipeline.push({
    $match: { department: { $ne: null } }
  });
  deptPipeline.push({
    $group: {
      _id: '$department',
      count: { $sum: 1 }
    }
  });
  deptPipeline.push({ $sort: { count: -1 } });
  const departmentStats = await User.aggregate(deptPipeline);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      roleDistribution: roleStats,
      departmentDistribution: departmentStats
    }
  });
});
