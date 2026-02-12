/**
 * Comprehensive API Test Script
 * Tests all backend endpoints
 * Run with: npx ts-node scripts/testAllAPIs.ts
 */

const baseUrl = 'http://localhost:3000';
let authToken = '';
let userId = '';
let productId = '';
let reviewId = '';

async function testAuth() {
  console.log('\n🔐 === AUTHENTICATION TESTS ===\n');

  // Test 1: Register
  console.log('1️⃣ Testing Registration...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
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

    const registerData = await registerResponse.json();
    authToken = registerData.token;
    userId = registerData.user.id;
    console.log('✅ Register Success:', {
      userId: registerData.user.id,
      email: registerData.user.email,
      hasToken: !!registerData.token,
    });
  } catch (error) {
    console.error('❌ Register Error:', error);
  }

  // Test 2: Login
  console.log('\n2️⃣ Testing Login...');
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
    console.log('✅ Login Success:', {
      userId: loginData.user?.id,
      email: loginData.user?.email,
      hasToken: !!loginData.token,
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
  }
}

async function testProducts() {
  console.log('\n📦 === PRODUCT TESTS ===\n');

  // Test 1: Create Product
  console.log('1️⃣ Testing Create Product...');
  try {
    const createResponse = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Test Laptop - Dell XPS 15',
        description: 'High-performance laptop for developers',
        price: 45000,
        category: 'Laptops',
        subcategory: 'Gaming Laptops',
        condition: 'New',
        images: ['https://example.com/laptop.jpg'],
        specifications: {
          processor: 'Intel i7',
          ram: '16GB',
          storage: '512GB SSD',
        },
        city: 'Addis Ababa',
        region: 'Addis Ababa',
      }),
    });

    const createData = await createResponse.json();
    productId = createData.id;
    console.log('✅ Create Product Success:', {
      productId: createData.id,
      title: createData.title,
      price: createData.price,
    });
  } catch (error) {
    console.error('❌ Create Product Error:', error);
  }

  // Test 2: Get All Products
  console.log('\n2️⃣ Testing Get All Products...');
  try {
    const getResponse = await fetch(`${baseUrl}/api/products?limit=5`);
    const getData = await getResponse.json();
    console.log('✅ Get Products Success:', {
      count: getData.products?.length,
      total: getData.pagination?.total,
    });
  } catch (error) {
    console.error('❌ Get Products Error:', error);
  }

  // Test 3: Get Single Product
  console.log('\n3️⃣ Testing Get Single Product...');
  try {
    const getOneResponse = await fetch(`${baseUrl}/api/products/${productId}`);
    const getOneData = await getOneResponse.json();
    console.log('✅ Get Single Product Success:', {
      productId: getOneData.id,
      title: getOneData.title,
      reviewCount: getOneData.reviewCount,
    });
  } catch (error) {
    console.error('❌ Get Single Product Error:', error);
  }

  // Test 4: Update Product
  console.log('\n4️⃣ Testing Update Product...');
  try {
    const updateResponse = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        price: 42000,
        description: 'Updated description - Price reduced!',
      }),
    });

    const updateData = await updateResponse.json();
    console.log('✅ Update Product Success:', {
      productId: updateData.id,
      newPrice: updateData.price,
    });
  } catch (error) {
    console.error('❌ Update Product Error:', error);
  }

  // Test 5: Search Products
  console.log('\n5️⃣ Testing Search Products...');
  try {
    const searchResponse = await fetch(`${baseUrl}/api/products?search=laptop&minPrice=30000&maxPrice=50000`);
    const searchData = await searchResponse.json();
    console.log('✅ Search Products Success:', {
      count: searchData.products?.length,
      total: searchData.pagination?.total,
    });
  } catch (error) {
    console.error('❌ Search Products Error:', error);
  }
}

async function testReviews() {
  console.log('\n⭐ === REVIEW TESTS ===\n');

  // Test 1: Create Review
  console.log('1️⃣ Testing Create Review...');
  try {
    const createResponse = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        productId,
        rating: 5,
        comment: 'Excellent product! Highly recommended.',
      }),
    });

    const createData = await createResponse.json();
    reviewId = createData.id;
    console.log('✅ Create Review Success:', {
      reviewId: createData.id,
      rating: createData.rating,
    });
  } catch (error) {
    console.error('❌ Create Review Error:', error);
  }

  // Test 2: Get Reviews
  console.log('\n2️⃣ Testing Get Reviews...');
  try {
    const getResponse = await fetch(`${baseUrl}/api/reviews?productId=${productId}`);
    const getData = await getResponse.json();
    console.log('✅ Get Reviews Success:', {
      count: getData.reviews?.length,
    });
  } catch (error) {
    console.error('❌ Get Reviews Error:', error);
  }

  // Test 3: Update Review
  console.log('\n3️⃣ Testing Update Review...');
  try {
    const updateResponse = await fetch(`${baseUrl}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        rating: 4,
        comment: 'Good product, but a bit expensive.',
      }),
    });

    const updateData = await updateResponse.json();
    console.log('✅ Update Review Success:', {
      reviewId: updateData.id,
      newRating: updateData.rating,
    });
  } catch (error) {
    console.error('❌ Update Review Error:', error);
  }
}

async function testUsers() {
  console.log('\n👤 === USER PROFILE TESTS ===\n');

  // Test 1: Get User Profile
  console.log('1️⃣ Testing Get User Profile...');
  try {
    const getResponse = await fetch(`${baseUrl}/api/users/${userId}`);
    const getData = await getResponse.json();
    console.log('✅ Get User Profile Success:', {
      userId: getData.id,
      name: `${getData.firstName} ${getData.lastName}`,
      isSeller: getData.isSeller,
      productsCount: getData.seller?.products?.length || 0,
    });
  } catch (error) {
    console.error('❌ Get User Profile Error:', error);
  }

  // Test 2: Update User Profile
  console.log('\n2️⃣ Testing Update User Profile...');
  try {
    const updateResponse = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        phone: '+251922334455',
        city: 'Bahir Dar',
      }),
    });

    const updateData = await updateResponse.json();
    console.log('✅ Update User Profile Success:', {
      userId: updateData.id,
      newPhone: updateData.phone,
      newCity: updateData.city,
    });
  } catch (error) {
    console.error('❌ Update User Profile Error:', error);
  }
}

async function cleanup() {
  console.log('\n🧹 === CLEANUP ===\n');

  // Delete Review
  console.log('1️⃣ Deleting Review...');
  try {
    await fetch(`${baseUrl}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    console.log('✅ Review Deleted');
  } catch (error) {
    console.error('❌ Delete Review Error:', error);
  }

  // Delete Product
  console.log('2️⃣ Deleting Product...');
  try {
    await fetch(`${baseUrl}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    console.log('✅ Product Deleted');
  } catch (error) {
    console.error('❌ Delete Product Error:', error);
  }
}

async function runAllTests() {
  console.log('🧪 === QAVAH-MART API TEST SUITE ===');
  console.log('Testing all backend endpoints...\n');

  await testAuth();
  await testProducts();
  await testReviews();
  await testUsers();
  await cleanup();

  console.log('\n✨ === ALL TESTS COMPLETED ===\n');
}

runAllTests();
