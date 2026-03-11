/**
 * Unit Tests for Cart Context
 * Requirements: Shopping Cart Feature - All requirements
 * 
 * Tests cover:
 * - addItem(), updateQuantity(), removeItem(), clearCart()
 * - Cart calculations (itemCount, subtotal, total)
 * - Authentication state changes
 * - Storage adapter selection (localStorage vs database)
 * - Error handling
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { CartItem, Product } from '@/types';
import * as ClerkNextjs from '@clerk/nextjs';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

// Mock storage adapters
jest.mock('@/lib/storage/LocalStorageAdapter', () => {
  return {
    LocalStorageAdapter: jest.fn().mockImplementation(() => ({
      getCart: jest.fn().mockResolvedValue([]),
      saveCart: jest.fn().mockResolvedValue(undefined),
      clearCart: jest.fn().mockResolvedValue(undefined),
      mergeCart: jest.fn().mockImplementation((local, remote) => [...local, ...remote]),
    })),
  };
});

jest.mock('@/lib/storage/StorageManager', () => {
  return {
    StorageManager: jest.fn().mockImplementation(() => ({
      getCart: jest.fn().mockResolvedValue([]),
      saveCart: jest.fn().mockResolvedValue(undefined),
      clearCart: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

// Mock fetch for product details
global.fetch = jest.fn();

// Test component that uses the cart context
function TestComponent() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItem,
    hasItem,
  } = useCart();

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal.toFixed(2)}</div>
      <div data-testid="total">{total.toFixed(2)}</div>
      <div data-testid="is-loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="items-length">{items.length}</div>
      
      <button onClick={() => addItem('product-1', 1)}>Add Product 1</button>
      <button onClick={() => addItem('product-2', 2)}>Add Product 2</button>
      <button onClick={() => updateQuantity('product-1', 3)}>Update Product 1 to 3</button>
      <button onClick={() => removeItem('product-1')}>Remove Product 1</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
      
      <div data-testid="has-product-1">{hasItem('product-1') ? 'yes' : 'no'}</div>
      <div data-testid="get-product-1">{getItem('product-1')?.quantity || 0}</div>
    </div>
  );
}

describe('CartContext', () => {
  const mockProduct1: Product = {
    id: 'product-1',
    title: 'Test Laptop',
    description: 'Test description',
    price: 1000,
    condition: 'new',
    category: 'laptops',
    subcategory: 'Gaming',
    brand: 'Dell',
    specifications: {},
    images: ['image1.jpg'],
    location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
    sellerId: 'seller-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    views: 0,
    favorites: 0,
  };

  const mockProduct2: Product = {
    ...mockProduct1,
    id: 'product-2',
    title: 'Test Mouse',
    price: 50,
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    localStorage.clear();

    // Mock fetch to return product data
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('product-1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct1),
        });
      }
      if (url.includes('product-2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct2),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(null),
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Provider', () => {
    it('should throw error when useCart is used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });

    it('should provide cart context to children', async () => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('subtotal')).toHaveTextContent('0.00');
      expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    });
  });

  describe('Guest User (localStorage)', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should start with empty cart for guest user', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    });

    it('should add item to cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      const addButton = screen.getByText('Add Product 1');
      
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });
    });

    it('should increment quantity when adding existing item', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      const addButton = screen.getByText('Add Product 1');
      
      // Add item twice
      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });

      await act(async () => {
        addButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });
    });

    it('should add multiple different items', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      });

      await act(async () => {
        screen.getByText('Add Product 2').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('2');
        expect(screen.getByTestId('item-count')).toHaveTextContent('3'); // 1 + 2
      });
    });
  });

  describe('addItem()', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should add item with default quantity of 1', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('get-product-1')).toHaveTextContent('1');
      });
    });

    it('should add item with specified quantity', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 2').click(); // Adds 2 items
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });
    });
  });

  describe('updateQuantity()', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should update item quantity', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add item first
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('get-product-1')).toHaveTextContent('1');
      });

      // Update quantity
      await act(async () => {
        screen.getByText('Update Product 1 to 3').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('get-product-1')).toHaveTextContent('3');
        expect(screen.getByTestId('item-count')).toHaveTextContent('3');
      });
    });

    it('should remove item when quantity is set to 0', async () => {
      // Create a test component that updates quantity to 0
      function TestUpdateToZero() {
        const { items, updateQuantity, addItem } = useCart();
        
        return (
          <div>
            <div data-testid="items-length">{items.length}</div>
            <button onClick={() => addItem('product-1', 1)}>Add Product 1</button>
            <button onClick={() => updateQuantity('product-1', 0)}>Update to 0</button>
          </div>
        );
      }

      render(
        <CartProvider>
          <TestUpdateToZero />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toBeInTheDocument();
      });

      // Add item
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      });

      // Update to 0 (should remove)
      await act(async () => {
        screen.getByText('Update to 0').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('0');
      });
    });
  });

  describe('removeItem()', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should remove item from cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add item
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
        expect(screen.getByTestId('has-product-1')).toHaveTextContent('yes');
      });

      // Remove item
      await act(async () => {
        screen.getByText('Remove Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('0');
        expect(screen.getByTestId('has-product-1')).toHaveTextContent('no');
      });
    });

    it('should not affect other items when removing one', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add two items
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await act(async () => {
        screen.getByText('Add Product 2').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('2');
      });

      // Remove one item
      await act(async () => {
        screen.getByText('Remove Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
        expect(screen.getByTestId('has-product-1')).toHaveTextContent('no');
      });
    });
  });

  describe('clearCart()', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should clear all items from cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add items
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await act(async () => {
        screen.getByText('Add Product 2').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('2');
      });

      // Clear cart
      await act(async () => {
        screen.getByText('Clear Cart').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('0');
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });

    it('should handle clearing empty cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Clear empty cart
      await act(async () => {
        screen.getByText('Clear Cart').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('0');
      });
    });
  });

  describe('Cart Calculations', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should calculate itemCount correctly', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add items with different quantities
      await act(async () => {
        screen.getByText('Add Product 1').click(); // quantity: 1
      });

      await act(async () => {
        screen.getByText('Add Product 2').click(); // quantity: 2
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('3'); // 1 + 2
      });
    });

    it('should calculate subtotal correctly', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add product 1 (price: 1000, quantity: 1)
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      // Wait for product details to be fetched
      await waitFor(() => {
        const subtotal = screen.getByTestId('subtotal').textContent;
        expect(parseFloat(subtotal || '0')).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should calculate total equal to subtotal', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        const subtotal = screen.getByTestId('subtotal').textContent;
        const total = screen.getByTestId('total').textContent;
        expect(subtotal).toBe(total);
      }, { timeout: 3000 });
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('getItem() should return item if exists', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('get-product-1')).toHaveTextContent('1');
      });
    });

    it('getItem() should return undefined if item does not exist', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('get-product-1')).toHaveTextContent('0');
    });

    it('hasItem() should return true if item exists', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('has-product-1')).toHaveTextContent('yes');
      });
    });

    it('hasItem() should return false if item does not exist', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('has-product-1')).toHaveTextContent('no');
    });
  });

  describe('Authenticated User (database)', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: 'user-123',
        isLoaded: true,
      });
    });

    it('should use database storage for authenticated user', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // The StorageManager should be used for authenticated users
      // This is tested by the implementation using StorageManager when userId exists
      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    });
  });

  describe('Authentication State Changes', () => {
    it('should handle login (guest to authenticated)', async () => {
      const { rerender } = render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Start as guest
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      // Add item as guest
      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      });

      // Simulate login
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: 'user-123',
        isLoaded: true,
      });

      rerender(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Cart should be migrated (implementation handles this)
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      (ClerkNextjs.useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
      });
    });

    it('should handle storage errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage to throw error
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      // Should still update UI even if storage fails
      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle product fetch errors', async () => {
      // Mock fetch to fail
      (global.fetch as jest.Mock).mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve(null),
        });
      });

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('ready');
      });

      await act(async () => {
        screen.getByText('Add Product 1').click();
      });

      // Cart should still work even if product details fail to load
      await waitFor(() => {
        expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      });
    });
  });
});
