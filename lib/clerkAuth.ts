/**
 * Clerk Authentication Utilities
 * Helper functions for authenticating API routes with Clerk
 */

import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string | null;
}

/**
 * Get authenticated user from Clerk
 * Returns user info if authenticated, null otherwise
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // Get user email from Clerk if needed
    // For now, just return userId
    return {
      userId,
      email: null, // Can be fetched from Clerk if needed
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
