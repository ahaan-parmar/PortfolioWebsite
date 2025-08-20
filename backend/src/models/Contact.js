import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: false,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  isEncrypted: {
    type: Boolean,
    default: false
  },
  encryptedPayload: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [200, 'Website URL cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['General Inquiry', 'Job Opportunity', 'Collaboration', 'Security Consultation', 'Bug Report', 'Other'],
    default: 'General Inquiry'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Responded', 'Closed', 'Spam'],
    default: 'New'
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  tags: [String],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create indexes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: 1 });
contactSchema.index({ isRead: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (this.response && this.response.respondedAt) {
    const created = new Date(this.createdAt);
    const responded = new Date(this.response.respondedAt);
    const diffTime = Math.abs(responded - created);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  }
  return null;
});

// Set virtuals when converting to JSON
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
