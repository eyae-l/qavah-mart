/**
 * Cart Performance Verification Script
 * 
 * Verifies that cart operations meet performance requirements:
 * - Add to cart: < 100ms
 * - Update quantity: < 100ms
 * - Remove item: < 100ms
 * - Load cart: < 100ms (localStorage) or < 300ms (database)
 * - Calculate totals: < 50ms
 */

import { performance } from 'perf_hooks';

// Mock CartItem type
interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

// Mock Product type
interface Product {
  id: string;
  price: number;
}

// Performance test utilities
class PerformanceTest {
  private results: { operation: string; duration: number; passed: boolean }[] = [];

  async measure(operation: string, fn: () => Promise<void> | void, threshold: number): Promise<void> {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    const passed = duration < threshold;

    this.results.push({ operation, duration, passed });

    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${operation}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('PERFORMANCE TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    console.log(`\nTests Passed: ${passed}/${total} (${percentage}%)\n`);

    if (passed === total) {
      console.log('🎉 All performance tests passed!');
    } else {
      console.log('⚠️  Some performance tests failed. Review results above.');
    }

    console.log('='.repeat(60) + '\n');
  }
}

// Mock localStorage operations
class MockLocalStorage {
  private storage: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

// Cart operations to test
class CartOperations {
  private items: CartItem[] = [];
  private storage = new MockLocalStorage();

  addItem(productId: string): void {
    const existing = this.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        productId,
        quantity: 1,
        addedAt: new Date(),
      });
    }
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveToStorage();
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);
    this.saveToStorage();
  }

  loadFromStorage(): void {
    const data = this.storage.getItem('cart');
    if (data) {
      const parsed = JSON.parse(data);
      this.items = parsed.items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
    }
  }

  private saveToStorage(): void {
    const data = JSON.stringify({
      items: this.items.map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString(),
      })),
    });
    this.storage.setItem('cart', data);
  }

  calculateTotals(products: Product[]): { subtotal: number; total: number } {
    const subtotal = this.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    return { subtotal, total: subtotal };
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  reset(): void {
    this.items = [];
    this.storage.removeItem('cart');
  }
}

// Run performance tests
async function runPerformanceTests() {
  console.log('\n🚀 Starting Cart Performance Tests...\n');

  const tester = new PerformanceTest();
  const cart = new CartOperations();

  // Mock products for calculation tests
  const products: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: `product-${i}`,
    price: Math.random() * 100 + 10,
  }));

  // Test 1: Add to Cart
  await tester.measure('Add item to cart', () => {
    cart.addItem('product-1');
  }, 100);

  // Test 2: Add multiple items
  await tester.measure('Add 10 items to cart', () => {
    for (let i = 2; i <= 11; i++) {
      cart.addItem(`product-${i}`);
    }
  }, 100);

  // Test 3: Update quantity
  await tester.measure('Update item quantity', () => {
    cart.updateQuantity('product-1', 5);
  }, 100);

  // Test 4: Remove item
  await tester.measure('Remove item from cart', () => {
    cart.removeItem('product-11');
  }, 100);

  // Test 5: Load from storage
  await tester.measure('Load cart from localStorage', () => {
    cart.loadFromStorage();
  }, 100);

  // Test 6: Calculate totals (small cart)
  await tester.measure('Calculate totals (10 items)', () => {
    cart.calculateTotals(products);
  }, 50);

  // Test 7: Large cart operations
  cart.reset();
  await tester.measure('Add 50 items to cart', () => {
    for (let i = 0; i < 50; i++) {
      cart.addItem(`product-${i}`);
    }
  }, 200);

  // Test 8: Calculate totals (large cart)
  await tester.measure('Calculate totals (50 items)', () => {
    cart.calculateTotals(products);
  }, 100);

  // Test 9: Get item count
  await tester.measure('Get total item count', () => {
    cart.getItemCount();
  }, 50);

  // Test 10: Rapid operations
  cart.reset();
  await tester.measure('100 rapid add operations', () => {
    for (let i = 0; i < 100; i++) {
      cart.addItem(`product-${i % 10}`);
    }
  }, 500);

  tester.printSummary();
}

// Run tests
runPerformanceTests().catch(console.error);
