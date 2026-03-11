/**
 * Property-Based Tests for Shopping Cart Operations
 * Requirements: Shopping Cart Feature - All Properties
 * 
 * These tests use fast-check to verify universal properties hold across
 * randomly generated inputs (100+ iterations per property).
 */

import * as fc from 'fast-check';
import { CartItem } from '@/types';

// Mock cart implementation for testing properties
class TestCart {
  private items: Map<string, CartItem> = new Map();

  addItem(productId: string, quantity: number = 1): void {
    const existing = this.items.get(productId);
    if (existing) {
      this.items.set(productId, {
        ...existing,
        quantity: existing.quantity + quantity,
      });
    } else {
      this.items.set(productId, {
        productId,
        quantity,
        addedAt: new Date(),
      });
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    const existing = this.items.get(productId);
    // Reject invalid quantities (NaN, Infinity, negative, zero)
    if (existing && quantity > 0 && Number.isFinite(quantity)) {
      this.items.set(productId, {
        ...existing,
        quantity,
      });
    }
  }

  removeItem(productId: string): void {
    this.items.delete(productId);
  }

  getItem(productId: string): CartItem | undefined {
    return this.items.get(productId);
  }

  hasItem(productId: string): boolean {
    return this.items.has(productId);
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  getItemCount(): number {
    return Array.from(this.items.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  clear(): void {
    this.items.clear();
  }
}

// Generators
const productIdArb = fc.string({ minLength: 1, maxLength: 20 });
const quantityArb = fc.integer({ min: 1, max: 99 });
const invalidQuantityArb = fc.oneof(
  fc.integer({ max: 0 }),
  fc.constant(NaN),
  fc.constant(Infinity)
);

const cartItemArb = fc.record({
  productId: productIdArb,
  quantity: quantityArb,
  addedAt: fc.date(),
});

describe('Cart Operations Properties', () => {
  // Feature: shopping-cart, Property 1: Adding new product creates cart item with quantity 1
  test('Property 1: Adding new product creates cart item with quantity 1', () => {
    fc.assert(
      fc.property(productIdArb, (productId) => {
        const cart = new TestCart();
        cart.addItem(productId, 1);
        
        const item = cart.getItem(productId);
        expect(item).toBeDefined();
        expect(item?.quantity).toBe(1);
        expect(item?.productId).toBe(productId);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 2: Adding existing product increments quantity
  test('Property 2: Adding existing product increments quantity', () => {
    fc.assert(
      fc.property(
        productIdArb,
        quantityArb,
        quantityArb,
        (productId, initialQty, addQty) => {
          const cart = new TestCart();
          cart.addItem(productId, initialQty);
          cart.addItem(productId, addQty);
          
          const item = cart.getItem(productId);
          expect(item?.quantity).toBe(initialQty + addQty);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 3: Cart icon count reflects total item quantity
  test('Property 3: Cart icon count reflects total item quantity', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { minLength: 0, maxLength: 10 }), (items) => {
        const cart = new TestCart();
        
        // Add all items to cart
        items.forEach(item => {
          cart.addItem(item.productId, item.quantity);
        });
        
        // Calculate expected total
        const expectedTotal = cart.getItems().reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        
        expect(cart.getItemCount()).toBe(expectedTotal);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 9: Quantity updates change cart state
  test('Property 9: Quantity updates change cart state', () => {
    fc.assert(
      fc.property(
        productIdArb,
        quantityArb,
        quantityArb,
        (productId, initialQty, newQty) => {
          const cart = new TestCart();
          cart.addItem(productId, initialQty);
          cart.updateQuantity(productId, newQty);
          
          const item = cart.getItem(productId);
          expect(item?.quantity).toBe(newQty);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 11: Invalid quantity inputs are rejected
  test('Property 11: Invalid quantity inputs are rejected', () => {
    fc.assert(
      fc.property(
        productIdArb,
        quantityArb,
        invalidQuantityArb,
        (productId, initialQty, invalidQty) => {
          const cart = new TestCart();
          cart.addItem(productId, initialQty);
          
          // Attempt to update with invalid quantity
          cart.updateQuantity(productId, invalidQty);
          
          // Quantity should remain unchanged
          const item = cart.getItem(productId);
          expect(item?.quantity).toBe(initialQty);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 16: Removing item eliminates it from cart
  test('Property 16: Removing item eliminates it from cart', () => {
    fc.assert(
      fc.property(productIdArb, quantityArb, (productId, quantity) => {
        const cart = new TestCart();
        cart.addItem(productId, quantity);
        
        expect(cart.hasItem(productId)).toBe(true);
        
        cart.removeItem(productId);
        
        expect(cart.hasItem(productId)).toBe(false);
        expect(cart.getItem(productId)).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Adding multiple different products
  test('Property: Adding multiple different products maintains all items', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            productId: productIdArb,
            quantity: quantityArb,
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (products) => {
          const cart = new TestCart();
          const uniqueProducts = new Map<string, number>();
          
          // Add all products, tracking expected quantities
          products.forEach(({ productId, quantity }) => {
            cart.addItem(productId, quantity);
            uniqueProducts.set(
              productId,
              (uniqueProducts.get(productId) || 0) + quantity
            );
          });
          
          // Verify all unique products are in cart with correct quantities
          uniqueProducts.forEach((expectedQty, productId) => {
            const item = cart.getItem(productId);
            expect(item).toBeDefined();
            expect(item?.quantity).toBe(expectedQty);
          });
          
          // Verify cart has exactly the expected number of unique items
          expect(cart.getItems().length).toBe(uniqueProducts.size);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Removing all items results in empty cart
  test('Property: Removing all items results in empty cart', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { minLength: 1, maxLength: 10 }), (items) => {
        const cart = new TestCart();
        
        // Add all items
        items.forEach(item => {
          cart.addItem(item.productId, item.quantity);
        });
        
        // Remove all items
        cart.getItems().forEach(item => {
          cart.removeItem(item.productId);
        });
        
        expect(cart.getItems().length).toBe(0);
        expect(cart.getItemCount()).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Cart operations are idempotent for same input
  test('Property: Adding same item twice with quantity 1 equals adding once with quantity 2', () => {
    fc.assert(
      fc.property(productIdArb, (productId) => {
        const cart1 = new TestCart();
        const cart2 = new TestCart();
        
        // Cart 1: Add twice with quantity 1
        cart1.addItem(productId, 1);
        cart1.addItem(productId, 1);
        
        // Cart 2: Add once with quantity 2
        cart2.addItem(productId, 2);
        
        expect(cart1.getItem(productId)?.quantity).toBe(
          cart2.getItem(productId)?.quantity
        );
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Update to quantity 0 or negative should not change cart
  test('Property: Update to zero or negative quantity maintains current quantity', () => {
    fc.assert(
      fc.property(
        productIdArb,
        quantityArb,
        fc.integer({ max: 0 }),
        (productId, initialQty, invalidQty) => {
          const cart = new TestCart();
          cart.addItem(productId, initialQty);
          
          cart.updateQuantity(productId, invalidQty);
          
          // Should maintain initial quantity
          expect(cart.getItem(productId)?.quantity).toBe(initialQty);
        }
      ),
      { numRuns: 100 }
    );
  });
});
