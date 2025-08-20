# Portfolio Website Backend

A comprehensive Node.js/Express backend API for Ahaan's cybersecurity portfolio website.

## 🚀 Features

- **Authentication & Authorization**: JWT-based user authentication with role-based access control
- **Project Management**: CRUD operations for portfolio projects with categories and status tracking
- **Blog System**: Full-featured blog with categories, tags, and publishing workflow
- **Contact Management**: Contact form handling with admin dashboard
- **Resume Management**: Resume upload, storage, and public sharing
- **File Uploads**: Secure file handling with image optimization
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Comprehensive REST API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with Sharp for image processing
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan
- **Compression**: Compression middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PortfolioWebsite/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/portfolio
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Projects
- `GET /api/projects` - Get all published projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/like` - Like project

### Blog
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- `POST /api/blog/:id/like` - Like blog post
- `GET /api/blog/categories/list` - Get blog categories

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `GET /api/contact/:id` - Get single contact (Admin)
- `PUT /api/contact/:id/status` - Update contact status (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

### Resume
- `GET /api/resume/public` - Get public resume
- `GET /api/resume` - Get user's resume
- `POST /api/resume` - Create/update resume
- `PUT /api/resume/sections/:section` - Update resume section
- `PUT /api/resume/public` - Toggle public status
- `GET /api/resume/download/:id` - Download resume file

### File Uploads
- `POST /api/upload/resume` - Upload resume file
- `POST /api/upload/images` - Upload images
- `POST /api/upload/files` - Upload multiple files
- `GET /api/upload` - List uploaded files
- `GET /api/upload/:filename` - Get file info
- `DELETE /api/upload/:filename` - Delete file

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User
- Authentication details (username, email, password)
- Profile information (firstName, lastName, bio, avatar)
- Social links (GitHub, LinkedIn, Twitter, website)
- Role-based access control

### Project
- Project details (title, description, content)
- Technical information (tech stack, category, status)
- Links (GitHub, demo, documentation)
- Statistics (views, likes, downloads)

### BlogPost
- Content (title, excerpt, content, slug)
- Metadata (category, tags, read time)
- Publishing workflow (draft, published, archived)
- Statistics (views, likes, shares)

### Resume
- Personal information and summary
- Experience, education, skills
- Certifications and achievements
- File upload and public sharing

### Contact
- Contact form submissions
- Status tracking and responses
- Admin management features

## 🚀 Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── uploads/             # File upload directory
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevent abuse with request rate limiting
- **CORS Protection**: Configured CORS for frontend integration
- **Helmet**: Security headers and protection
- **File Upload Security**: File type and size validation

## 📁 File Uploads

The backend supports various file types:
- **Resumes**: PDF, DOC, DOCX, TXT
- **Images**: JPEG, PNG, GIF, WebP (with optimization)
- **Archives**: ZIP, RAR, 7Z

Files are stored in organized directories:
- `uploads/resumes/` - Resume files
- `uploads/images/` - Image files
- `uploads/` - General files

## 🌐 CORS Configuration

CORS is configured to allow requests from the frontend:
- **Development**: `http://localhost:5173`
- **Production**: Configure via `FRONTEND_URL` environment variable

## 📧 Email Integration

Email functionality is prepared for:
- Contact form notifications
- User registration confirmations
- Password reset emails

Configure SMTP settings in `.env` file.

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, unique JWT secret
- `FRONTEND_URL` - Production frontend URL

### Build and Deploy
```bash
npm run build
npm start
```

### PM2 (Recommended for production)
```bash
npm install -g pm2
pm2 start src/server.js --name "portfolio-backend"
pm2 save
pm2 startup
```

## 🧪 Testing

```bash
npm test
```

## 📝 API Documentation

For detailed API documentation, refer to the individual route files or use tools like:
- Postman
- Insomnia
- Swagger/OpenAPI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact: [Your Contact Information]

## 🔄 Updates

Stay updated with the latest changes:
- Watch the repository
- Check the changelog
- Follow development updates

---

**Happy Coding! 🚀**
