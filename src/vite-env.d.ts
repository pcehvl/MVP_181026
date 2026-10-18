/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Supabase project URL (browser-safe). */
  readonly VITE_SUPABASE_URL?: string
  /** Public Supabase anon key (browser-safe, protected by RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
