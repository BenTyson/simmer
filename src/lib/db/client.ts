import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for use in the browser (client components)
 * Uses the anon key for public operations
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client for use in server components and API routes
 * Uses the anon key by default, but can use service role for admin operations
 */
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Create a Supabase admin client for server-side operations
 * Uses the service role key for full database access (scraping, admin)
 * NEVER expose this client to the browser
 */
export function createAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
