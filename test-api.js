const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Test script to verify API endpoints
async function testEndpoints() {
  console.log('Testing API endpoints...\n');

  try {
    // Test basic server connection
    console.log('1. Testing server connection...');
    const serverTest = await axios.get('http://localhost:4000');
    console.log('✓ Server is running:', serverTest.data.message);

    // Test endpoints without authentication (should get 401)
    console.log('\n2. Testing endpoints without auth (expecting 401)...');

    const endpoints = [
      '/service-requests/all',
      '/leave/all',
      '/feedback/all'
    ];

    for (const endpoint of endpoints) {
      try {
        await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`❌ ${endpoint}: Should require authentication`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✓ ${endpoint}: Correctly requires authentication (401)`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${endpoint}: Route not found (404)`);
        } else {
          console.log(`⚠️ ${endpoint}: Unexpected error:`, error.response?.status);
        }
      }
    }

  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
  }
}

testEndpoints();
