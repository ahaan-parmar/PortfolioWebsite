# 🚀 Portfolio Website Setup Guide

This guide will help you set up both the frontend and backend of your cybersecurity portfolio website.

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🏗️ Project Structure

```
PortfolioWebsite/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── SETUP.md          # This file
```

## 🚀 Quick Start

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: http://localhost:5173

### 2. Backend Setup

```bash
cd backend
npm install
```

**For Windows users:**
```bash
start.bat
```

**For Unix/Linux/Mac users:**
```bash
chmod +x start.sh
./start.sh
```

**Manual setup:**
```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
# Start the server
npm run dev
```

The backend will be available at: http://localhost:5000

## ⚙️ Configuration

### Frontend Configuration

The frontend is pre-configured with:
- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Tailwind CSS for styling
- ✅ Shadcn/ui components
- ✅ Framer Motion for animations
- ✅ React Router for navigation
- ✅ React Query for data fetching

### Backend Configuration

Edit `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Verify connection**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create free account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a cluster** (free tier available)
3. **Get connection string** and update `MONGODB_URI` in `.env`
4. **Whitelist your IP** in Network Access

## 🌱 Database Seeding

Populate your database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 👤 Admin user: `ahaan` / `Password123!`
- 🚀 Sample projects
- 📝 Sample blog posts

## 🔐 Authentication

### Default Admin Account

After running the seeder:
- **Username**: `ahaan`
- **Email**: `ahaan@example.com`
- **Password**: `Password123!`
- **Role**: `admin`

### Login

1. Start both frontend and backend
2. Navigate to `/login` (when implemented)
3. Use the credentials above

## 📁 File Uploads

The backend supports file uploads for:
- **Resumes**: PDF, DOC, DOCX, TXT
- **Images**: JPEG, PNG, GIF, WebP (with optimization)
- **Archives**: ZIP, RAR, 7Z

Files are stored in:
- `backend/uploads/resumes/` - Resume files
- `backend/uploads/images/` - Image files
- `backend/uploads/` - General files

## 🚀 Development Workflow

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all published projects
- `GET /api/blog` - Get all published blog posts
- `GET /api/resume/public` - Get public resume
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Require Authentication)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/blog` - Create blog post
- `POST /api/upload/*` - File uploads

### Admin Endpoints
- `GET /api/auth/users` - Get all users
- `GET /api/contact` - Get all contact submissions
- `GET /api/*/stats/*` - Get statistics

## 🔒 Security Features

- **JWT Authentication** with bcrypt password hashing
- **Rate Limiting** to prevent abuse
- **Input Validation** with express-validator
- **CORS Protection** configured for frontend
- **Helmet Security Headers**
- **File Upload Validation**

## 📱 Frontend Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark/Light Theme** - Toggle between themes
- ✅ **Smooth Animations** - Framer Motion powered
- ✅ **Modern UI Components** - Shadcn/ui based
- ✅ **TypeScript** - Type-safe development
- ✅ **Tailwind CSS** - Utility-first styling

## 🎯 Customization

### Update Personal Information

1. **Edit `frontend/src/pages/About.tsx`**
   - Update bio, skills, certifications
   - Modify education and experience

2. **Edit `frontend/src/pages/Projects.tsx`**
   - Update project descriptions
   - Add your own projects
   - Modify tech stacks

3. **Edit `frontend/src/pages/Home.tsx`**
   - Update hero section
   - Modify introduction text

### Update Styling

1. **Edit `frontend/tailwind.config.ts`**
   - Modify color scheme
   - Update fonts and spacing

2. **Edit `frontend/src/index.css`**
   - Custom CSS variables
   - Global styles

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy 'dist' folder to your hosting service
```

**Recommended hosting:**
- Vercel (free tier available)
- Netlify (free tier available)
- GitHub Pages (free)

### Backend Deployment

```bash
cd backend
npm run build
npm start
```

**Recommended hosting:**
- Railway (free tier available)
- Render (free tier available)
- Heroku (paid)
- DigitalOcean (paid)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access (for Atlas)

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill process using the port

3. **Frontend Can't Connect to Backend**
   - Verify backend is running
   - Check CORS configuration
   - Ensure correct API URL

4. **File Uploads Not Working**
   - Check uploads directory permissions
   - Verify file size limits
   - Check file type restrictions

### Debug Mode

Enable debug logging:

```bash
# Backend
NODE_ENV=development npm run dev

# Frontend
npm run dev
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🤝 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify configuration** in `.env` files
3. **Ensure all services** are running
4. **Check prerequisites** are installed
5. **Review this setup guide**

## 🎉 Next Steps

After successful setup:

1. **Customize content** with your information
2. **Add your projects** through the API
3. **Write blog posts** when ready
4. **Upload your resume** for public access
5. **Deploy to production** when satisfied

---

**Happy Coding! 🚀**

Your cybersecurity portfolio website is now ready for development and customization!
