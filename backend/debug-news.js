const mongoose = require('mongoose');
require('dotenv').config();

async function debugNews() {
  console.log('🔍 Debugging News Issue\n');
  
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matakiri'
    );
    console.log('✅ Connected to MongoDB\n');

    // Load News model
    const News = require('./models/News');
    
    // Check what's in the database
    const allNews = await News.find({});
    console.log(`📊 Total news in database: ${allNews.length}`);
    
    if (allNews.length > 0) {
      console.log('\n📰 News articles in database:');
      allNews.forEach((article, index) => {
        console.log(`\n${index + 1}. "${article.title}"`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Status: ${article.status}`);
        console.log(`   Published: ${article.published}`);
        console.log(`   Created: ${article.createdAt}`);
      });
    } else {
      console.log('❌ No news articles in database');
      
      // Check if the seeder worked
      console.log('\n🔍 Checking if seeder created news...');
      const User = require('./models/User');
      const users = await User.find({});
      console.log(`   Users found: ${users.length}`);
    }
    
    // Check the API response
    console.log('\n🌐 Checking API response...');
    const axios = require('axios');
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      console.log('   API Status:', response.status);
      console.log('   API Data structure:', Object.keys(response.data));
      console.log('   Count in response:', response.data.count);
      console.log('   Data length:', response.data.data?.length);
      
      if (response.data.data && response.data.data.length === 0) {
        console.log('   ⚠️ API returning empty array');
        
        // Try to see if there's filtering happening
        console.log('\n🔍 Checking if news has "published" field...');
        const newsWithStatus = await News.findOne({});
        if (newsWithStatus) {
          console.log('   Sample news fields:', Object.keys(newsWithStatus.toObject()));
          console.log('   Has "published" field:', 'published' in newsWithStatus.toObject());
          console.log('   Has "status" field:', 'status' in newsWithStatus.toObject());
        }
      }
    } catch (apiError) {
      console.log('   ❌ API Error:', apiError.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugNews();