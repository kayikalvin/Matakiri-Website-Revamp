const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  const {
    status,
    page = 1,
    limit = 10,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const contacts = await Contact.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Contact.countDocuments(query);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext,
      hasPrev
    },
    data: contacts
  });
});

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse('Contact message not found', 404));
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Create contact (public)
// @route   POST /api/contact
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message, phone } = req.body;

  // Create contact message
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    phone,
    status: 'new'
  });

  // Send email notification to admin
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@matakiri.org';
    
    const emailMessage = `
      New Contact Form Submission:
      
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}\n` : ''}
      Subject: ${subject}
      
      Message:
      ${message}
      
      ---
      This message was sent from the Matakiri Tumaini Centre website contact form.
    `;

    await sendEmail({
      email: adminEmail,
      subject: `New Contact: ${subject}`,
      message: emailMessage
    });

    // Send auto-reply to user
    const userReplyMessage = `
      Dear ${name},
      
      Thank you for contacting Matakiri Tumaini Centre. We have received your message and will get back to you as soon as possible.
      
      Here's a copy of your message:
      Subject: ${subject}
      Message: ${message}
      
      Best regards,
      Matakiri Tumaini Centre Team
    `;

    await sendEmail({
      email: email,
      subject: 'Thank you for contacting Matakiri Tumaini Centre',
      message: userReplyMessage
    });

  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for your message. We will get back to you soon.',
    data: contact
  });
});

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse('Contact message not found', 404));
  }

  // If marking as replied, set repliedAt timestamp
  if (req.body.status === 'replied' && contact.status !== 'replied') {
    req.body.repliedAt = new Date();
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Contact updated successfully',
    data: contact
  });
});

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse('Contact message not found', 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully',
    data: {}
  });
});

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse('Contact message not found', 404));
  }

  contact.status = 'read';
  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact marked as read',
    data: contact
  });
});

// @desc    Mark contact as replied
// @route   PUT /api/contact/:id/replied
// @access  Private/Admin
exports.markAsReplied = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse('Contact message not found', 404));
  }

  contact.status = 'replied';
  contact.repliedAt = new Date();
  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact marked as replied',
    data: contact
  });
});

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
exports.getContactStats = asyncHandler(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: null,
        totalContacts: { $sum: 1 },
        newContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
        },
        readContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] }
        },
        repliedContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] }
        },
        archivedContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalContacts: 1,
        newContacts: 1,
        readContacts: 1,
        repliedContacts: 1,
        archivedContacts: 1
      }
    }
  ]);

  // Daily contact trend (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyStats = await Contact.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
    },
    {
      $limit: 30
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      dailyStats
    }
  });
});

// @desc    Get recent contacts
// @route   GET /api/contact/recent
// @access  Private/Admin
exports.getRecentContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find()
    .sort('-createdAt')
    .limit(10)
    .select('name email subject status createdAt');

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc    Bulk update contacts
// @route   PUT /api/contact/bulk/update
// @access  Private/Admin
exports.bulkUpdateContacts = asyncHandler(async (req, res, next) => {
  const { contactIds, status } = req.body;

  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    return next(new ErrorResponse('Please provide contact IDs', 400));
  }

  if (!status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  const updateData = { status };
  
  // If marking as replied, add repliedAt
  if (status === 'replied') {
    updateData.repliedAt = new Date();
  }

  const result = await Contact.updateMany(
    { _id: { $in: contactIds } },
    updateData
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} contacts updated successfully`,
    data: result
  });
});

// @desc    Bulk delete contacts
// @route   DELETE /api/contact/bulk/delete
// @access  Private/Admin
exports.bulkDeleteContacts = asyncHandler(async (req, res, next) => {
  const { contactIds } = req.body;

  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    return next(new ErrorResponse('Please provide contact IDs', 400));
  }

  const result = await Contact.deleteMany({ _id: { $in: contactIds } });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} contacts deleted successfully`,
    data: {}
  });
});