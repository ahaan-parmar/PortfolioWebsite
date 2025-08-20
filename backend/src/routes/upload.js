import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
const resumeDir = './uploads/resumes';
const imagesDir = './uploads/images';

[uploadsDir, resumeDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type or route
    if (req.baseUrl.includes('resume')) {
      cb(null, resumeDir);
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, imagesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = {
    // Resume files
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
    'text/plain': true,
    
    // Image files
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    
    // Archive files
    'application/zip': true,
    'application/x-rar-compressed': true,
    'application/x-7z-compressed': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// @desc    Upload resume file
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.json({
      success: true,
      message: 'Resume file uploaded successfully',
      data: fileInfo
    });
  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while uploading resume'
    });
  }
});

// @desc    Upload image files
// @route   POST /api/upload/images
// @access  Private
router.post('/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images uploaded'
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        // Process image with sharp (resize, optimize)
        const imageBuffer = await sharp(file.path)
          .resize(1200, 1200, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Save optimized image
        const optimizedPath = file.path.replace(/\.[^/.]+$/, '_optimized.jpg');
        await fs.promises.writeFile(optimizedPath, imageBuffer);

        // Get image metadata
        const metadata = await sharp(file.path).metadata();

        uploadedImages.push({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          optimizedPath: optimizedPath,
          size: file.size,
          mimetype: file.mimetype,
          dimensions: {
            width: metadata.width,
            height: metadata.height
          }
        });
      } catch (processError) {
        console.error('❌ Image processing error:', processError);
        // If processing fails, still include the original file
        uploadedImages.push({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          error: 'Image processing failed'
        });
      }
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while uploading images'
    });
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/files
// @access  Private
router.post('/files', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while uploading files'
    });
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Search for file in all upload directories
    const searchDirs = [uploadsDir, resumeDir, imagesDir];
    let filePath = null;

    for (const dir of searchDirs) {
      const potentialPath = path.join(dir, filename);
      if (fs.existsSync(potentialPath)) {
        filePath = potentialPath;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete the file
    await fs.promises.unlink(filePath);

    // Also try to delete optimized version if it exists
    const optimizedPath = filePath.replace(/\.[^/.]+$/, '_optimized.jpg');
    if (fs.existsSync(optimizedPath)) {
      try {
        await fs.promises.unlink(optimizedPath);
      } catch (optimizedDeleteError) {
        console.warn('⚠️ Could not delete optimized version:', optimizedDeleteError.message);
      }
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('❌ File deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting file'
    });
  }
});

// @desc    Get file info
// @route   GET /api/upload/:filename
// @access  Private
router.get('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Search for file in all upload directories
    const searchDirs = [uploadsDir, resumeDir, imagesDir];
    let filePath = null;
    let fileDir = null;

    for (const dir of searchDirs) {
      const potentialPath = path.join(dir, filename);
      if (fs.existsSync(potentialPath)) {
        filePath = potentialPath;
        fileDir = dir;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = await fs.promises.stat(filePath);
    
    const fileInfo = {
      filename,
      path: filePath,
      directory: fileDir,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory()
    };

    res.json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('❌ Get file info error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while getting file info'
    });
  }
});

// @desc    List uploaded files
// @route   GET /api/upload
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { directory = 'all' } = req.query;
    
    let directories = [];
    if (directory === 'all') {
      directories = [uploadsDir, resumeDir, imagesDir];
    } else if (directory === 'resumes') {
      directories = [resumeDir];
    } else if (directory === 'images') {
      directories = [imagesDir];
    } else {
      directories = [uploadsDir];
    }

    const allFiles = [];

    for (const dir of directories) {
      try {
        const files = await fs.promises.readdir(dir);
        
        for (const file of files) {
          if (file === '.gitkeep') continue; // Skip gitkeep files
          
          const filePath = path.join(dir, file);
          const stats = await fs.promises.stat(filePath);
          
          if (stats.isFile()) {
            allFiles.push({
              filename: file,
              directory: dir,
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime
            });
          }
        }
      } catch (dirError) {
        console.warn(`⚠️ Could not read directory ${dir}:`, dirError.message);
      }
    }

    // Sort by modification date (newest first)
    allFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    res.json({
      success: true,
      data: allFiles
    });
  } catch (error) {
    console.error('❌ List files error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while listing files'
    });
  }
});

export default router;
