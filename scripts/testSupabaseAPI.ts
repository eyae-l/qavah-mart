/**
 * Test script to verify products are being fetched via Supabase REST API
 */

async function testSupabaseAPI() {
  try {
    console.log('🔍 Testing Supabase Products API...\n');

    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test: Fetch all products via Supabase
    console.log('Fetching products via Supabase REST API...');
    const response = await fetch('http://localhost:3000/api/products-supabase');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Found ${data.products.length} products`);
    console.log(`📊 Total in database: ${data.pagination.total}\n`);
    
    // Display products
    if (data.products.length > 0) {
      console.log('📦 Products from database (via Supabase REST API):');
      data.products.forEach((product: any, index: number) => {
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   Price: ETB ${product.price.toLocaleString()}`);
        console.log(`   Condition: ${product.condition}`);
        console.log(`   Category: ${product.category} > ${product.subcategory}`);
        console.log(`   Brand: ${product.brand}`);
        console.log(`   Location: ${product.city}, ${product.region}`);
        if (product.seller) {
          console.log(`   Seller: ${product.seller.businessName}`);
        }
        console.log(`   ID: ${product.id}`);
      });
      
      console.log('\n✅ SUCCESS! Products are being fetched from the database via Supabase REST API!');
      console.log('🎉 This means your cart will now show real prices!');
      console.log('\n📝 Next step: Update your app to use /api/products-supabase instead of /api/products');
    } else {
      console.log('⚠️  No products found in database');
      console.log('Make sure you ran the seed script in Supabase SQL Editor');
    }
    
  } catch (error: any) {
    console.error('❌ Error testing Supabase API:', error.message);
  }
}

testSupabaseAPI();
