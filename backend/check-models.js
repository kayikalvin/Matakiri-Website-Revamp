const mongoose = require('mongoose');
require('dotenv').config();

async function checkModels() {
  console.log('🔍 Checking Model Schemas\n');
  
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matakiri'
    );
    console.log('✅ Connected to MongoDB\n');

    // Load models
    const User = require('./models/User');
    const Project = require('./models/Project');
    const Partner = require('./models/Partner');
    const News = require('./models/News');
    const Contact = require('./models/Contact');

    console.log('📋 User Model Schema:');
    console.log('   Role enum:', User.schema.path('role')?.enumValues || 'Not found');
    console.log('   Department enum:', User.schema.path('department')?.enumValues || 'Not found');

    console.log('\n📋 Project Model Schema:');
    console.log('   Category enum:', Project.schema.path('category')?.enumValues || 'Not found');
    console.log('   Status enum:', Project.schema.path('status')?.enumValues || 'Not found');

    console.log('\n📋 Partner Model Schema:');
    console.log('   Partnership Level enum:', Partner.schema.path('partnershipLevel')?.enumValues || 'Not found');
    console.log('   Category enum:', Partner.schema.path('category')?.enumValues || 'Not found');

    console.log('\n📋 News Model Schema:');
    console.log('   Category enum:', News.schema.path('category')?.enumValues || 'Not found');
    console.log('   Status enum:', News.schema.path('status')?.enumValues || 'Not found');

    console.log('\n📋 Contact Model Schema:');
    console.log('   Status enum:', Contact.schema.path('status')?.enumValues || 'Not found');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkModels();