/**
 * Storage Manager for Cart Persistence
 * Selects appropriate storage adapter based on authentication state
 * Requirements: Shopping Cart Feature - Requirements 5, 9
 */

import { CartItem, StorageAdapter } from '@/types';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { DatabaseAdapter } from './DatabaseAdapter';

export class StorageManager {
  private adapter: StorageAdapter;

  constructor(userId: string | null) {
    if (userId) {
      this.adapter = new DatabaseAdapter(userId);
    } else {
      this.adapter = new LocalStorageAdapter();
    }
  }

  /**
   * Get cart from current storage
   */
  async getCart(): Promise<CartItem[]> {
    return this.adapter.getCart();
  }

  /**
   * Save cart to current storage
   */
  async saveCart(items: CartItem[]): Promise<void> {
    return this.adapter.saveCart(items);
  }

  /**
   * Clear cart from current storage
   */
  async clearCart(): Promise<void> {
    return this.adapter.clearCart();
  }

  /**
   * Migrate cart from localStorage to database when user logs in
   * Merges local and remote carts
   */
  static async migrateCart(userId: string): Promise<CartItem[]> {
    const localAdapter = new LocalStorageAdapter();
    const databaseAdapter = new DatabaseAdapter(userId);

    try {
      // Get both carts
      const localItems = await localAdapter.getCart();
      const remoteItems = await databaseAdapter.getCart();

      // Merge carts
      const mergedItems = localAdapter.mergeCart(localItems, remoteItems);

      // Save merged cart to database
      if (mergedItems.length > 0) {
        await databaseAdapter.saveCart(mergedItems);
      }

      // Clear localStorage
      await localAdapter.clearCart();

      return mergedItems;
    } catch (error) {
      console.error('Error migrating cart:', error);
      // If migration fails, return local items as fallback
      return localAdapter.getCart();
    }
  }

  /**
   * Transfer cart from database to localStorage when user logs out
   */
  static async transferToLocal(userId: string): Promise<void> {
    const databaseAdapter = new DatabaseAdapter(userId);
    const localAdapter = new LocalStorageAdapter();

    try {
      // Get database cart
      const items = await databaseAdapter.getCart();

      // Save to localStorage
      if (items.length > 0) {
        await localAdapter.saveCart(items);
      }
    } catch (error) {
      console.error('Error transferring cart to localStorage:', error);
    }
  }
}
