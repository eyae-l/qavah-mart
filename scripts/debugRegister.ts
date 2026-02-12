/**
 * Debug Registration Endpoint
 */

const baseUrl = 'http://localhost:3000';

async function testRegister() {
  console.log('Testing Registration...\n');
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+251911234567',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
      }),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('\nRaw Response:');
    console.log(text);
    
    try {
      const data = JSON.parse(text);
      console.log('\nParsed JSON:');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('\nFailed to parse as JSON');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister();
