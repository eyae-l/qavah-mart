/**
 * Debug script to check cart in database
 * Run with: npx tsx scripts/checkCart.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCart() {
  try {
    console.log('Checking carts in database...\n');
    
    // Get all carts
    const carts = await prisma.cart.findMany();
    
    console.log(`Found ${carts.length} cart(s) in database:\n`);
    
    carts.forEach((cart, index) => {
      console.log(`Cart ${index + 1}:`);
      console.log(`  ID: ${cart.id}`);
      console.log(`  User ID: ${cart.userId}`);
      console.log(`  Items: ${JSON.stringify(cart.items, null, 2)}`);
      console.log(`  Created: ${cart.createdAt}`);
      console.log(`  Updated: ${cart.updatedAt}`);
      console.log('');
    });
    
    if (carts.length === 0) {
      console.log('No carts found in database.');
      console.log('This means the cart is not being saved properly.');
    }
    
  } catch (error) {
    console.error('Error checking cart:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCart();
