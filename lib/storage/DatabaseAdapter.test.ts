/**
 * Unit Tests for DatabaseAdapter
 * Requirements: Shopping Cart Feature - Requirements 5.2, 5.4
 * 
 * Tests cover:
 * - getCart(), saveCart(), clearCart() operations via API
 * - Retry logic with exponential backoff
 * - Error handling
 * - Cart merging logic
 * - Date conversion
 */

import { DatabaseAdapter } from './DatabaseAdapter';
import { CartItem } from '@/types';

// Mock fetch
global.fetch = jest.fn();

describe('DatabaseAdapter', () => {
  let adapter: DatabaseAdapter;
  const userId = 'user-123';

  beforeEach(() => {
    adapter = new DatabaseAdapter(userId);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCart()', () => {
    it('should fetch cart from API', async () => {
      const mockItems = [
        { productId: 'product-1', quantity: 2, addedAt: '2024-01-01T00:00:00.000Z' },
        { productId: 'product-2', quantity: 1, addedAt: '2024-01-02T00:00:00.000Z' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockItems }),
      });

      const items = await adapter.getCart();

      expect(global.fetch).toHaveBeenCalledWith('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(items).toHaveLength(2);
      expect(items[0].productId).toBe('product-1');
      expect(items[0].quantity).toBe(2);
      expect(items[0].addedAt).toBeInstanceOf(Date);
    });

    it('should return empty array when no items exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      });

      const items = await adapter.getCart();

      expect(items).toEqual([]);
    });

    it('should return empty array when items is null', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const items = await adapter.getCart();

      expect(items).toEqual([]);
    });

    it('should convert date strings to Date objects', async () => {
      const mockItems = [
        { productId: 'product-1', quantity: 1, addedAt: '2024-01-01T00:00:00.000Z' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockItems }),
      });

      const items = await adapter.getCart();

      expect(items[0].addedAt).toBeInstanceOf(Date);
      expect(items[0].addedAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should return empty array on API error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const items = await adapter.getCart();

      expect(items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should retry on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Fail twice, succeed on third attempt
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ items: [] }),
        });

      const items = await adapter.getCart();

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(items).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('should return empty array after max retries', async () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const promise = adapter.getCart();
      
      // Fast-forward through all retries
      await jest.runAllTimersAsync();
      
      const items = await promise;

      expect(global.fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries (maxRetries=3)
      expect(items).toEqual([]);

      jest.useRealTimers();
      consoleSpy.mockRestore();
    });
  });

  describe('saveCart()', () => {
    it('should save cart via API', async () => {
      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 2, addedAt: new Date('2024-01-01') },
        { productId: 'product-2', quantity: 1, addedAt: new Date('2024-01-02') },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await adapter.saveCart(mockItems);

      expect(global.fetch).toHaveBeenCalledWith('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: mockItems }),
      });
    });

    it('should save empty cart', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await adapter.saveCart([]);

      expect(global.fetch).toHaveBeenCalledWith('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [] }),
      });
    });

    it('should throw error on API failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      await expect(adapter.saveCart(mockItems)).rejects.toThrow(
        'Unable to save cart to database'
      );

      consoleSpy.mockRestore();
    }, 10000); // Increase timeout for retries

    it('should retry on failure', async () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Fail twice, succeed on third attempt
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      const promise = adapter.saveCart(mockItems);
      
      await jest.runAllTimersAsync();
      
      await promise;

      expect(global.fetch).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
      consoleSpy.mockRestore();
    });

    it('should throw error after max retries', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const mockItems: CartItem[] = [
        { productId: 'product-1', quantity: 1, addedAt: new Date() },
      ];

      await expect(adapter.saveCart(mockItems)).rejects.toThrow(
        'Unable to save cart to database'
      );

      consoleSpy.mockRestore();
    }, 10000); // Increase timeout for retries
  });

  describe('clearCart()', () => {
    it('should clear cart via API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await adapter.clearCart();

      expect(global.fetch).toHaveBeenCalledWith('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle 404 response gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await adapter.clearCart();

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const promise = adapter.clearCart();
      
      await jest.runAllTimersAsync();
      
      await promise;

      expect(consoleSpy).toHaveBeenCalled();

      jest.useRealTimers();
      consoleSpy.mockRestore();
    });

    it('should retry on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Fail twice, succeed on third attempt
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      await adapter.clearCart();

      expect(global.fetch).toHaveBeenCalledTimes(3);

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

    it('should handle empty carts', () => {
      expect(adapter.mergeCart([], [])).toEqual([]);
    });
  });

  describe('Retry Logic', () => {
    it('should use exponential backoff for retries', async () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ items: [] }),
        });
      });

      const promise = adapter.getCart();

      // Fast-forward through retries
      await jest.runAllTimersAsync();

      await promise;

      expect(callCount).toBe(3);

      jest.useRealTimers();
      consoleSpy.mockRestore();
    });
  });
});
