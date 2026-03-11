/**
 * Supabase Client Configuration
 * Uses REST API (HTTPS) instead of direct database connection
 * This works even when direct database ports are blocked
 */

import { createClient } from '@supabase/supabase-js';

// Get from Supabase Dashboard → Project Settings → API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if env vars are missing (for build time)
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We're using Clerk for auth
    },
  });
} else {
  // Dummy client for build time - won't be used in production
  if (typeof window === 'undefined') {
    // Server-side: create a minimal dummy
    supabase = {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    };
  }
}

export { supabase };
