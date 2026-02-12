'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextState } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
}

const UserContext = createContext<UserContextState | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('qavah_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('qavah_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // Mock login - in production, this would call an API
    // For now, we'll simulate a successful login
    const mockUser: User = {
      id: 'user-' + Date.now(),
      email: credentials.email,
      firstName: 'John',
      lastName: 'Doe',
      location: {
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
      },
      createdAt: new Date(),
      isVerified: false,
      isSeller: false,
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('qavah_user', JSON.stringify(mockUser));
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('qavah_user');
  };

  const register = async (userData: RegisterData): Promise<void> => {
    // Mock registration - in production, this would call an API
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      location: userData.location,
      createdAt: new Date(),
      isVerified: false,
      isSeller: false,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('qavah_user', JSON.stringify(newUser));
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('qavah_user', JSON.stringify(updatedUser));
  };

  const value: UserContextState = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextState {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
