'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextState, User, CartItem } from '@/types';

interface AppContextValue extends AppContextState {
  setUser: (user: User | null) => void;
  setLocation: (location: string | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load state from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('qavah_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse stored cart:', error);
      }
    }

    const storedFavorites = localStorage.getItem('qavah_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse stored favorites:', error);
      }
    }

    const storedTheme = localStorage.getItem('qavah_theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('qavah_cart', JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('qavah_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('qavah_theme', theme);
  }, [theme]);

  const addToCart = (item: CartItem): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.productId === item.productId);
      if (existingItem) {
        return prevCart.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (productId: string): void => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const clearCart = (): void => {
    setCart([]);
  };

  const toggleFavorite = (productId: string): void => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      }
      return [...prevFavorites, productId];
    });
  };

  const value: AppContextValue = {
    user,
    location,
    cart,
    favorites,
    theme,
    setUser,
    setLocation,
    addToCart,
    removeFromCart,
    clearCart,
    toggleFavorite,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
