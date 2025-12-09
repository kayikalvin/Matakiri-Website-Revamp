const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function debugAuth() {
  console.log('🔍 Debugging Authentication Issues\n');
  console.log('='.repeat(60));

  // Test 1: Check registration endpoint
  console.log('\n1. Testing Registration Endpoint...');
  const uniqueEmail = `debug${Date.now()}@matakiri.org`;
  const userData = {
    name: 'Debug User',
    email: uniqueEmail,
    password: 'Debug123!',
    role: 'admin'
  };

  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('✅ Registration Response Status:', response.status);
    console.log('✅ Registration Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user) {
      console.log('✅ User data exists:', response.data.user);
    } else if (response.data.data?.user) {
      console.log('✅ User data in data.user:', response.data.data.user);
      console.log('✅ Token:', response.data.token || response.data.data?.token);
    } else {
      console.log('❌ User data structure:');
      console.log('   Full response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('❌ Registration Error:');
    console.log('   Status:', error.response?.status);
    console.log('   Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('   Message:', error.message);
  }

  // Test 2: Check what users exist
  console.log('\n2. Checking existing users...');
  try {
    const User = require('../../models/User');
    const users = await User.find();
    console.log(`✅ Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
  } catch (dbError) {
    console.log('❌ Database error:', dbError.message);
  }

  // Test 3: Try login with known users
  console.log('\n3. Testing Login with various emails...');
  const testEmails = [
    'admin@matakiri.org',
    'admin@matakiritrust.org',
    'test@matakiri.org'
  ];

  for (const email of testEmails) {
    console.log(`\n   Trying: ${email}`);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: 'password123'
      });
      console.log(`   ✅ Login successful for ${email}`);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      break;
    } catch (loginError) {
      console.log(`   ❌ Failed for ${email}:`, loginError.response?.data?.message || loginError.message);
    }
  }

  // Test 4: Check auth routes structure
  console.log('\n4. Checking auth routes...');
  try {
    console.log('   Testing GET /api/auth/me (should fail without token)');
    const response = await axios.get(`${API_URL}/auth/me`, {
      validateStatus: () => true // Accept any status
    });
    console.log(`   Status: ${response.status}`);
    console.log('   Response:', response.data);
  } catch (error) {
    console.log('   Error:', error.message);
  }
}

debugAuth();