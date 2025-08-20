import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all published projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      featured, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const projects = await Project.find(query)
      .populate('author', 'username profile.firstName profile.lastName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching projects'
    });
  }
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (!project.isPublished) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Increment view count
    project.stats.views += 1;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching project'
    });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, [
  body('title')
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('content')
    .notEmpty()
    .withMessage('Project content is required'),
  body('category')
    .isIn(['Security Tool', 'Web Security', 'Red Team Tool', 'API Security', 'Education', 'Network Security', 'Other'])
    .withMessage('Invalid project category'),
  body('techStack')
    .isArray()
    .withMessage('Tech stack must be an array'),
  body('status')
    .isIn(['Complete', 'Active', 'In Development', 'Planning'])
    .withMessage('Invalid project status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const projectData = {
      ...req.body,
      author: req.user._id
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating project'
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .optional()
    .isIn(['Security Tool', 'Web Security', 'Red Team Tool', 'API Security', 'Education', 'Network Security', 'Other'])
    .withMessage('Invalid project category'),
  body('status')
    .optional()
    .isIn(['Complete', 'Active', 'In Development', 'Planning'])
    .withMessage('Invalid project status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check ownership or admin role
    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username profile.firstName profile.lastName');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating project'
    });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check ownership or admin role
    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting project'
    });
  }
});

// @desc    Toggle project like
// @route   POST /api/projects/:id/like
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // For now, just increment like count
    // In a real app, you'd track who liked what
    project.stats.likes += 1;
    await project.save();

    res.json({
      success: true,
      data: { likes: project.stats.likes }
    });
  } catch (error) {
    console.error('❌ Like project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while liking project'
    });
  }
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          publishedProjects: { $sum: { $cond: ['$isPublished', 1, 0] } },
          totalViews: { $sum: '$stats.views' },
          totalLikes: { $sum: '$stats.likes' },
          totalDownloads: { $sum: '$stats.downloads' }
        }
      }
    ]);

    const categoryStats = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        categories: categoryStats,
        statuses: statusStats
      }
    });
  } catch (error) {
    console.error('❌ Get project stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching project statistics'
    });
  }
});

export default router;
