const News = require('../models/News');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = asyncHandler(async (req, res, next) => {
  const {
    category,
    published = 'true',
    isFeatured,
    page = 1,
    limit = 10,
    search,
    sort = '-publishedAt'
  } = req.query;

  // Build query
  let query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by published status
  if (published === 'true') {
    query.published = true;
  } else if (published === 'false') {
    query.published = false;
  }

  // Filter by featured
  if (isFeatured === 'true') {
    query.isFeatured = true;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const news = await News.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('author', 'name email avatar')
    .populate('relatedProjects', 'title slug images')
    .populate('relatedNews', 'title slug images');

  // Get total count for pagination
  const total = await News.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: news.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: news
  });
});

// @desc    Get single news item
// @route   GET /api/news/:id
// @access  Public
exports.getNewsItem = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id)
    .populate('author', 'name email avatar department')
    .populate('relatedProjects', 'title slug images category')
    .populate('relatedNews', 'title slug images category')
    .populate('likes', 'name');

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  // Increment views
  news.views += 1;
  await news.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: news
  });
});

// @desc    Get news by slug
// @route   GET /api/news/slug/:slug
// @access  Public
exports.getNewsBySlug = asyncHandler(async (req, res, next) => {
  const news = await News.findOne({ slug: req.params.slug, published: true })
    .populate('author', 'name email avatar department')
    .populate('relatedProjects', 'title slug images category')
    .populate('relatedNews', 'title slug images category')
    .populate('likes', 'name');

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  // Increment views
  news.views += 1;
  await news.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: news
  });
});

// @desc    Create new news article
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = asyncHandler(async (req, res, next) => {
  // Add author to request body
  req.body.author = req.user.id;

  const news = await News.create(req.body);

  res.status(201).json({
    success: true,
    message: 'News article created successfully',
    data: news
  });
});

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = asyncHandler(async (req, res, next) => {
  let news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  // Check if user is author or admin
  if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this article', 403));
  }

  news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'News article updated successfully',
    data: news
  });
});

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  // Check if user is author or admin
  if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this article', 403));
  }

  await news.deleteOne();

  res.status(200).json({
    success: true,
    message: 'News article deleted successfully',
    data: {}
  });
});

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
exports.getFeaturedNews = asyncHandler(async (req, res, next) => {
  const news = await News.find({ isFeatured: true, published: true })
    .sort('-publishedAt')
    .limit(6)
    .populate('author', 'name avatar')
    .select('title excerpt slug images publishedAt category views');

  res.status(200).json({
    success: true,
    count: news.length,
    data: news
  });
});

// @desc    Get latest news
// @route   GET /api/news/latest
// @access  Public
exports.getLatestNews = asyncHandler(async (req, res, next) => {
  const news = await News.find({ published: true })
    .sort('-publishedAt')
    .limit(5)
    .populate('author', 'name avatar')
    .select('title excerpt slug images publishedAt category views');

  res.status(200).json({
    success: true,
    count: news.length,
    data: news
  });
});

// @desc    Like/Unlike news article
// @route   PUT /api/news/:id/like
// @access  Private
exports.likeNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  const userId = req.user.id;
  const isLiked = news.likes.includes(userId);

  if (isLiked) {
    // Unlike
    news.likes = news.likes.filter(id => id.toString() !== userId);
  } else {
    // Like
    news.likes.push(userId);
  }

  await news.save();

  res.status(200).json({
    success: true,
    message: isLiked ? 'Article unliked' : 'Article liked',
    data: {
      likes: news.likes.length,
      isLiked: !isLiked
    }
  });
});

// @desc    Get news statistics
// @route   GET /api/news/stats
// @access  Public
exports.getNewsStats = asyncHandler(async (req, res, next) => {
  const stats = await News.aggregate([
    {
      $group: {
        _id: null,
        totalArticles: { $sum: 1 },
        publishedArticles: {
          $sum: { $cond: ['$published', 1, 0] }
        },
        featuredArticles: {
          $sum: { $cond: ['$isFeatured', 1, 0] }
        },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } }
      }
    },
    {
      $project: {
        _id: 0,
        totalArticles: 1,
        publishedArticles: 1,
        featuredArticles: 1,
        totalViews: 1,
        totalLikes: 1
      }
    }
  ]);

  // Category distribution
  const categoryStats = await News.aggregate([
    {
      $match: { published: true }
    },
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

  // Monthly publication stats
  const monthlyStats = await News.aggregate([
    {
      $match: { published: true, publishedAt: { $exists: true } }
    },
    {
      $group: {
        _id: {
          year: { $year: '$publishedAt' },
          month: { $month: '$publishedAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      categoryDistribution: categoryStats,
      monthlyStats
    }
  });
});

// @desc    Get related news
// @route   GET /api/news/:id/related
// @access  Public
exports.getRelatedNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse('News article not found', 404));
  }

  // Find news with same category or related tags
  const relatedNews = await News.find({
    _id: { $ne: req.params.id },
    published: true,
    $or: [
      { category: news.category },
      { tags: { $in: news.tags } }
    ]
  })
    .sort('-publishedAt')
    .limit(4)
    .populate('author', 'name avatar')
    .select('title excerpt slug images publishedAt category views');

  res.status(200).json({
    success: true,
    count: relatedNews.length,
    data: relatedNews
  });
});
