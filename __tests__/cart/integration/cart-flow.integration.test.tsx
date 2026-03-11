/**
 * Integration Tests for Shopping Cart Feature
 * 
 * Tests complete user flows including:
 * - Guest user shopping flow
 * - Authenticated user shopping flow  
 * - Cart migration on login
 * - Browse → Add to Cart → View Cart → Checkout
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// Mock fetch for API calls
global.fetch = jest.fn();

// Test component to interact with cart
const TestCartComponent = () => {
  const { items, itemCount, addItem, updateQuantity, removeItem, subtotal } = useCart();
  
  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal.toFixed(2)}</div>
      <button onClick={() => addItem('product-1')}>Add Product 1</button>
      <button onClick={() => addItem('product-2')}>Add Product 2</button>
      {items.map(item => (
        <div key={item.productId} data-testid={`item-${item.productId}`}>
          <span data-testid={`quantity-${item.productId}`}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
            Increase {item.productId}
          </button>
          <button onClick={() => removeItem(item.productId)}>
            Remove {item.productId}
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper to wrap components with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      <UserProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
};

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Guest User Flow', () => {
    beforeEach(() => {
      // Mock guest user (not authenticated)
      const { useUser, useAuth } = require('@clerk/nextjs');
      useUser.mockReturnValue({ user: null, isLoaded: true });
      useAuth.mockReturnValue({ userId: null, isLoaded: true });
      
      // Mock product fetches
      (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('/api/products/product-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-1',
              title: 'Product 1',
              price: 10.00,
              imageUrl: '/test1.jpg',
            }),
          });
        }
        if (url.includes('/api/products/product-2')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-2',
              title: 'Product 2',
              price: 15.00,
              imageUrl: '/test2.jpg',
            }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    test('Complete guest shopping flow: add items → update quantity → remove item', async () => {
      const user = userEvent.setup();

      renderWithProviders(<TestCartComponent />);

      // Initially empty cart
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');

      // Step 1: Add first product
      await user.click(screen.getByText('Add Product 1'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });

      // Verify localStorage has the item
      const cartData1 = JSON.parse(localStorage.getItem('qavah_cart') || '{}');
      expect(cartData1.items).toHaveLength(1);
      expect(cartData1.items[0].productId).toBe('product-1');

      // Step 2: Add second product
      await user.click(screen.getByText('Add Product 2'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      // Step 3: Increase quantity of first product
      await user.click(screen.getByText('Increase product-1'));

      await waitFor(() => {
        expect(screen.getByTestId('quantity-product-1')).toHaveTextContent('2');
        expect(screen.getByTestId('item-count')).toHaveTextContent('3'); // 2 + 1
      });

      // Step 4: Remove second product
      await user.click(screen.getByText('Remove product-2'));

      await waitFor(() => {
        expect(screen.queryByTestId('item-product-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      // Verify final localStorage state
      const cartData2 = JSON.parse(localStorage.getItem('qavah_cart') || '{}');
      expect(cartData2.items).toHaveLength(1);
      expect(cartData2.items[0].productId).toBe('product-1');
      expect(cartData2.items[0].quantity).toBe(2);
    });

    test('Guest user can add same product multiple times (increments quantity)', async () => {
      const user = userEvent.setup();

      renderWithProviders(<TestCartComponent />);

      // Add product twice
      await user.click(screen.getByText('Add Product 1'));
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });

      await user.click(screen.getByText('Add Product 1'));
      await waitFor(() => {
        expect(screen.getByTestId('quantity-product-1')).toHaveTextContent('2');
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      // Verify only one item in cart with quantity 2
      const cartData = JSON.parse(localStorage.getItem('qavah_cart') || '{}');
      expect(cartData.items).toHaveLength(1);
      expect(cartData.items[0].quantity).toBe(2);
    });

    test('Guest cart persists across component remounts', async () => {
      const user = userEvent.setup();

      // First render: add items
      const { unmount } = renderWithProviders(<TestCartComponent />);
      
      await user.click(screen.getByText('Add Product 1'));
      await user.click(screen.getByText('Add Product 2'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      unmount();

      // Second render: verify cart restored
      renderWithProviders(<TestCartComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
        expect(screen.getByTestId('item-product-1')).toBeInTheDocument();
        expect(screen.getByTestId('item-product-2')).toBeInTheDocument();
      });
    });

    test('Cart subtotal calculates correctly', async () => {
      const user = userEvent.setup();

      renderWithProviders(<TestCartComponent />);

      // Add product-1 (price: 10.00)
      await user.click(screen.getByText('Add Product 1'));
      
      await waitFor(() => {
        expect(screen.getByTestId('subtotal')).toHaveTextContent('10.00');
      });

      // Add product-2 (price: 15.00)
      await user.click(screen.getByText('Add Product 2'));

      await waitFor(() => {
        expect(screen.getByTestId('subtotal')).toHaveTextContent('25.00'); // 10 + 15
      });

      // Increase product-1 quantity to 2
      await user.click(screen.getByText('Increase product-1'));

      await waitFor(() => {
        expect(screen.getByTestId('subtotal')).toHaveTextContent('35.00'); // (10*2) + 15
      });
    });
  });

  describe('Authenticated User Flow', () => {
    beforeEach(() => {
      // Mock authenticated user
      const { useUser, useAuth } = require('@clerk/nextjs');
      useUser.mockReturnValue({
        user: { id: 'user-123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true,
      });
      useAuth.mockReturnValue({ userId: 'user-123', isLoaded: true });

      // Mock product fetches
      (global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url.includes('/api/products/product-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-1',
              title: 'Product 1',
              price: 10.00,
              imageUrl: '/test1.jpg',
            }),
          });
        }
        if (url === '/api/cart' && options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ items: [] }),
          });
        }
        if (url === '/api/cart' && options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    test('Authenticated user cart saves to database', async () => {
      const user = userEvent.setup();

      renderWithProviders(<TestCartComponent />);

      // Add product
      await user.click(screen.getByText('Add Product 1'));

      // Verify API was called to save cart
      await waitFor(() => {
        const postCalls = (global.fetch as jest.Mock).mock.calls.filter(
          call => call[0] === '/api/cart' && call[1]?.method === 'POST'
        );
        expect(postCalls.length).toBeGreaterThan(0);
      });
    });

    test('Authenticated user cart loads from database on mount', async () => {
      // Mock database cart with items
      (global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url === '/api/cart' && (!options || options.method === 'GET')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              items: [
                { productId: 'product-1', quantity: 2, addedAt: new Date().toISOString() },
              ],
            }),
          });
        }
        if (url.includes('/api/products/product-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-1',
              title: 'Product 1',
              price: 10.00,
              imageUrl: '/test1.jpg',
            }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderWithProviders(<TestCartComponent />);

      // Verify cart loaded from database
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });
    });
  });

  describe('Cart Migration on Login', () => {
    test('Guest cart is preserved in localStorage for migration', async () => {
      const user = userEvent.setup();

      // Start as guest
      const { useUser, useAuth } = require('@clerk/nextjs');
      useUser.mockReturnValue({ user: null, isLoaded: true });
      useAuth.mockReturnValue({ userId: null, isLoaded: true });

      // Mock product fetches
      (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('/api/products/product-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-1',
              title: 'Product 1',
              price: 10.00,
              imageUrl: '/test1.jpg',
            }),
          });
        }
        if (url.includes('/api/products/product-2')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 'product-2',
              title: 'Product 2',
              price: 15.00,
              imageUrl: '/test2.jpg',
            }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderWithProviders(<TestCartComponent />);

      // Add items as guest
      await user.click(screen.getByText('Add Product 1'));
      await user.click(screen.getByText('Add Product 2'));
      
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      // Verify guest cart in localStorage (ready for migration)
      const guestCart = JSON.parse(localStorage.getItem('qavah_cart') || '{}');
      expect(guestCart.items).toHaveLength(2);
      expect(guestCart.items.find((item: any) => item.productId === 'product-1')).toBeDefined();
      expect(guestCart.items.find((item: any) => item.productId === 'product-2')).toBeDefined();

      // This cart would be merged with database cart when user logs in
      // The actual merging is tested in unit tests for StorageManager
    });

    test('Authenticated user starts with empty cart if no previous data', async () => {
      // Mock authenticated user
      const { useUser, useAuth } = require('@clerk/nextjs');
      useUser.mockReturnValue({
        user: { id: 'user-123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true,
      });
      useAuth.mockReturnValue({ userId: 'user-123', isLoaded: true });

      // Mock empty database cart
      (global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url === '/api/cart' && (!options || options.method === 'GET')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ items: [] }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderWithProviders(<TestCartComponent />);

      // Verify cart starts empty
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const { useUser, useAuth } = require('@clerk/nextjs');
      useUser.mockReturnValue({
        user: { id: 'user-123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true,
      });
      useAuth.mockReturnValue({ userId: 'user-123', isLoaded: true });
    });

    test('Handles API failure gracefully when adding to cart', async () => {
      const user = userEvent.setup();

      // Mock API failure
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<TestCartComponent />);

      // Try to add product
      await user.click(screen.getByText('Add Product 1'));

      // Cart should remain empty after error
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });

    test('Handles API failure when loading cart', async () => {
      // Mock API failure
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<TestCartComponent />);

      // Should show empty cart state on error
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });
  });
});
