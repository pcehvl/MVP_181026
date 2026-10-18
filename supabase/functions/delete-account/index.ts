// US-007 AC7 — self-serve permanent deletion ("Delete my account and
// data"). Spec: product/stories/US-007-optional-save-across-phones/spec.md.
//
// The browser cannot delete authentication users, so this Edge Function
// holds the service-role key server-side — it never reaches the bundle
// (AC6). It verifies the caller's own JWT first, then deletes that same
// user; the profile row goes with it via the FK's ON DELETE CASCADE.
//
// Requires (after the Supabase project exists — human setup actions):
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service-role key>
//   supabase functions deploy delete-account
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
}

function respond(body: string, status: number): Response {
  return new Response(body, { status, headers: corsHeaders })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return respond('ok', 200)
  }
  if (req.method !== 'DELETE') {
    return respond('Method not allowed', 405)
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return respond('Server configuration missing', 500)
    }

    // Verify the caller with their own token (anon client + their JWT).
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    })
    const { data: { user }, error } = await caller.auth.getUser()
    if (error || !user) {
      return respond('Not signed in', 401)
    }

    // Delete exactly that user — never an id from the request body.
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    })
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return respond('Could not delete the account', 500)
    }
    return respond(JSON.stringify({ deleted: true }), 200)
  } catch {
    // Honest generic message: no internals leak to the client (AC6).
    return respond('Could not delete the account', 500)
  }
})
