import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Project content is required']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['Security Tool', 'Web Security', 'Red Team Tool', 'API Security', 'Education', 'Network Security', 'Other']
  },
  techStack: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['Complete', 'Active', 'In Development', 'Planning'],
    default: 'In Development'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  links: {
    github: String,
    demo: String,
    documentation: String,
    download: String
  },
  metadata: {
    readTime: String,
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    tags: [String]
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
    downloads: {
      type: Number,
      default: 0
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
projectSchema.index({ title: 'text', description: 'text', content: 'text' });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ author: 1 });
projectSchema.index({ isPublished: 1 });

// Virtual for full URL
projectSchema.virtual('fullGithubUrl').get(function() {
  if (this.links.github && !this.links.github.startsWith('http')) {
    return `https://github.com/${this.links.github}`;
  }
  return this.links.github;
});

// Set virtuals when converting to JSON
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
