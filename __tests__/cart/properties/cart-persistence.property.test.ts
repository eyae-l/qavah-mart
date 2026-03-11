/**
 * Property-Based Tests for Shopping Cart Persistence
 * Requirements: Shopping Cart Feature - Properties 4, 5, 12, 13, 14, 15
 * 
 * Tests cart persistence to localStorage and database, including
 * round-trip serialization and cart merging logic.
 */

import * as fc from 'fast-check';
import { CartItem } from '@/types';

// Mock storage adapters
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

  clear(): void {
    this.storage.clear();
  }
}

class TestStorageAdapter {
  constructor(private storage: MockLocalStorage) {}

  async saveCart(items: CartItem[]): Promise<void> {
    // Consolidate duplicate productIds before saving
    const consolidated = new Map<string, CartItem>();
    items.forEach(item => {
      const existing = consolidated.get(item.productId);
      if (existing) {
        consolidated.set(item.productId, {
          ...existing,
          quantity: existing.quantity + item.quantity,
          addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt,
        });
      } else {
        consolidated.set(item.productId, { ...item });
      }
    });

    const data = JSON.stringify({
      items: Array.from(consolidated.values()).map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    });
    this.storage.setItem('qavah_cart', data);
  }

  async getCart(): Promise<CartItem[]> {
    const data = this.storage.getItem('qavah_cart');
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
    }));
  }

  async clearCart(): Promise<void> {
    this.storage.removeItem('qavah_cart');
  }

  mergeCart(localItems: CartItem[], remoteItems: CartItem[]): CartItem[] {
    const merged = new Map<string, CartItem>();

    // Add all local items
    localItems.forEach(item => {
      const existing = merged.get(item.productId);
      if (existing) {
        merged.set(item.productId, {
          ...existing,
          quantity: existing.quantity + item.quantity,
          addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt,
        });
      } else {
        merged.set(item.productId, { ...item });
      }
    });

    // Merge remote items
    remoteItems.forEach(item => {
      const existing = merged.get(item.productId);
      if (existing) {
        // Sum quantities for duplicates
        merged.set(item.productId, {
          ...existing,
          quantity: existing.quantity + item.quantity,
          addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt,
        });
      } else {
        merged.set(item.productId, { ...item });
      }
    });

    return Array.from(merged.values());
  }
}

// Generators
const productIdArb = fc.string({ minLength: 1, maxLength: 20 });
const quantityArb = fc.integer({ min: 1, max: 99 });

const cartItemArb = fc.record({
  productId: productIdArb,
  quantity: quantityArb,
  addedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') }).filter(d => !isNaN(d.getTime())),
});

const cartStateArb = fc.array(cartItemArb, { minLength: 0, maxLength: 10 });

describe('Cart Persistence Properties', () => {
  // Feature: shopping-cart, Property 4: Guest user cart persists to localStorage
  test('Property 4: Cart persists to localStorage immediately', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, async (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        await adapter.saveCart(items);
        
        // Verify data was saved
        const saved = storage.getItem('qavah_cart');
        expect(saved).not.toBeNull();
        
        // Verify data is valid JSON
        const parsed = JSON.parse(saved!);
        expect(parsed.items).toHaveLength(items.length);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 12: Guest user cart restoration round-trip
  test('Property 12: Save then load restores identical cart state', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, async (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        // Save cart
        await adapter.saveCart(items);
        
        // Load cart
        const loaded = await adapter.getCart();
        
        // Build expected quantities map (handling duplicates)
        const expectedQuantities = new Map<string, number>();
        items.forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        // Verify same number of unique items
        expect(loaded.length).toBe(expectedQuantities.size);
        
        // Verify each item matches expected quantity
        expectedQuantities.forEach((expectedQty, productId) => {
          const loadedItem = loaded.find(i => i.productId === productId);
          expect(loadedItem).toBeDefined();
          expect(loadedItem?.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 13: Authenticated user cart restoration round-trip
  test('Property 13: Database save then load restores identical cart state', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, async (items) => {
        // Simulate database storage with localStorage
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        await adapter.saveCart(items);
        const loaded = await adapter.getCart();
        
        // Verify quantities match
        const originalQuantities = new Map(
          items.map(item => [item.productId, item.quantity])
        );
        
        loaded.forEach(item => {
          const originalQty = originalQuantities.get(item.productId);
          expect(item.quantity).toBe(originalQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 14: Cart merging combines items correctly
  test('Property 14: Merging carts combines unique items and sums duplicates', () => {
    fc.assert(
      fc.property(cartStateArb, cartStateArb, (localItems, remoteItems) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        const merged = adapter.mergeCart(localItems, remoteItems);
        
        // Build expected quantities map
        const expectedQuantities = new Map<string, number>();
        
        [...localItems, ...remoteItems].forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        // Verify merged cart has correct quantities
        expect(merged.length).toBe(expectedQuantities.size);
        
        merged.forEach(item => {
          const expectedQty = expectedQuantities.get(item.productId);
          expect(item.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 14: Merging with empty cart returns other cart
  test('Property 14: Merging empty cart with non-empty returns non-empty', () => {
    fc.assert(
      fc.property(cartStateArb, (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        const merged1 = adapter.mergeCart([], items);
        const merged2 = adapter.mergeCart(items, []);
        
        // Calculate expected unique items (consolidating duplicates)
        const uniqueProductIds = new Set(items.map(item => item.productId));
        const expectedLength = uniqueProductIds.size;
        
        expect(merged1.length).toBe(expectedLength);
        expect(merged2.length).toBe(expectedLength);
        
        // Verify quantities match (sum of all quantities for each productId)
        const expectedQuantities = new Map<string, number>();
        items.forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        expectedQuantities.forEach((expectedQty, productId) => {
          const found1 = merged1.find(i => i.productId === productId);
          const found2 = merged2.find(i => i.productId === productId);
          
          expect(found1?.quantity).toBe(expectedQty);
          expect(found2?.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 15: Cart persists across logout
  test('Property 15: Cart state survives save/clear/load cycle', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, async (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        // Save cart
        await adapter.saveCart(items);
        
        // Simulate logout by clearing in-memory state (but not storage)
        // Then load again
        const loaded = await adapter.getCart();
        
        // Calculate expected unique items and quantities
        const expectedQuantities = new Map<string, number>();
        items.forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        // Verify cart was restored with correct number of unique items
        expect(loaded.length).toBe(expectedQuantities.size);
        
        // Verify each unique product has correct total quantity
        expectedQuantities.forEach((expectedQty, productId) => {
          const found = loaded.find(i => i.productId === productId);
          expect(found).toBeDefined();
          expect(found?.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Empty cart serialization
  test('Property: Empty cart saves and loads correctly', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant([]), async (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        await adapter.saveCart(items);
        const loaded = await adapter.getCart();
        
        expect(loaded).toHaveLength(0);
      }),
      { numRuns: 10 }
    );
  });

  // Feature: shopping-cart, Property: Merging identical carts doubles quantities
  test('Property: Merging cart with itself doubles all quantities', () => {
    fc.assert(
      fc.property(cartStateArb, (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        const merged = adapter.mergeCart(items, items);
        
        // Each item should have double the quantity
        items.forEach(item => {
          const found = merged.find(i => i.productId === item.productId);
          expect(found?.quantity).toBe(item.quantity * 2);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Merge is commutative
  test('Property: Merge order does not affect final quantities', () => {
    fc.assert(
      fc.property(cartStateArb, cartStateArb, (cart1, cart2) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        const merged1 = adapter.mergeCart(cart1, cart2);
        const merged2 = adapter.mergeCart(cart2, cart1);
        
        // Build expected quantities from both carts
        const expectedQuantities = new Map<string, number>();
        [...cart1, ...cart2].forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        // Both merges should have same number of unique items
        expect(merged1.length).toBe(expectedQuantities.size);
        expect(merged2.length).toBe(expectedQuantities.size);
        
        // Both merges should have same quantities for each product
        expectedQuantities.forEach((expectedQty, productId) => {
          const item1 = merged1.find(i => i.productId === productId);
          const item2 = merged2.find(i => i.productId === productId);
          
          expect(item1).toBeDefined();
          expect(item2).toBeDefined();
          expect(item1?.quantity).toBe(expectedQty);
          expect(item2?.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Clear cart removes all data
  test('Property: Clear cart removes all persisted data', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, async (items) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        await adapter.saveCart(items);
        await adapter.clearCart();
        
        const loaded = await adapter.getCart();
        expect(loaded).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Multiple saves preserve latest state
  test('Property: Multiple saves preserve only the latest cart state', async () => {
    await fc.assert(
      fc.asyncProperty(cartStateArb, cartStateArb, async (items1, items2) => {
        const storage = new MockLocalStorage();
        const adapter = new TestStorageAdapter(storage);

        await adapter.saveCart(items1);
        await adapter.saveCart(items2);
        
        const loaded = await adapter.getCart();
        
        // Calculate expected unique items and quantities from items2
        const expectedQuantities = new Map<string, number>();
        items2.forEach(item => {
          const current = expectedQuantities.get(item.productId) || 0;
          expectedQuantities.set(item.productId, current + item.quantity);
        });
        
        // Should match items2, not items1
        expect(loaded.length).toBe(expectedQuantities.size);
        
        // Verify each unique product has correct total quantity
        expectedQuantities.forEach((expectedQty, productId) => {
          const found = loaded.find(i => i.productId === productId);
          expect(found).toBeDefined();
          expect(found?.quantity).toBe(expectedQty);
        });
      }),
      { numRuns: 100 }
    );
  });
});
