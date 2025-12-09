const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Partner = require('../models/Partner');
const News = require('../models/News');
require('dotenv').config();

// Simple connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matakiri'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@matakiritrust.org',
    password: 'password123',
    role: 'admin',
    department: 'management'
  },
  {
    name: 'Editor User',
    email: 'editor@matakiritrust.org',
    password: 'password123',
    role: 'editor',
    department: 'projects'
  }
];

const projects = [
  {
    title: 'AI-Powered Agricultural Advisory System',
    slug: 'ai-agricultural-advisory',
    description: 'A comprehensive AI-driven platform that provides personalized farming recommendations to smallholder farmers in Kenya. The system analyzes soil data, weather patterns, and crop performance to deliver actionable insights.',
    shortDescription: 'AI platform delivering personalized farming recommendations to Kenyan smallholder farmers.',
    category: 'ai', // Valid: 'agriculture', 'education', 'health', 'water', 'ai', 'innovation', 'community'
    status: 'active', // Valid: 'planning', 'active', 'completed', 'paused'
    startDate: new Date('2023-01-15'),
    endDate: new Date('2024-12-31'),
    location: 'Western Kenya',
    impactMetrics: {
      beneficiaries: 2500,
      communitiesReached: 45,
      successRate: 87
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        caption: 'Farmers using the AI advisory system',
        isFeatured: true
      }
    ],
    isFeatured: true,
    isAIPowered: true,
    aiComponents: [
      {
        name: 'Crop Recommendation Engine',
        description: 'Machine learning model that recommends optimal crops based on soil and climate data',
        technology: 'TensorFlow'
      }
    ],
    budget: {
      estimated: 150000,
      spent: 95000,
      currency: 'KES'
    }
  },
  {
    title: 'Community Health Monitoring Network',
    slug: 'community-health-monitoring',
    description: 'Establishing a network of community health workers equipped with digital tools to monitor disease patterns and improve healthcare delivery in rural areas.',
    shortDescription: 'Digital health monitoring network for rural communities.',
    category: 'health', // Valid: 'agriculture', 'education', 'health', 'water', 'ai', 'innovation', 'community'
    status: 'active', // Valid: 'planning', 'active', 'completed', 'paused'
    startDate: new Date('2023-03-01'),
    location: 'Nyanza Region',
    impactMetrics: {
      beneficiaries: 1800,
      communitiesReached: 32,
      successRate: 92
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
        caption: 'Community health workers in training',
        isFeatured: true
      }
    ],
    isFeatured: true,
    budget: {
      estimated: 120000,
      spent: 78000,
      currency: 'KES'
    }
  }
];

const partners = [
  {
    name: 'United Nations Development Programme',
    description: 'International development organization supporting sustainable development initiatives.',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200',
    website: 'https://undp.org',
    partnershipLevel: 'strategic', // Valid: 'strategic', 'gold', 'silver', 'bronze'
    category: 'international' // Valid: 'international', 'government', 'corporate', 'ngo', 'academic'
  },
  {
    name: 'Kenya Ministry of Agriculture',
    description: 'Government ministry responsible for agricultural development and food security.',
    logo: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=200',
    website: 'https://agriculture.go.ke',
    partnershipLevel: 'gold', // Valid: 'strategic', 'gold', 'silver', 'bronze'
    category: 'government' // Valid: 'international', 'government', 'corporate', 'ngo', 'academic'
  }
];

const news = [
  {
    title: 'Matakiri Tumaini Centre Launches AI Agricultural Initiative',
    slug: 'ai-agricultural-initiative-launch',
    excerpt: 'Revolutionary AI-powered platform set to transform farming practices for Kenyan smallholder farmers.',
    content: 'Matakiri Tumaini Centre has officially launched its groundbreaking AI Agricultural Advisory System, marking a significant milestone in the organization\'s mission to harness technology for community development. The platform leverages artificial intelligence to provide personalized farming recommendations based on real-time data analysis.',
    category: 'announcements',
    status: 'published',
    published: true, // ADD THIS LINE
    featuredImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    tags: ['AI', 'Agriculture', 'Innovation'],
    isFeatured: true
  },
  {
    title: 'Partnership with UNDP Strengthens Community Development Efforts',
    slug: 'undp-partnership-announcement',
    excerpt: 'New strategic partnership will enhance sustainable development initiatives across Kenya.',
    content: 'Matakiri Tumaini Centre is pleased to announce a strategic partnership with the United Nations Development Programme (UNDP) to strengthen community development efforts across Kenya. This collaboration will focus on integrating innovative technologies with sustainable development practices.',
    category: 'partnerships',
    status: 'published',
    published: true, // ADD THIS LINE
    featuredImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    tags: ['Partnership', 'UNDP', 'Development'],
    isFeatured: true
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Partner.deleteMany();
    await News.deleteMany();

    // Create users
    const createdUsers = await User.create(users);
    console.log('✅ Users imported:', createdUsers.length);

    // Create projects with admin as creator
    const projectsWithCreator = projects.map(project => ({
      ...project,
      createdBy: createdUsers[0]._id
    }));
    const createdProjects = await Project.create(projectsWithCreator);
    console.log('✅ Projects imported:', createdProjects.length);

    // Create partners
    const createdPartners = await Partner.create(partners);
    console.log('✅ Partners imported:', createdPartners.length);

    // Create news
    const newsWithCreator = news.map(article => ({
      ...article,
      author: createdUsers[0]._id
    }));
    const createdNews = await News.create(newsWithCreator);
    console.log('✅ News articles imported:', createdNews.length);

    console.log('\n🎉 Data Import Success!');
    console.log('\n📋 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Projects: ${createdProjects.length}`);
    console.log(`   - Partners: ${createdPartners.length}`);
    console.log(`   - News: ${createdNews.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@matakiritrust.org / password123');
    console.log('   Editor: editor@matakiritrust.org / password123');
    
    console.log('\n📊 Data Details:');
    console.log('   Project Categories:', createdProjects.map(p => p.category));
    console.log('   Partner Levels:', createdPartners.map(p => p.partnershipLevel));
    console.log('   News Categories:', createdNews.map(n => n.category));
    
    process.exit();
  } catch (error) {
    console.error('❌ Data Import Error:', error.message);
    if (error.errors) {
      console.log('   Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Project.deleteMany();
    await Partner.deleteMany();
    await News.deleteMany();

    console.log('✅ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Destroy Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}