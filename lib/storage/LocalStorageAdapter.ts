/**
 * LocalStorage Adapter for Guest User Cart Persistence
 * Requirements: Shopping Cart Feature - Requirements 5.1, 5.3
 */

import { CartItem, StorageAdapter } from '@/types';

const CART_STORAGE_KEY = 'qavah_cart';

interface LocalStorageCart {
  items: CartItem[];
  updatedAt: string;
}

export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get cart from localStorage
   */
  async getCart(): Promise<CartItem[]> {
    try {
      if (typeof window === 'undefined') {
        console.log('[LocalStorageAdapter] Cannot read: window is undefined (SSR)');
        return [];
      }

      const stored = localStorage.getItem(CART_STORAGE_KEY);
      console.log('[LocalStorageAdapter] Reading from localStorage:', {
        key: CART_STORAGE_KEY,
        found: stored !== null,
        dataLength: stored?.length || 0
      });

      if (!stored) {
        return [];
      }

      const data: LocalStorageCart = JSON.parse(stored);
      
      // Validate data structure
      if (!data || !Array.isArray(data.items)) {
        console.warn('[LocalStorageAdapter] Invalid cart data structure in localStorage');
        return [];
      }
      
      // Validate and convert dates
      const items = data.items.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));

      console.log('[LocalStorageAdapter] Successfully loaded items:', items.length);
      return items;
    } catch (error) {
      console.error('[LocalStorageAdapter] Error reading cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Save cart to localStorage
   */
  async saveCart(items: CartItem[]): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        console.log('[LocalStorageAdapter] Cannot save: window is undefined (SSR)');
        return;
      }

      const data: LocalStorageCart = {
        items,
        updatedAt: new Date().toISOString()
      };

      const jsonData = JSON.stringify(data);
      console.log('[LocalStorageAdapter] Saving to localStorage:', {
        key: CART_STORAGE_KEY,
        itemCount: items.length,
        dataSize: jsonData.length
      });

      localStorage.setItem(CART_STORAGE_KEY, jsonData);
      
      // Verify it was saved
      const verification = localStorage.getItem(CART_STORAGE_KEY);
      console.log('[LocalStorageAdapter] Verification - data saved:', verification !== null);
    } catch (error) {
      console.error('[LocalStorageAdapter] Error saving cart:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Unable to save cart. Browser storage is full. Please clear browser data.');
      }
      throw new Error('Unable to save cart to localStorage');
    }
  }

  /**
   * Clear cart from localStorage
   */
  async clearCart(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }

  /**
   * Merge local and remote carts
   * Combines items and sums quantities for duplicates
   */
  mergeCart(localItems: CartItem[], remoteItems: CartItem[]): CartItem[] {
    const merged = new Map<string, CartItem>();

    // Add remote items first
    remoteItems.forEach(item => {
      merged.set(item.productId, { ...item });
    });

    // Add or merge local items
    localItems.forEach(item => {
      const existing = merged.get(item.productId);
      if (existing) {
        // Sum quantities for duplicate items
        existing.quantity += item.quantity;
        // Keep the earlier addedAt date
        if (new Date(item.addedAt) < new Date(existing.addedAt)) {
          existing.addedAt = item.addedAt;
        }
      } else {
        merged.set(item.productId, { ...item });
      }
    });

    return Array.from(merged.values());
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
