import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client for the browser.
 *
 * Only public, browser-safe values are accepted here (project URL and anon
 * key). The anon key is intended for public client use and must be protected
 * by database policies (RLS). Privileged credentials must never appear in
 * VITE_ variables or browser code.
 *
 * The client is created only when both values are configured. Until a Supabase
 * project is linked, `getSupabase()` returns null and the application shell
 * renders without data access.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const client: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export function getSupabase(): SupabaseClient | null {
  return client
}
