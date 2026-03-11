'use client';

import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { LocationProvider } from './LocationContext';
import { AppProvider } from './AppContext';
import { ToastProvider } from './ToastContext';
import { CartProvider } from './CartContext';

/**
 * Providers component that wraps all context providers
 * This component must be used in the root layout to provide global state
 * 
 * Requirements: 8.3, 9.1, 9.5, Shopping Cart Feature
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <UserProvider>
        <LocationProvider>
          <ToastProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ToastProvider>
        </LocationProvider>
      </UserProvider>
    </AppProvider>
  );
}
