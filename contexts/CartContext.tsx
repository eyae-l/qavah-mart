'use client';

/**
 * Cart Context for Shopping Cart State Management
 * Requirements: Shopping Cart Feature - Requirements 1, 2, 3, 4, 6, 7, 9
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { CartItem, CartContextState, Product } from '@/types';
import { StorageManager } from '@/lib/storage/StorageManager';
import { LocalStorageAdapter } from '@/lib/storage/LocalStorageAdapter';

const CartContext = createContext<CartContextState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [previousUserId, setPreviousUserId] = useState<string | null | undefined>(undefined);

  // Determine if user is a guest (not authenticated)
  const isGuest = !isSignedIn || !userId;

  // Initialize cart from storage - reload when auth state changes
  useEffect(() => {
    if (!isLoaded) {
      console.log('[CartContext] Clerk not loaded yet, waiting...');
      return;
    }

    const loadCart = async () => {
      try {
        setIsLoading(true);
        
        console.log('[CartContext] Loading cart - Auth state:', { 
          isLoaded, 
          isSignedIn, 
          userId, 
          isGuest,
          previousUserId 
        });
        
        // Check if user just signed in (userId changed from null to a value)
        const justSignedIn = previousUserId === null && userId !== null;
        
        if (justSignedIn) {
          console.log('[CartContext] User just signed in, migrating cart from localStorage to database');
          // Migrate cart from localStorage to database
          const migratedItems = await StorageManager.migrateCart(userId!);
          console.log('[CartContext] Migrated items:', migratedItems);
          setItems(migratedItems);
        } else if (isGuest) {
          // ALWAYS use localStorage for guest users
          console.log('[CartContext] Loading cart for guest user from localStorage');
          const localAdapter = new LocalStorageAdapter();
          const cartItems = await localAdapter.getCart();
          console.log('[CartContext] Loaded items from localStorage:', cartItems);
          setItems(cartItems);
        } else {
          // For authenticated users, use database via StorageManager
          console.log('[CartContext] Loading cart for authenticated user from database, userId:', userId);
          const storage = new StorageManager(userId);
          const cartItems = await storage.getCart();
          console.log('[CartContext] Loaded items from database:', cartItems);
          setItems(cartItems);
        }
        
        // Update previous userId
        setPreviousUserId(userId);
      } catch (error) {
        console.error('[CartContext] Error loading cart:', error);
        setItems([]); // Set empty cart on error
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [userId, isLoaded]);

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = items.map(item => item.productId);
      const missingIds = productIds.filter(id => !products.has(id));

      if (missingIds.length === 0) return;

      try {
        const responses = await Promise.all(
          missingIds.map(id => fetch(`/api/products/${id}`))
        );
        
        const productData = await Promise.all(
          responses.map(res => res.ok ? res.json() : null)
        );

        const newProducts = new Map(products);
        productData.forEach((product, index) => {
          if (product) {
            newProducts.set(missingIds[index], product);
          }
        });

        setProducts(newProducts);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    }
  }, [items]);

  // Calculate cart summary
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const product = products.get(item.productId);
    if (!product) return sum;
    return sum + (product.price * item.quantity);
  }, 0);

  const total = subtotal; // Extensible for taxes/fees

  // Save cart to storage
  const saveCart = useCallback(async (newItems: CartItem[]) => {
    try {
      // Debug logging
      console.log('[CartContext] saveCart called', { 
        isGuest, 
        userId, 
        isSignedIn, 
        itemCount: newItems.length 
      });

      // Update state immediately for responsive UI
      setItems(newItems);

      // ALWAYS use localStorage for guest users
      if (isGuest) {
        console.log('[CartContext] Saving to localStorage for guest user');
        const localAdapter = new LocalStorageAdapter();
        await localAdapter.saveCart(newItems);
        console.log('[CartContext] Successfully saved to localStorage');
        return;
      }
      
      // For authenticated users, use database via StorageManager
      console.log('[CartContext] Saving to database for authenticated user');
      const storage = new StorageManager(userId!);
      await storage.saveCart(newItems);
      console.log('[CartContext] Successfully saved to database');
    } catch (error) {
      console.error('[CartContext] Error saving cart:', error);
      // State already updated above, so UI won't break
    }
  }, [userId, isGuest, isSignedIn]);

  // Add item to cart
  const addItem = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      const existingItem = items.find(item => item.productId === productId);
      
      let newItems: CartItem[];
      if (existingItem) {
        // Increment quantity
        newItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...items, {
          productId,
          quantity,
          addedAt: new Date()
        }];
      }

      await saveCart(newItems);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }, [items, saveCart]);

  // Remove item from cart
  const removeItem = useCallback(async (productId: string) => {
    try {
      const newItems = items.filter(item => item.productId !== productId);
      await saveCart(newItems);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }, [items, saveCart]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      // Validate quantity
      if (quantity < 0 || !Number.isInteger(quantity)) {
        throw new Error('Quantity must be a positive integer');
      }

      if (quantity === 0) {
        // Remove item if quantity is zero
        await removeItem(productId);
        return;
      }

      const newItems = items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );

      await saveCart(newItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, [items, saveCart, removeItem]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      // ALWAYS use localStorage for guest users
      if (isGuest) {
        const localAdapter = new LocalStorageAdapter();
        await localAdapter.clearCart();
      } else {
        // For authenticated users, use database via StorageManager
        const storage = new StorageManager(userId!);
        await storage.clearCart();
      }
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [userId, isGuest]);

  // Get specific item
  const getItem = useCallback((productId: string): CartItem | undefined => {
    return items.find(item => item.productId === productId);
  }, [items]);

  // Check if item exists
  const hasItem = useCallback((productId: string): boolean => {
    return items.some(item => item.productId === productId);
  }, [items]);

  const value: CartContextState = {
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextState {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
