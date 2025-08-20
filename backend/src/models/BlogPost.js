import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Blog post slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog post excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog post content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Blog post category is required'],
    enum: ['Technical Analysis', 'Tutorial', 'CTF Writeup', 'Methodology', 'Security Research', 'Red Team Tactics', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  metadata: {
    readTime: String,
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    estimatedReadTime: Number
  },
  coverImage: {
    url: String,
    alt: String,
    caption: String
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Create indexes
blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ featured: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ publishedAt: 1 });

// Generate slug from title before saving
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  next();
});

// Virtual for full URL
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Set virtuals when converting to JSON
blogPostSchema.set('toJSON', { virtuals: true });
blogPostSchema.set('toObject', { virtuals: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
