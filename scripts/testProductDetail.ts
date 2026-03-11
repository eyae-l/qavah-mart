/**
 * Test script to check product detail API
 */

async function testProductDetail() {
  try {
    const productId = 'prod_laptop_002'; // One of your seeded products
    const res = await fetch(`http://localhost:3000/api/products-supabase/${productId}`);
    
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      return;
    }
    
    const data = await res.json();
    console.log('Product data:', JSON.stringify(data, null, 2));
    
    if (data.product) {
      console.log('\n✅ Product found');
      console.log('Title:', data.product.title);
      console.log('Price:', data.product.price);
      console.log('Seller:', data.product.seller);
    } else {
      console.log('\n❌ No product in response');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testProductDetail();
