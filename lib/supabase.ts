/**
 * Supabase Client Configuration
 * Uses REST API (HTTPS) instead of direct database connection
 * This works even when direct database ports are blocked
 */

import { createClient } from '@supabase/supabase-js';

// Get from Supabase Dashboard → Project Settings → API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase URL or Anon Key not configured. Add to .env.local:');
  console.warn('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're using Clerk for auth
  },
});
