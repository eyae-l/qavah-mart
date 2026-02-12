/**
 * Debug script to see actual API responses
 * Run with: npx ts-node scripts/debugAPI.ts
 */

async function debugAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('🔍 Debugging API Response...\n');

  try {
    console.log('Testing: POST /api/auth/register');
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
    console.log('Content-Type:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('\nRaw Response (first 500 chars):');
    console.log(text.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('\n✅ Valid JSON Response:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('\n❌ Not valid JSON - likely an error page');
      
      // Check if it's an HTML error page
      if (text.includes('<!DOCTYPE')) {
        console.log('\n🔴 Server returned HTML error page');
        
        // Try to extract error message
        const errorMatch = text.match(/<pre[^>]*>(.*?)<\/pre>/s);
        if (errorMatch) {
          console.log('\nError details:');
          console.log(errorMatch[1].substring(0, 1000));
        }
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

debugAPI();
