/**
 * Unit Tests for LocalStorageAdapter
 * Requirements: Shopping Cart Feature - Requirements 5.1, 5.3
 * 
 * Tests cover:
 * - getCart(), saveCart(), clearCart() operations
 * - Data validation and error handling
 * - localStorage quota exceeded errors
 * - Cart merging logic
 * - Date conversion
 */

import { LocalStorageAdapter } from './LocalStorageAdapter';
import { CartItem } from '@/types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  const CART_STORAGE_KEY = 'qavah_cart';

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getCart()', () => {
    it('should return empty array when no cart exists', async () => {
      const items = await adapter.getCart();
      expect(items).toEqual([]);
    });

    it('should return cart items from localStorage', async () => {
      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date('2024-01-01') },
        { productId: 'product-2', quantity: 1, addedAt: new Date('2024-01-02') },
      ];

      const stored = {
        items: mockItems,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));

      const items = await adapter.getCart();
      
      expect(items).toHaveLength(2);
      expect(items[0].productId).toBe('product-1');
      expect(items[0].quantity).toBe(2);
      expect(items[0].addedAt).toBeInstanceOf(Date);
      expect(items[1].productId).toBe('product-2');
    });

    it('should convert date strings to Date objects', async () => {
      const stored = {
        items: [
          { productId: 'product-1', quantity: 1, addedAt: '2024-01-01T00:00:00.000Z' },
        ],
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));

      const items = await adapter.getCart();
      
      expect(items[0].addedAt).toBeInstanceOf(Date);
      expect(items[0].addedAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should return empty array for invalid data structure', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ invalid: 'data' }));

      const items = await adapter.getCart();
      
      expect(items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid cart data structure in localStorage');
      
      consoleSpy.mockRestore();
    });

    it('should return empty array for corrupted JSON', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      localStorage.setItem(CART_STORAGE_KEY, 'invalid json');

      const items = await adapter.getCart();
      
      expect(items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle empty items array', async () => {
      const stored = {
        items: [],
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));

      const items = await adapter.getCart();
      
      expect(items).toEqual([]);
    });
  });

  describe('saveCart()', () => {
    it('should save cart items to localStorage', async () => {
      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date('2024-01-01') },
        { productId: 'product-2', quantity: 1, addedAt: new Date('2024-01-02') },
      ];

      await adapter.saveCart(mockItems);

      const stored = localStorage.getItem(CART_STORAGE_KEY);
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored!);
      expect(data.items).toHaveLength(2);
      expect(data.items[0].productId).toBe('product-1');
      expect(data.items[0].quantity).toBe(2);
      expect(data.updatedAt).toBeTruthy();
    });

    it('should save empty cart', async () => {
      await adapter.saveCart([]);

      const stored = localStorage.getItem(CART_STORAGE_KEY);
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored!);
      expect(data.items).toEqual([]);
    });

    it('should update existing cart', async () => {
      const firstItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      await adapter.saveCart(firstItems);

      const secondItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date() },
        { productId: 'product-2', quantity: 1, addedAt: new Date() },
      ];

      await adapter.saveCart(secondItems);

      const items = await adapter.getCart();
      expect(items).toHaveLength(2);
      expect(items[0].quantity).toBe(2);
    });

    it('should throw error when quota exceeded', async () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw quotaError;
      });

      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      await expect(adapter.saveCart(mockItems)).rejects.toThrow(
        'Unable to save cart. Browser storage is full. Please clear browser data.'
      );
    });

    it('should throw error for other storage errors', async () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      await expect(adapter.saveCart(mockItems)).rejects.toThrow(
        'Unable to save cart to localStorage'
      );
    });
  });

  describe('clearCart()', () => {
    it('should remove cart from localStorage', async () => {
      // Restore mocks first
      jest.restoreAllMocks();
      
      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      // Save first
      const stored = {
        items: mockItems,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
      
      expect(localStorage.getItem(CART_STORAGE_KEY)).toBeTruthy();

      await adapter.clearCart();
      expect(localStorage.getItem(CART_STORAGE_KEY)).toBeNull();
    });

    it('should handle clearing non-existent cart', async () => {
      await adapter.clearCart();
      expect(localStorage.getItem(CART_STORAGE_KEY)).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      await adapter.clearCart();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('mergeCart()', () => {
    it('should merge local and remote carts', () => {
      const localItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date('2024-01-01') },
        { productId: 'product-2', quantity: 2, addedAt: new Date('2024-01-02') },
      ];

      const remoteItems: CartItem[] = [
        { productId: 'product-3', quantity: 1, addedAt: new Date('2024-01-03') },
      ];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged).toHaveLength(3);
      expect(merged.find(item => item.productId === 'product-1')).toBeTruthy();
      expect(merged.find(item => item.productId === 'product-2')).toBeTruthy();
      expect(merged.find(item => item.productId === 'product-3')).toBeTruthy();
    });

    it('should sum quantities for duplicate items', () => {
      const localItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date('2024-01-01') },
      ];

      const remoteItems: CartItem[] = [
        { productId: 'product-1', quantity: 3, addedAt: new Date('2024-01-02') },
      ];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged).toHaveLength(1);
      expect(merged[0].productId).toBe('product-1');
      expect(merged[0].quantity).toBe(5); // 2 + 3
    });

    it('should keep earlier addedAt date for duplicates', () => {
      const earlierDate = new Date('2024-01-01');
      const laterDate = new Date('2024-01-05');

      const localItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: earlierDate },
      ];

      const remoteItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: laterDate },
      ];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged[0].addedAt).toEqual(earlierDate);
    });

    it('should handle empty local cart', () => {
      const localItems: CartItem[] = [];
      const remoteItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged).toHaveLength(1);
      expect(merged[0].productId).toBe('product-1');
    });

    it('should handle empty remote cart', () => {
      const localItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];
      const remoteItems: CartItem[] = [];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged).toHaveLength(1);
      expect(merged[0].productId).toBe('product-1');
    });

    it('should handle both empty carts', () => {
      const merged = adapter.mergeCart([], []);
      expect(merged).toEqual([]);
    });

    it('should handle multiple duplicates', () => {
      const localItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date('2024-01-01') },
        { productId: 'product-2', quantity: 2, addedAt: new Date('2024-01-02') },
        { productId: 'product-3', quantity: 1, addedAt: new Date('2024-01-03') },
      ];

      const remoteItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date('2024-01-04') },
        { productId: 'product-2', quantity: 1, addedAt: new Date('2024-01-05') },
        { productId: 'product-4', quantity: 1, addedAt: new Date('2024-01-06') },
      ];

      const merged = adapter.mergeCart(localItems, remoteItems);

      expect(merged).toHaveLength(4);
      
      const product1 = merged.find(item => item.productId === 'product-1');
      expect(product1?.quantity).toBe(3); // 1 + 2
      
      const product2 = merged.find(item => item.productId === 'product-2');
      expect(product2?.quantity).toBe(3); // 2 + 1
      
      const product3 = merged.find(item => item.productId === 'product-3');
      expect(product3?.quantity).toBe(1);
      
      const product4 = merged.find(item => item.productId === 'product-4');
      expect(product4?.quantity).toBe(1);
    });
  });

  describe('isAvailable()', () => {
    it('should return true when localStorage is available', () => {
      // Reset any previous mocks
      jest.restoreAllMocks();
      expect(LocalStorageAdapter.isAvailable()).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage not available');
      });

      expect(LocalStorageAdapter.isAvailable()).toBe(false);
    });
  });
});
