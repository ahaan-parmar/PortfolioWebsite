import express from 'express';
import { body, validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      featured, 
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const blogPosts = await BlogPost.find(query)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: blogPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching blog posts'
    });
  }
});

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    blogPost.stats.views += 1;
    await blogPost.save();

    res.json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('❌ Get blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching blog post'
    });
  }
});

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
router.post('/', protect, [
  body('title')
    .notEmpty()
    .withMessage('Blog post title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('excerpt')
    .notEmpty()
    .withMessage('Blog post excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('content')
    .notEmpty()
    .withMessage('Blog post content is required'),
  body('category')
    .isIn(['Technical Analysis', 'Tutorial', 'CTF Writeup', 'Methodology', 'Security Research', 'Red Team Tactics', 'Other'])
    .withMessage('Invalid blog post category'),
  body('tags')
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const blogPostData = {
      ...req.body,
      author: req.user._id,
      status: req.body.status || 'draft'
    };

    // If publishing, set publishedAt
    if (blogPostData.status === 'published') {
      blogPostData.publishedAt = new Date();
    }

    const blogPost = await BlogPost.create(blogPostData);

    res.status(201).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('❌ Create blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating blog post'
    });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['Technical Analysis', 'Tutorial', 'CTF Writeup', 'Methodology', 'Security Research', 'Red Team Tactics', 'Other'])
    .withMessage('Invalid blog post category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Check ownership or admin role
    if (blogPost.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this blog post'
      });
    }

    // If status is changing to published, set publishedAt
    if (req.body.status === 'published' && blogPost.status !== 'published') {
      req.body.publishedAt = new Date();
    }

    blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username profile.firstName profile.lastName');

    res.json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('❌ Update blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating blog post'
    });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Check ownership or admin role
    if (blogPost.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this blog post'
      });
    }

    await blogPost.deleteOne();

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting blog post'
    });
  }
});

// @desc    Toggle blog post like
// @route   POST /api/blog/:id/like
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // For now, just increment like count
    // In a real app, you'd track who liked what
    blogPost.stats.likes += 1;
    await blogPost.save();

    res.json({
      success: true,
      data: { likes: blogPost.stats.likes }
    });
  } catch (error) {
    console.error('❌ Like blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while liking blog post'
    });
  }
});

// @desc    Get blog post categories
// @route   GET /api/blog/categories/list
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { status: 'published' });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching categories'
    });
  }
});

// @desc    Get blog post statistics
// @route   GET /api/blog/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await BlogPost.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          publishedPosts: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
          draftPosts: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          totalViews: { $sum: '$stats.views' },
          totalLikes: { $sum: '$stats.likes' },
          totalShares: { $sum: '$stats.shares' }
        }
      }
    ]);

    const categoryStats = await BlogPost.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: { 
            year: { $year: '$publishedAt' }, 
            month: { $month: '$publishedAt' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        categories: categoryStats,
        monthly: monthlyStats
      }
    });
  } catch (error) {
    console.error('❌ Get blog stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching blog statistics'
    });
  }
});

export default router;
