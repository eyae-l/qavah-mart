/**
 * Simple script to test authentication APIs
 * Run with: npx ts-node scripts/testAuth.ts
 */

async function testAuth() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Authentication APIs...\n');

  // Test 1: Register
  console.log('1️⃣ Testing Registration...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+251911234567',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
      }),
    });

    const registerData = await registerResponse.json();
    console.log('✅ Register Response:', JSON.stringify(registerData, null, 2));
    console.log('');
  } catch (error) {
    console.error('❌ Register Error:', error);
  }

  // Test 2: Login
  console.log('2️⃣ Testing Login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login Response:', JSON.stringify(loginData, null, 2));
    console.log('');
  } catch (error) {
    console.error('❌ Login Error:', error);
  }

  console.log('✨ Tests completed!');
}

testAuth();
