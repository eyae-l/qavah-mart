'use client';

import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { LocationProvider } from './LocationContext';
import { AppProvider } from './AppContext';
import { ToastProvider } from './ToastContext';

/**
 * Providers component that wraps all context providers
 * This component must be used in the root layout to provide global state
 * 
 * Requirements: 8.3, 9.1, 9.5
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <UserProvider>
        <LocationProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LocationProvider>
      </UserProvider>
    </AppProvider>
  );
}
