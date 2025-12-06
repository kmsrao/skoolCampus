const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testLogin() {
  console.log('======================================');
  console.log('Testing SkoolCampus Admin Login');
  console.log('======================================\n');

  try {
    // Step 1: Login
    console.log('1. Testing Login...');
    console.log('   Email: admin@skoolcampus.com');
    console.log('   Password: admin\n');

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@skoolcampus.com',
      password: 'admin'
    });

    console.log('✅ Login Successful!\n');
    console.log('Login Response:');
    console.log(JSON.stringify(loginResponse.data, null, 2));
    console.log('\n');

    const { accessToken, user } = loginResponse.data;

    console.log('User Details:');
    console.log('  - Name:', user.name);
    console.log('  - Role:', user.role, '(Admin)');
    console.log('  - User Type:', user.userType);
    console.log('  - Branch ID:', user.branchId);
    console.log('\n');

    // Step 2: Test protected endpoint - Get Current User
    console.log('======================================');
    console.log('2. Testing Protected Endpoint: GET /auth/me');
    console.log('======================================\n');

    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Protected Endpoint Accessible!\n');
    console.log('Current User:');
    console.log(JSON.stringify(meResponse.data, null, 2));
    console.log('\n');

    // Step 3: Test admin dashboard
    console.log('======================================');
    console.log('3. Testing Admin Dashboard');
    console.log('======================================\n');

    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard/admin?branchId=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Dashboard Accessible!\n');
    console.log('Dashboard Data:');
    console.log(JSON.stringify(dashboardResponse.data, null, 2));
    console.log('\n');

    // Step 4: Test user profile
    console.log('======================================');
    console.log('4. Testing User Profile');
    console.log('======================================\n');

    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Profile Accessible!\n');
    console.log('Profile Data:');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    console.log('\n');

    // Summary
    console.log('======================================');
    console.log('✅ All Tests Passed Successfully!');
    console.log('======================================\n');

    console.log('Summary:');
    console.log('  ✅ Login working');
    console.log('  ✅ JWT token generated');
    console.log('  ✅ Protected endpoints accessible');
    console.log('  ✅ Admin dashboard working');
    console.log('  ✅ User profile working');
    console.log('\n');

    console.log('Admin Credentials:');
    console.log('  Email: admin@skoolcampus.com');
    console.log('  Password: admin');
    console.log('\n');

  } catch (error) {
    console.error('❌ Test Failed!\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testLogin();
