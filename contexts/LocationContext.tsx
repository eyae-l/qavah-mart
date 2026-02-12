'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Location, LocationContextState } from '@/types';
import { mockLocations } from '@/data/mockData';

const LocationContext = createContext<LocationContextState | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [availableLocations] = useState<Location[]>(mockLocations);

  // Load location from localStorage on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('qavah_location');
    if (storedLocation) {
      setCurrentLocation(storedLocation);
    }
  }, []);

  const setLocation = (location: string): void => {
    setCurrentLocation(location);
    localStorage.setItem('qavah_location', location);
  };

  const clearLocation = (): void => {
    setCurrentLocation(null);
    localStorage.removeItem('qavah_location');
  };

  const value: LocationContextState = {
    currentLocation,
    availableLocations,
    setLocation,
    clearLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextState {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
