import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  version: {
    type: String,
    required: [true, 'Resume version is required'],
    default: '1.0'
  },
  file: {
    originalName: String,
    filename: String,
    path: String,
    size: Number,
    mimetype: String
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    twitter: String
  },
  summary: {
    type: String,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: [String],
    technologies: [String],
    achievements: [String]
  }],
  education: [{
    degree: String,
    field: String,
    institution: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    gpa: String,
    relevantCoursework: [String],
    achievements: [String]
  }],
  skills: {
    technical: [String],
    soft: [String],
    tools: [String],
    languages: [String]
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    credentialId: String,
    url: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    github: String,
    demo: String,
    highlights: [String]
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    issuer: String
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
resumeSchema.index({ user: 1 });
resumeSchema.index({ title: 1 });
resumeSchema.index({ isActive: 1 });
resumeSchema.index({ isPublic: 1 });
resumeSchema.index({ 'personalInfo.email': 1 });

// Virtual for full name
resumeSchema.virtual('fullName').get(function() {
  if (this.personalInfo.firstName && this.personalInfo.lastName) {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
  }
  return this.personalInfo.firstName || this.personalInfo.lastName || '';
});

// Virtual for experience duration
resumeSchema.virtual('totalExperience').get(function() {
  if (!this.experience || this.experience.length === 0) return 0;
  
  let totalMonths = 0;
  this.experience.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate);
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    totalMonths += diffMonths;
  });
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years > 0 && months > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
});

// Set virtuals when converting to JSON
resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
