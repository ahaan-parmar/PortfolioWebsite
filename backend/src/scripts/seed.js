import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    username: 'ahaan',
    email: 'ahaan@example.com',
    password: 'Password123!',
    role: 'admin',
    profile: {
      firstName: 'Ahaan',
      lastName: 'Cybersecurity',
      bio: 'Passionate cybersecurity student dedicated to securing the digital world through ethical hacking, vulnerability research, and continuous learning.',
      socialLinks: {
        github: 'https://github.com/ahaan',
        linkedin: 'https://linkedin.com/in/ahaan',
        twitter: 'https://twitter.com/ahaan',
        website: 'https://ahaan.dev'
      }
    }
  }
];

const sampleProjects = [
  {
    title: 'VulnScanner Pro',
    description: 'Automated vulnerability scanner for web applications with custom payload generation and advanced reporting capabilities.',
    shortDescription: 'Advanced web vulnerability scanner with custom payloads',
    content: 'A comprehensive vulnerability scanner built with Python and Flask...',
    category: 'Security Tool',
    techStack: ['Python', 'Flask', 'SQLite', 'Nmap', 'Burp Suite API'],
    status: 'Active',
    featured: true,
    links: {
      github: 'https://github.com/ahaan/vulnscanner-pro',
      demo: 'https://demo.vulnscanner-pro.com',
      documentation: 'https://docs.vulnscanner-pro.com'
    },
    metadata: {
      readTime: '5 min read',
      difficulty: 'Advanced',
      tags: ['Web Security', 'Automation', 'Python']
    },
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: 'XSS Hunter',
    description: 'Advanced XSS detection framework with blind XSS capabilities, payload obfuscation, and real-time notifications.',
    shortDescription: 'Blind XSS detection and payload management system',
    content: 'XSS Hunter is a comprehensive framework for detecting and managing XSS vulnerabilities...',
    category: 'Web Security',
    techStack: ['JavaScript', 'Node.js', 'MongoDB', 'WebSocket'],
    status: 'Complete',
    featured: false,
    links: {
      github: 'https://github.com/ahaan/xss-hunter',
      demo: 'https://xss-hunter.ahaan.dev'
    },
    metadata: {
      readTime: '8 min read',
      difficulty: 'Intermediate',
      tags: ['XSS', 'Web Security', 'JavaScript']
    },
    isPublished: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  }
];

const sampleBlogPosts = [
  {
    title: 'Getting Started with Web Application Security',
    excerpt: 'A beginner-friendly guide to understanding web application security fundamentals and common vulnerabilities.',
    content: 'Web application security is a critical aspect of modern software development...',
    category: 'Tutorial',
    tags: ['Web Security', 'Beginner', 'OWASP'],
    featured: true,
    status: 'published',
    publishedAt: new Date(),
    metadata: {
      readTime: '10 min read',
      difficulty: 'Beginner',
      estimatedReadTime: 10
    }
  }
];

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.username}`);
    }

    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Seed projects
const seedProjects = async (users) => {
  try {
    // Clear existing projects
    await Project.deleteMany({});
    console.log('🧹 Cleared existing projects');

    // Create projects
    const createdProjects = [];
    for (const projectData of sampleProjects) {
      const project = await Project.create({
        ...projectData,
        author: users[0]._id // Assign to first user
      });
      createdProjects.push(project);
      console.log(`✅ Created project: ${project.title}`);
    }

    return createdProjects;
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    throw error;
  }
};

// Seed blog posts
const seedBlogPosts = async (users) => {
  try {
    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log('🧹 Cleared existing blog posts');

    // Create blog posts
    const createdBlogPosts = [];
    for (const blogData of sampleBlogPosts) {
      const blogPost = await BlogPost.create({
        ...blogData,
        author: users[0]._id // Assign to first user
      });
      createdBlogPosts.push(blogPost);
      console.log(`✅ Created blog post: ${blogPost.title}`);
    }

    return createdBlogPosts;
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Seed data
    const users = await seedUsers();
    const projects = await seedProjects(users);
    const blogPosts = await seedBlogPosts(users);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${projects.length} projects, ${blogPosts.length} blog posts`);
    
    // Display sample data info
    console.log('\n📋 Sample Data Created:');
    console.log(`👤 Admin User: ${users[0].username} (${users[0].email})`);
    console.log(`🔑 Password: ${sampleUsers[0].password}`);
    console.log(`🚀 Projects: ${projects.map(p => p.title).join(', ')}`);
    console.log(`📝 Blog Posts: ${blogPosts.map(b => b.title).join(', ')}`);
    
    console.log('\n💡 You can now log in with the admin account to manage content!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
