const Program = require('../models/Program');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = asyncHandler(async (req, res, next) => {
  const { category, status, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  let query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const programs = await Program.find(query).sort(sort).skip(skip).limit(limitNum);
  const total = await Program.countDocuments(query);
  res.status(200).json({ success: true, count: programs.length, total, data: programs });
});

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    return next(new ErrorResponse('Program not found', 404));
  }
  res.status(200).json({ success: true, data: program });
});

// @desc    Create program
// @route   POST /api/programs
// @access  Private (admin/editor)
exports.createProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.create(req.body);
  res.status(201).json({ success: true, data: program });
});

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private (admin/editor)
exports.updateProgram = asyncHandler(async (req, res, next) => {
  let program = await Program.findById(req.params.id);
  if (!program) {
    return next(new ErrorResponse('Program not found', 404));
  }
  program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: program });
});

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private (admin)
exports.deleteProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    return next(new ErrorResponse('Program not found', 404));
  }
  await program.remove();
  res.status(200).json({ success: true, data: {} });
});
