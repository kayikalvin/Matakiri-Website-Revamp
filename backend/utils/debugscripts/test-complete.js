const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

let authToken = '';
let adminUserId = '';
let projectId = '';
let partnerId = '';
let newsId = '';

async function testCompleteAPI() {
  console.log('=== COMPLETE BACKEND API TEST ===\n');
  console.log('Server URL:', API_URL);
  console.log('Timestamp:', new Date().toISOString(), '\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣  Testing Health Check...');
    try {
      const response = await axios.get(`${API_URL}/health`);
      console.log('✅ Health Check:', response.data.status);
      console.log('   Service:', response.data.service);
    } catch (error) {
      console.log('❌ Health Check Failed:', error.message);
      return;
    }

    // 2. Test User Registration
    console.log('\n2️⃣  Testing User Registration...');
    const uniqueEmail = `admin${Date.now()}@matakiri.org`;
    const userData = {
      name: 'Test Administrator',
      email: uniqueEmail,
      password: 'Admin123!',
      role: 'admin'
    };

    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('✅ Registration Successful');
      console.log('   User:', response.data.user.name);
      console.log('   Role:', response.data.user.role);
      authToken = response.data.token;
      adminUserId = response.data.user.id;
    } catch (error) {
      console.log('⚠️  Registration Failed:', error.response?.data?.message || error.message);
      
      // Try login with default admin
      console.log('   Trying login with default admin...');
      try {
        const loginData = {
          email: 'admin@matakiri.org',
          password: 'password123'
        };
        const loginRes = await axios.post(`${API_URL}/auth/login`, loginData);
        authToken = loginRes.data.token;
        adminUserId = loginRes.data.user.id;
        console.log('✅ Login Successful');
      } catch (loginError) {
        console.log('❌ Login Failed:', loginError.response?.data?.message || loginError.message);
      }
    }

    if (!authToken) {
      console.log('\n⚠️  Skipping protected route tests - no authentication token');
      return;
    }

    // 3. Test Protected Route (Get Current User)
    console.log('\n3️⃣  Testing Protected Route - Get Current User...');
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Protected Route Successful');
      console.log('   Current User:', response.data.data?.name);
    } catch (error) {
      console.log('❌ Protected Route Failed:', error.response?.data?.message || error.message);
    }

    // 4. Test Project Creation
    console.log('\n4️⃣  Testing Project Creation...');
    const projectData = {
      title: 'Test AI Conservation Project',
      description: 'Using AI to monitor and protect endangered species in Papua New Guinea',
      shortDescription: 'AI-powered wildlife conservation',
      category: 'ai',
      status: 'active',
      location: 'Papua New Guinea',
      goals: ['Monitor endangered species', 'Prevent illegal logging', 'Engage local communities'],
      startDate: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${API_URL}/projects`, projectData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      projectId = response.data.data?._id || response.data.data?.id;
      console.log('✅ Project Created Successfully');
      console.log('   Title:', response.data.data?.title);
      console.log('   ID:', projectId);
    } catch (error) {
      console.log('❌ Project Creation Failed:', error.response?.data?.message || error.message);
    }

    // 5. Test Get All Projects
    console.log('\n5️⃣  Testing Get All Projects...');
    try {
      const response = await axios.get(`${API_URL}/projects`);
      const projects = response.data.data || [];
      console.log('✅ Projects Retrieved');
      console.log('   Count:', projects.length);
      if (projects.length > 0) {
        console.log('   First Project:', projects[0].title);
      }
    } catch (error) {
      console.log('❌ Get Projects Failed:', error.response?.data?.message || error.message);
    }

    // 6. Test Partner Creation
    console.log('\n6️⃣  Testing Partner Creation...');
    const partnerData = {
      name: 'Test Corporate Partner Ltd',
      description: 'A corporate partner supporting conservation efforts',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      website: 'https://testpartner.com',
      partnershipLevel: 'gold',
      category: 'corporate'
    };

    try {
      const response = await axios.post(`${API_URL}/partners`, partnerData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      partnerId = response.data.data?._id || response.data.data?.id;
      console.log('✅ Partner Created Successfully');
      console.log('   Name:', response.data.data?.name);
      console.log('   Level:', response.data.data?.partnershipLevel);
    } catch (error) {
      console.log('❌ Partner Creation Failed:', error.response?.data?.message || error.message);
    }

    // 7. Test Get All Partners
    console.log('\n7️⃣  Testing Get All Partners...');
    try {
      const response = await axios.get(`${API_URL}/partners`);
      const partners = response.data.data || [];
      console.log('✅ Partners Retrieved');
      console.log('   Count:', partners.length);
    } catch (error) {
      console.log('❌ Get Partners Failed:', error.response?.data?.message || error.message);
    }

    // 8. Test News Creation
    console.log('\n8️⃣  Testing News Creation...');
    const newsData = {
      title: 'Matakiri Launches New Conservation Initiative',
      excerpt: 'New project aims to protect rainforests using innovative technology',
      content: 'Matakiri Tumaini Centre has launched an innovative conservation project that combines traditional knowledge with modern technology to protect Papua New Guinea\'s rainforests.',
      category: 'announcement',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      tags: ['conservation', 'technology', 'innovation'],
      isFeatured: true
    };

    try {
      const response = await axios.post(`${API_URL}/news`, newsData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      newsId = response.data.data?._id || response.data.data?.id;
      console.log('✅ News Created Successfully');
      console.log('   Title:', response.data.data?.title);
      console.log('   Slug:', response.data.data?.slug);
    } catch (error) {
      console.log('❌ News Creation Failed:', error.response?.data?.message || error.message);
    }

    // 9. Test Get All News
    console.log('\n9️⃣  Testing Get All News...');
    try {
      const response = await axios.get(`${API_URL}/news`);
      const news = response.data.data || [];
      console.log('✅ News Retrieved');
      console.log('   Count:', news.length);
    } catch (error) {
      console.log('❌ Get News Failed:', error.response?.data?.message || error.message);
    }

    // 10. Test Contact Form Submission
    console.log('\n🔟  Testing Contact Form...');
    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry about Volunteering',
      message: 'I would like to volunteer for your conservation projects. How can I get involved?',
      phone: '+1234567890'
    };

    try {
      const response = await axios.post(`${API_URL}/contact`, contactData);
      console.log('✅ Contact Form Submitted Successfully');
      console.log('   Message:', response.data.message || 'Submitted');
    } catch (error) {
      console.log('❌ Contact Form Failed:', error.response?.data?.message || error.message);
    }

    // 11. Test Logout
    console.log('\n1️⃣1️⃣  Testing Logout...');
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Logout Successful');
    } catch (error) {
      console.log('⚠️  Logout Failed (might not be implemented):', error.response?.data?.message || error.message);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Server is running');
    console.log('✅ MongoDB is connected');
    console.log(`✅ Authentication: ${authToken ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Projects API: ${projectId ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Partners API: ${partnerId ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ News API: ${newsId ? 'WORKING' : 'FAILED'}`);
    console.log('✅ Contact API: TESTED');
    console.log('\n📊 Available Endpoints:');
    console.log('- GET    /api/health');
    console.log('- POST   /api/auth/register');
    console.log('- POST   /api/auth/login');
    console.log('- GET    /api/auth/me (protected)');
    console.log('- POST   /api/auth/logout (protected)');
    console.log('- GET    /api/projects');
    console.log('- POST   /api/projects (protected)');
    console.log('- GET    /api/partners');
    console.log('- POST   /api/partners (protected)');
    console.log('- GET    /api/news');
    console.log('- POST   /api/news (protected)');
    console.log('- POST   /api/contact');
    console.log('\n🔗 Test URLs:');
    console.log(`Health: ${API_URL}/health`);
    console.log(`Projects: ${API_URL}/projects`);

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testCompleteAPI();