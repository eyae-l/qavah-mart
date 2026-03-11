/**
 * Property-Based Tests for Shopping Cart Calculations
 * Requirements: Shopping Cart Feature - Properties 7, 8, 10, 17
 * 
 * Tests mathematical properties of cart calculations including
 * line totals, subtotals, and currency formatting.
 */

import * as fc from 'fast-check';

// Mock product and cart item for calculations
interface TestProduct {
  id: string;
  price: number;
}

interface TestCartItem {
  productId: string;
  quantity: number;
  price: number;
}

class TestCartCalculator {
  calculateLineTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  calculateSubtotal(items: TestCartItem[]): number {
    return items.reduce((sum, item) => {
      return sum + this.calculateLineTotal(item.price, item.quantity);
    }, 0);
  }

  calculateTotal(subtotal: number, tax: number = 0, shipping: number = 0): number {
    return subtotal + tax + shipping;
  }

  formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  recalculateTotals(items: TestCartItem[]): {
    subtotal: number;
    total: number;
    lineTotals: Map<string, number>;
  } {
    const lineTotals = new Map<string, number>();
    
    items.forEach(item => {
      lineTotals.set(
        item.productId,
        this.calculateLineTotal(item.price, item.quantity)
      );
    });
    
    const subtotal = this.calculateSubtotal(items);
    const total = this.calculateTotal(subtotal);
    
    return { subtotal, total, lineTotals };
  }
}

// Generators
const priceArb = fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true });
const quantityArb = fc.integer({ min: 1, max: 99 });
const productIdArb = fc.string({ minLength: 1, maxLength: 20 });

const cartItemArb = fc.record({
  productId: productIdArb,
  quantity: quantityArb,
  price: priceArb,
});

describe('Cart Calculations Properties', () => {
  const calculator = new TestCartCalculator();

  // Feature: shopping-cart, Property 7: Line item subtotal calculation
  test('Property 7: Line item subtotal equals price × quantity', () => {
    fc.assert(
      fc.property(priceArb, quantityArb, (price, quantity) => {
        const lineTotal = calculator.calculateLineTotal(price, quantity);
        const expected = price * quantity;
        
        // Use toBeCloseTo for floating point comparison
        expect(lineTotal).toBeCloseTo(expected, 2);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 8: Cart subtotal and total calculation
  test('Property 8: Cart subtotal equals sum of all line totals', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 1, maxLength: 10 }),
        (items) => {
          const subtotal = calculator.calculateSubtotal(items);
          
          // Calculate expected subtotal manually
          const expectedSubtotal = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
          }, 0);
          
          expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 8: Cart total equals subtotal (no taxes/fees)
  test('Property 8: Cart total equals subtotal when no taxes or fees', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 1, maxLength: 10 }),
        (items) => {
          const subtotal = calculator.calculateSubtotal(items);
          const total = calculator.calculateTotal(subtotal);
          
          expect(total).toBeCloseTo(subtotal, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 10: Totals recalculate after cart changes
  test('Property 10: Adding item recalculates all totals correctly', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 0, maxLength: 5 }),
        cartItemArb,
        (initialItems, newItem) => {
          // Calculate initial totals
          const initialTotals = calculator.recalculateTotals(initialItems);
          
          // Add new item
          const updatedItems = [...initialItems, newItem];
          const updatedTotals = calculator.recalculateTotals(updatedItems);
          
          // New subtotal should equal old subtotal + new item line total
          const newItemLineTotal = calculator.calculateLineTotal(
            newItem.price,
            newItem.quantity
          );
          
          expect(updatedTotals.subtotal).toBeCloseTo(
            initialTotals.subtotal + newItemLineTotal,
            2
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 10: Removing item recalculates totals
  test('Property 10: Removing item recalculates all totals correctly', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (items, removeIndex) => {
          if (removeIndex >= items.length) return;
          
          // Calculate initial totals
          const initialTotals = calculator.recalculateTotals(items);
          
          // Remove item
          const removedItem = items[removeIndex];
          const updatedItems = items.filter((_, i) => i !== removeIndex);
          const updatedTotals = calculator.recalculateTotals(updatedItems);
          
          // New subtotal should equal old subtotal - removed item line total
          const removedItemLineTotal = calculator.calculateLineTotal(
            removedItem.price,
            removedItem.quantity
          );
          
          expect(updatedTotals.subtotal).toBeCloseTo(
            initialTotals.subtotal - removedItemLineTotal,
            2
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property 17: Currency formatting consistency
  test('Property 17: All monetary values formatted with 2 decimal places', () => {
    fc.assert(
      fc.property(priceArb, (amount) => {
        const formatted = calculator.formatCurrency(amount);
        
        // Should have exactly 2 decimal places
        expect(formatted).toMatch(/^\d+\.\d{2}$/);
        
        // Should round-trip correctly
        const parsed = parseFloat(formatted);
        expect(parsed).toBeCloseTo(amount, 2);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Subtotal is always non-negative
  test('Property: Cart subtotal is always non-negative', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 0, maxLength: 10 }),
        (items) => {
          const subtotal = calculator.calculateSubtotal(items);
          expect(subtotal).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Empty cart has zero totals
  test('Property: Empty cart has zero subtotal and total', () => {
    const subtotal = calculator.calculateSubtotal([]);
    const total = calculator.calculateTotal(subtotal);
    
    expect(subtotal).toBe(0);
    expect(total).toBe(0);
  });

  // Feature: shopping-cart, Property: Line total increases with quantity
  test('Property: Line total increases monotonically with quantity', () => {
    fc.assert(
      fc.property(
        priceArb,
        quantityArb,
        quantityArb,
        (price, qty1, qty2) => {
          const lineTotal1 = calculator.calculateLineTotal(price, qty1);
          const lineTotal2 = calculator.calculateLineTotal(price, qty2);
          
          if (qty1 < qty2) {
            expect(lineTotal1).toBeLessThan(lineTotal2);
          } else if (qty1 > qty2) {
            expect(lineTotal1).toBeGreaterThan(lineTotal2);
          } else {
            expect(lineTotal1).toBeCloseTo(lineTotal2, 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Subtotal is commutative (order doesn't matter)
  test('Property: Cart subtotal is independent of item order', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 2, maxLength: 10 }),
        (items) => {
          const subtotal1 = calculator.calculateSubtotal(items);
          
          // Reverse the order
          const reversedItems = [...items].reverse();
          const subtotal2 = calculator.calculateSubtotal(reversedItems);
          
          expect(subtotal1).toBeCloseTo(subtotal2, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Doubling all quantities doubles subtotal
  test('Property: Doubling all quantities doubles the subtotal', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 1, maxLength: 10 }),
        (items) => {
          const originalSubtotal = calculator.calculateSubtotal(items);
          
          // Double all quantities
          const doubledItems = items.map(item => ({
            ...item,
            quantity: item.quantity * 2,
          }));
          const doubledSubtotal = calculator.calculateSubtotal(doubledItems);
          
          expect(doubledSubtotal).toBeCloseTo(originalSubtotal * 2, 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: shopping-cart, Property: Combining identical items equals single item with summed quantity
  test('Property: Combining identical items produces correct total', () => {
    fc.assert(
      fc.property(
        productIdArb,
        priceArb,
        quantityArb,
        quantityArb,
        (productId, price, qty1, qty2) => {
          // Two separate items
          const items = [
            { productId, price, quantity: qty1 },
            { productId, price, quantity: qty2 },
          ];
          const subtotal1 = calculator.calculateSubtotal(items);
          
          // Single combined item
          const combinedItems = [
            { productId, price, quantity: qty1 + qty2 },
          ];
          const subtotal2 = calculator.calculateSubtotal(combinedItems);
          
          expect(subtotal1).toBeCloseTo(subtotal2, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
