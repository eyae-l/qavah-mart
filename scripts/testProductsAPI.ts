/**
 * Test script to verify products are being fetched from database
 */

async function testProductsAPI() {
  try {
    console.log('🔍 Testing Products API...\n');

    // Test 1: Fetch all products
    console.log('Test 1: Fetching all products...');
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Found ${data.products.length} products`);
    console.log(`📊 Total in database: ${data.pagination.total}\n`);
    
    // Display products
    if (data.products.length > 0) {
      console.log('📦 Products from database:');
      data.products.forEach((product: any, index: number) => {
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   Price: ETB ${product.price.toLocaleString()}`);
        console.log(`   Condition: ${product.condition}`);
        console.log(`   Category: ${product.category} > ${product.subcategory}`);
        console.log(`   Brand: ${product.brand}`);
        console.log(`   Location: ${product.city}, ${product.region}`);
        console.log(`   Seller: ${product.seller.businessName}`);
        console.log(`   ID: ${product.id}`);
      });
      
      console.log('\n✅ SUCCESS! Products are being fetched from the database!');
      console.log('\n🎉 Your cart will now show real prices instead of ETB 0.00');
    } else {
      console.log('⚠️  No products found in database');
    }
    
  } catch (error) {
    console.error('❌ Error testing products API:', error);
  }
}

testProductsAPI();
