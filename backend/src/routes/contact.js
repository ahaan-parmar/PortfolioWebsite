import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  body('isEncrypted').optional().isBoolean(),
  body('encryptedPayload').optional().isString().isLength({ max: 20000 }).withMessage('Encrypted payload too large'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('category')
    .optional()
    .isIn(['General Inquiry', 'Job Opportunity', 'Collaboration', 'Security Consultation', 'Bug Report', 'Other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Invalid priority level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Ensure either plaintext message or encrypted payload is present
    const { isEncrypted, encryptedPayload, message } = req.body || {};
    if (isEncrypted) {
      if (!encryptedPayload) {
        return res.status(400).json({ success: false, error: 'Encrypted payload is required when isEncrypted=true' });
      }
    } else {
      if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
      }
    }

    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer')
    };

    const contact = await Contact.create(contactData);

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
      if (supabaseUrl && supabaseServiceRole) {
        await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceRole,
            'Authorization': `Bearer ${supabaseServiceRole}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            is_encrypted: !!contact.isEncrypted,
            created_at: new Date().toISOString(),
            client_ip: contact.ipAddress || null
          })
        });
      }
    } catch (e) {
      console.warn('⚠️ Supabase logging failed (non-fatal):', e?.message || e);
    }

    // TODO: Send email notification to admin
    // await sendContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Submit contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while submitting contact form'
    });
  }
});

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching contacts'
    });
  }
});

// @desc    Get single contact submission (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    // Mark as read if not already read
    if (!contact.isRead) {
      contact.isRead = true;
      contact.readAt = new Date();
      contact.readBy = req.user._id;
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Get contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching contact'
    });
  }
});

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['New', 'In Progress', 'Responded', 'Closed', 'Spam'])
    .withMessage('Invalid status'),
  body('response.message')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Response message cannot exceed 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status, response } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    const updateData = { status };

    // If responding, add response data
    if (status === 'Responded' && response && response.message) {
      updateData.response = {
        message: response.message,
        respondedBy: req.user._id,
        respondedAt: new Date()
      };
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: updatedContact
    });
  } catch (error) {
    console.error('❌ Update contact status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating contact status'
    });
  }
});

// @desc    Delete contact submission (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting contact'
    });
  }
});

// @desc    Get contact statistics (Admin only)
// @route   GET /api/contact/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          unreadContacts: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          respondedContacts: { $sum: { $cond: [{ $eq: ['$status', 'Responded'] }, 1, 0] } }
        }
      }
    ]);

    const statusStats = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = await Contact.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Contact.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const dailyStats = await Contact.aggregate([
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
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        statuses: statusStats,
        categories: categoryStats,
        priorities: priorityStats,
        daily: dailyStats
      }
    });
  } catch (error) {
    console.error('❌ Get contact stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching contact statistics'
    });
  }
});

export default router;
