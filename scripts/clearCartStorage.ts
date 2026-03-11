/**
 * Script to clear cart localStorage
 * Run this in browser console if you need to reset cart data
 */

// Clear cart from localStorage
if (typeof window !== 'undefined') {
  localStorage.removeItem('qavah_cart');
  console.log('Cart localStorage cleared');
}

export {};
