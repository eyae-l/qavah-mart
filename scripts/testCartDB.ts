/**
 * Test script to check if Cart table exists and database is accessible
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCartDB() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');
    
    // Try to query the Cart table
    console.log('\nTesting Cart table...');
    const carts = await prisma.cart.findMany({
      take: 1
    });
    console.log('✓ Cart table exists and is accessible');
    console.log(`  Found ${carts.length} cart(s) in database`);
    
    // Try to create a test cart
    console.log('\nTesting cart creation...');
    const testUserId = 'test_user_' + Date.now();
    const testCart = await prisma.cart.create({
      data: {
        userId: testUserId,
        items: []
      }
    });
    console.log('✓ Successfully created test cart:', testCart.id);
    
    // Clean up test cart
    await prisma.cart.delete({
      where: { id: testCart.id }
    });
    console.log('✓ Successfully deleted test cart');
    
    console.log('\n✅ All tests passed! Database is ready for cart operations.');
    
  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error(error);
    
    if (error instanceof Error) {
      if (error.message.includes('does not exist')) {
        console.error('\n💡 Solution: Run database migrations:');
        console.error('   npx prisma migrate dev');
        console.error('   or');
        console.error('   npx prisma db push');
      } else if (error.message.includes('connect')) {
        console.error('\n💡 Solution: Check your DATABASE_URL in .env file');
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

testCartDB();
