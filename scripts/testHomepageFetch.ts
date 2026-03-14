/**
 * Test script to verify homepage can fetch products
 */

async function testHomepageFetch() {
  console.log('Testing homepage product fetch...\n');

  try {
    // Test 1: Direct API call
    console.log('Test 1: Calling /api/products-supabase directly');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${apiUrl}/api/products-supabase`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Products found:', data.products?.length || 0);
      console.log('First product:', data.products?.[0]?.name || 'N/A');
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testHomepageFetch();
