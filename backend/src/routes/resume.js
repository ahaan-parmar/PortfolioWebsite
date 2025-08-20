import express from 'express';
import { body, validationResult } from 'express-validator';
import Resume from '../models/Resume.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get public resume
// @route   GET /api/resume/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      isPublic: true, 
      isActive: true 
    }).populate('user', 'username profile.firstName profile.lastName profile.avatar');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'No public resume found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('❌ Get public resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching resume'
    });
  }
});

// @desc    Get user's resume
// @route   GET /api/resume
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      user: req.user._id,
      isActive: true 
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('❌ Get resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching resume'
    });
  }
});

// @desc    Create or update resume
// @route   POST /api/resume
// @access  Private
router.post('/', protect, [
  body('title')
    .notEmpty()
    .withMessage('Resume title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('personalInfo.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('personalInfo.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('personalInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('summary')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Summary cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if resume already exists
    let resume = await Resume.findOne({ 
      user: req.user._id,
      isActive: true 
    });

    if (resume) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        { ...req.body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );
    } else {
      // Create new resume
      const resumeData = {
        ...req.body,
        user: req.user._id,
        version: '1.0'
      };
      resume = await Resume.create(resumeData);
    }

    res.json({
      success: true,
      message: resume.isNew ? 'Resume created successfully' : 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('❌ Create/update resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while saving resume'
    });
  }
});

// @desc    Update resume sections
// @route   PUT /api/resume/sections/:section
// @access  Private
router.put('/sections/:section', protect, async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['experience', 'education', 'skills', 'certifications', 'projects', 'achievements', 'languages'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid section name'
      });
    }

    const resume = await Resume.findOne({ 
      user: req.user._id,
      isActive: true 
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Update the specific section
    resume[section] = req.body[section];
    resume.lastUpdated = new Date();
    await resume.save();

    res.json({
      success: true,
      message: `${section} section updated successfully`,
      data: resume[section]
    });
  } catch (error) {
    console.error('❌ Update resume section error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating resume section'
    });
  }
});

// @desc    Toggle resume public status
// @route   PUT /api/resume/public
// @access  Private
router.put('/public', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      user: req.user._id,
      isActive: true 
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    resume.isPublic = !resume.isPublic;
    await resume.save();

    res.json({
      success: true,
      message: `Resume is now ${resume.isPublic ? 'public' : 'private'}`,
      data: { isPublic: resume.isPublic }
    });
  } catch (error) {
    console.error('❌ Toggle resume public status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating resume status'
    });
  }
});

// @desc    Download resume file
// @route   GET /api/resume/download/:id
// @access  Public (if public resume) or Private (if user's own resume)
router.get('/download/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Check access permissions
    const isOwner = req.user && resume.user.toString() === req.user._id.toString();
    const isPublic = resume.isPublic && resume.isActive;

    if (!isOwner && !isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    if (!resume.file || !resume.file.path) {
      return res.status(404).json({
        success: false,
        error: 'Resume file not found'
      });
    }

    // Increment download count
    resume.downloadCount += 1;
    await resume.save();

    // Set headers for file download
    res.setHeader('Content-Type', resume.file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${resume.file.originalName}"`);
    res.setHeader('Content-Length', resume.file.size);

    // Send file
    res.sendFile(resume.file.path, { root: process.cwd() });
  } catch (error) {
    console.error('❌ Download resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while downloading resume'
    });
  }
});

// @desc    Get resume statistics (Admin only)
// @route   GET /api/resume/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Resume.aggregate([
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          activeResumes: { $sum: { $cond: ['$isActive', 1, 0] } },
          publicResumes: { $sum: { $cond: ['$isPublic', 1, 0] } },
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);

    const userStats = await Resume.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const versionStats = await Resume.aggregate([
      { $group: { _id: '$version', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        users: userStats,
        versions: versionStats
      }
    });
  } catch (error) {
    console.error('❌ Get resume stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching resume statistics'
    });
  }
});

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this resume'
      });
    }

    // Soft delete by setting isActive to false
    resume.isActive = false;
    await resume.save();

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting resume'
    });
  }
});

export default router;
