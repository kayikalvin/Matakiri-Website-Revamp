const Theme = require('../models/Theme');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc Get all themes
// @route GET /api/themes
// @access Public
exports.getThemes = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search, sort = '-createdAt' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const themes = await Theme.find(query).sort(sort).skip(skip).limit(limitNum);
  const total = await Theme.countDocuments(query);

  res.status(200).json({
    success: true,
    count: themes.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    data: themes
  });
});

// @desc Get active theme
// @route GET /api/themes/active
// @access Public
exports.getActiveTheme = asyncHandler(async (req, res, next) => {
  const theme = await Theme.findOne({ isActive: true });
  if (!theme) {
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: theme });
});

// @desc Get single theme
// @route GET /api/themes/:id
// @access Public
exports.getTheme = asyncHandler(async (req, res, next) => {
  const theme = await Theme.findById(req.params.id);
  if (!theme) return next(new ErrorResponse('Theme not found', 404));
  res.status(200).json({ success: true, data: theme });
});

// @desc Create theme
// @route POST /api/themes
// @access Private/Admin
exports.createTheme = asyncHandler(async (req, res, next) => {
  const theme = await Theme.create(req.body);
  res.status(201).json({ success: true, message: 'Theme created', data: theme });
});

// @desc Update theme
// @route PUT /api/themes/:id
// @access Private/Admin
exports.updateTheme = asyncHandler(async (req, res, next) => {
  let theme = await Theme.findById(req.params.id);
  if (!theme) return next(new ErrorResponse('Theme not found', 404));

  theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Theme updated', data: theme });
});

// @desc Delete theme
// @route DELETE /api/themes/:id
// @access Private/Admin
exports.deleteTheme = asyncHandler(async (req, res, next) => {
  const theme = await Theme.findById(req.params.id);
  if (!theme) return next(new ErrorResponse('Theme not found', 404));
  await theme.deleteOne();
  res.status(200).json({ success: true, message: 'Theme deleted', data: {} });
});

// @desc Activate theme (set this theme as active, disable others)
// @route PUT /api/themes/:id/activate
// @access Private/Admin
exports.activateTheme = asyncHandler(async (req, res, next) => {
  const theme = await Theme.findById(req.params.id);
  if (!theme) return next(new ErrorResponse('Theme not found', 404));

  // disable all
  await Theme.updateMany({}, { isActive: false });

  theme.isActive = true;
  await theme.save();

  res.status(200).json({ success: true, message: 'Theme activated', data: theme });
});
