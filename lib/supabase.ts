/**
 * Supabase Client Configuration
 * Uses REST API (HTTPS) instead of direct database connection
 * This works even when direct database ports are blocked
 */

import { createClient } from '@supabase/supabase-js';

// Dummy client for build time - won't be used in production
const dummyClient = {
  from: () => ({ 
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
};

// Get from Supabase Dashboard → Project Settings → API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client safely - use dummy if env vars are missing
let supabase: any = dummyClient;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // We're using Clerk for auth
      },
    });
  } catch (error) {
    // If creation fails, use dummy
    console.warn('Failed to initialize Supabase client, using dummy client');
    supabase = dummyClient;
  }
}

export { supabase };
