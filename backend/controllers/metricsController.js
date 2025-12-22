const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get revenue totals for a date range (sums budget.spent)
// @route   GET /api/metrics/revenue
// @access  Private/Admin (or Public if you want)
exports.getRevenue = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const pipeline = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });

  // Sum budget.spent across matched projects. Use $ifNull to default missing values to 0.
  pipeline.push({
    $group: {
      _id: null,
      totalSpent: { $sum: { $ifNull: ['$budget.spent', 0] } }
    }
  });

  const result = await Project.aggregate(pipeline);
  const totalSpent = (result && result[0] && result[0].totalSpent) ? result[0].totalSpent : 0;

  res.status(200).json({ success: true, data: { totalSpent } });
});
