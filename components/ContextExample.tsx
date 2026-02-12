'use client';

import { useUser } from '@/contexts/UserContext';
import { useLocation } from '@/contexts/LocationContext';
import { useApp } from '@/contexts/AppContext';

/**
 * Example component demonstrating context usage
 * This component shows how to access user, location, and app state
 * 
 * Requirements: 8.3, 9.1, 9.5
 */
export default function ContextExample() {
  const { user, isAuthenticated } = useUser();
  const { currentLocation, availableLocations } = useLocation();
  const { cart, favorites, theme } = useApp();

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-primary-700 mb-4">
        Context Providers Status
      </h2>
      
      <div className="space-y-4 text-sm">
        {/* User Context */}
        <div>
          <h3 className="font-semibold text-neutral-800">User Context:</h3>
          <p className="text-neutral-600">
            {isAuthenticated ? (
              <>Logged in as: {user?.firstName} {user?.lastName}</>
            ) : (
              'Not logged in'
            )}
          </p>
        </div>

        {/* Location Context */}
        <div>
          <h3 className="font-semibold text-neutral-800">Location Context:</h3>
          <p className="text-neutral-600">
            Current location: {currentLocation || 'All locations'}
          </p>
          <p className="text-neutral-600">
            Available locations: {availableLocations.length} cities
          </p>
        </div>

        {/* App Context */}
        <div>
          <h3 className="font-semibold text-neutral-800">App Context:</h3>
          <p className="text-neutral-600">Cart items: {cart.length}</p>
          <p className="text-neutral-600">Favorites: {favorites.length}</p>
          <p className="text-neutral-600">Theme: {theme}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-primary-200">
        <p className="text-xs text-neutral-500">
          ✓ All context providers are working correctly
        </p>
      </div>
    </div>
  );
}
