const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testFinal() {
  console.log('🧪 FINAL BACKEND TEST\n');
  console.log('='.repeat(60));

  let authToken = '';
  let testResults = {
    health: false,
    login: false,
    projects: false,
    partners: false,
    news: false,
    contact: false,
    protected: false
  };

  try {
    // 1. Health Check
    console.log('1️⃣  Testing Health Check...');
    try {
      const response = await axios.get(`${API_URL}/health`);
      console.log('   ✅ Status:', response.data.status);
      testResults.health = true;
    } catch (error) {
      console.log('   ❌ Failed:', error.message);
    }

    // 2. Login with seeded admin
    console.log('\n2️⃣  Testing Login...');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@matakiritrust.org',
        password: 'password123'
      });
      authToken = response.data.token || response.data.data?.token;
      if (authToken) {
        console.log('   ✅ Login successful, token received');
        testResults.login = true;
      } else {
        console.log('   ⚠️  Login response:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.log('   ❌ Login failed:', error.response?.data?.message || error.message);
    }

    // 3. Test Public Endpoints
    console.log('\n3️⃣  Testing Public Endpoints:');
    
    // Projects
    try {
      const response = await axios.get(`${API_URL}/projects`);
      const count = response.data.data?.length || response.data.count || 0;
      console.log(`   📁 Projects: ${count} found`);
      if (count > 0) {
        console.log(`      First: "${response.data.data[0].title}" (${response.data.data[0].category})`);
        testResults.projects = true;
      }
    } catch (error) {
      console.log('   ❌ Projects failed:', error.message);
    }

    // Partners
    try {
      const response = await axios.get(`${API_URL}/partners`);
      const count = response.data.data?.length || response.data.count || 0;
      console.log(`   🤝 Partners: ${count} found`);
      if (count > 0) {
        console.log(`      First: "${response.data.data[0].name}" (${response.data.data[0].partnershipLevel})`);
        testResults.partners = true;
      }
    } catch (error) {
      console.log('   ❌ Partners failed:', error.message);
    }

    // News
    try {
      const response = await axios.get(`${API_URL}/news`);
      const count = response.data.data?.length || response.data.count || 0;
      console.log(`   📰 News: ${count} found`);
      if (count > 0) {
        console.log(`      First: "${response.data.data[0].title}" (${response.data.data[0].category})`);
        testResults.news = true;
      }
    } catch (error) {
      console.log('   ❌ News failed:', error.message);
    }

    // Contact
    try {
      const response = await axios.post(`${API_URL}/contact`, {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message',
        message: 'Testing the contact form'
      });
      console.log(`   📧 Contact: ${response.data.message || 'Submitted'}`);
      testResults.contact = true;
    } catch (error) {
      console.log('   ❌ Contact failed:', error.message);
    }

    // 4. Test Protected Routes (if we have token)
    if (authToken) {
      console.log('\n4️⃣  Testing Protected Routes:');
      
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   🔐 Current User: ${response.data.data?.user?.name || response.data.data?.name}`);
        testResults.protected = true;
      } catch (error) {
        console.log('   ❌ Protected route failed:', error.response?.data?.message || error.message);
      }

      // Test admin endpoints
      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const count = response.data.data?.length || response.data.count || 0;
        console.log(`   👥 Users (admin): ${count} found`);
      } catch (error) {
        console.log('   ❌ Users endpoint failed:', error.response?.data?.message || error.message);
      }
    }

    // 5. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(Boolean).length;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${test}`);
    });

    console.log('\n🔗 Test URLs:');
    console.log(`   Health: ${API_URL}/health`);
    console.log(`   Projects: ${API_URL}/projects`);
    console.log(`   Partners: ${API_URL}/partners`);
    console.log(`   News: ${API_URL}/news`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Email: admin@matakiritrust.org');
    console.log('   Password: password123');

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

testFinal();