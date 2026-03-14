/**
 * Debug script to test product detail API
 */

async function debugProductDetail() {
  console.log('Testing product detail API...\n');

  try {
    // First, get all products to see their IDs
    console.log('1. Getting all products to see IDs:');
    const productsResponse = await fetch('http://localhost:3000/api/products-supabase');
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const products = productsData.products || [];
      
      console.log(`Found ${products.length} products:`);
      products.forEach((product: any, index: number) => {
        console.log(`  ${index + 1}. ID: "${product.id}" - Name: "${product.name}"`);
      });
      
      if (products.length > 0) {
        const firstProduct = products[0];
        console.log(`\n2. Testing individual product API with ID: "${firstProduct.id}"`);
        
        const productResponse = await fetch(`http://localhost:3000/api/products-supabase/${firstProduct.id}`);
        console.log('Status:', productResponse.status);
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          console.log('✅ Product API works!');
          console.log('Product name:', productData.product?.name);
        } else {
          const errorText = await productResponse.text();
          console.log('❌ Product API failed:', errorText);
        }
        
        // Test the URL that would be used in the browser
        console.log(`\n3. The product URL would be: /products/${firstProduct.id}`);
        console.log(`   Full URL: http://localhost:3000/products/${firstProduct.id}`);
      }
    } else {
      console.log('Failed to get products:', productsResponse.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugProductDetail();