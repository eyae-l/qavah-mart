/**
 * Database Adapter for Authenticated User Cart Persistence
 * Requirements: Shopping Cart Feature - Requirements 5.2, 5.4
 */

import { CartItem, StorageAdapter } from '@/types';

export class DatabaseAdapter implements StorageAdapter {
  private userId: string;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Get cart from database via API
   */
  async getCart(): Promise<CartItem[]> {
    try {
      console.log('[DatabaseAdapter] Fetching cart from API for userId:', this.userId);
      
      const response = await this.withRetry(async () => {
        return await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });

      console.log('[DatabaseAdapter] API response status:', response.status);

      // If unauthorized (401), return empty cart silently (user not logged in)
      if (response.status === 401) {
        console.warn('[DatabaseAdapter] Unauthorized (401) - user not authenticated');
        return [];
      }

      if (!response.ok) {
        console.warn('[DatabaseAdapter] Failed to fetch cart, status:', response.status);
        return [];
      }

      const data = await response.json();
      console.log('[DatabaseAdapter] Received data from API:', data);
      
      if (!data.items) {
        console.log('[DatabaseAdapter] No items in response');
        return [];
      }

      // Parse JSON items and convert dates
      const items = data.items as any[];
      const parsedItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        addedAt: new Date(item.addedAt)
      }));
      
      console.log('[DatabaseAdapter] Parsed items:', parsedItems);
      return parsedItems;
    } catch (error) {
      console.error('[DatabaseAdapter] Error fetching cart:', error);
      return []; // Return empty cart on error instead of throwing
    }
  }

  /**
   * Save cart to database via API
   */
  async saveCart(items: CartItem[]): Promise<void> {
    try {
      console.log('[DatabaseAdapter] Saving cart to API, userId:', this.userId, 'items:', items.length);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('[DatabaseAdapter] Save response status:', response.status);

      // If unauthorized (401), silently fail - user is not logged in
      if (response.status === 401) {
        console.warn('[DatabaseAdapter] Cannot save cart: User not authenticated (401)');
        return;
      }

      // If server error (500), fail fast without retry
      if (response.status === 500) {
        const errorText = await response.text();
        console.error('[DatabaseAdapter] Server error (500) - cart table may not exist:', errorText);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('[DatabaseAdapter] Failed to save cart, status:', response.status, 'error:', errorText);
        return;
      }

      const result = await response.json();
      console.log('[DatabaseAdapter] Cart saved successfully:', result);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[DatabaseAdapter] Request timeout - cart save took too long. Cart table may not exist or network issue.');
      } else {
        console.error('[DatabaseAdapter] Error saving cart:', error);
      }
      // Silently fail - don't throw error to prevent UI disruption
    }
  }

  /**
   * Clear cart from database via API
   */
  async clearCart(): Promise<void> {
    try {
      await this.withRetry(async () => {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok && response.status !== 404) {
          throw new Error('Failed to clear cart');
        }

        return response;
      });
    } catch (error) {
      console.error('Error clearing cart from database:', error);
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
   * Retry helper with exponential backoff
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await this.sleep(this.retryDelay * (this.maxRetries - retries + 1));
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
