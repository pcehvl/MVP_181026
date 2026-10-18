import type { Session } from '@supabase/supabase-js'
import type { IntakeAnswers } from './intake'
import { clearAnswers, isIntakeAnswers } from './persistence'
import { getSupabase } from './supabase'

/**
 * US-007 — optional save-across-phones (Supabase Auth + Postgres + RLS).
 * Spec: product/stories/US-007-optional-save-across-phones/spec.md (status: ready).
 *
 * DECISIONS (Product Owner, 2026-10-18):
 * - Sign-in is never required (AC1). Everything here is a no-op unless a
 *   Supabase project is configured; the signed-out journey is untouched.
 * - Email magic link only (Supabase passwordless) — no password, no SMS.
 * - Profile = saved intake answers only (AC4). The map and the 3-sentence
 *   introduction are recomputed on the phone from those answers; they are
 *   never stored on the server.
 * - Free tier only — no paid SMTP, no SMS.
 *
 * Only public, browser-safe values reach the client (project URL + anon key,
 * AC6). The anon key is protected by RLS (migration
 * supabase/migrations/20261018000001_profiles_rls.sql): a resident can read
 * and write only their own row (AC5). The service-role key exists only inside
 * the delete-account Edge Function and never ships to the browser.
 */

/** True when a Supabase project is linked; false keeps the offers hidden. */
export function isSyncConfigured(): boolean {
  return getSupabase() !== null
}

/** The signed-in resident, reduced to what the journey needs (AC4/AC5). */
export interface Account {
  userId: string
}

/**
 * Subscribe to sign-in / sign-out changes. Returns an unsubscribe function.
 * With no Supabase configured it reports no account and never fires (AC1).
 */
export function onAuthChange(
  callback: (account: Account | null) => void,
): () => void {
  const supabase = getSupabase()
  if (supabase === null) {
    callback(null)
    return () => {}
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
    const userId = session?.user.id
    callback(userId ? { userId } : null)
  })
  return () => data.subscription.unsubscribe()
}

/**
 * Send the magic sign-in link to the resident's email (AC2). The session is
 * established when they open the link, which fires onAuthChange.
 */
export async function sendMagicLink(email: string): Promise<void> {
  const supabase = getSupabase()
  if (supabase === null) return
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) {
    throw new Error('We could not send the sign-in email. Please try again.')
  }
}

/**
 * Load the saved answers for the signed-in resident (AC3). Returns null when
 * nothing is saved, and throws only a plain message on failure — internals
 * never reach the screen (AC6).
 */
export async function loadSavedAnswers(account: Account): Promise<IntakeAnswers | null> {
  const supabase = getSupabase()
  if (supabase === null) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('answers')
    .eq('user_id', account.userId)
    .maybeSingle()
  if (error) {
    throw new Error('We could not load your saved journey. Please try again.')
  }
  // Same shape check as the local save: never hand garbage to the journey (AC4).
  return isIntakeAnswers(data?.answers) ? data.answers : null
}

/**
 * Save the resident's intake answers to their own row (AC2/AC4). The row's
 * user_id comes from the session (AC5 — RLS rejects any other id).
 */
export async function saveAnswersToAccount(
  account: Account,
  answers: IntakeAnswers,
): Promise<void> {
  const supabase = getSupabase()
  if (supabase === null) return
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: account.userId, answers, updated_at: new Date().toISOString() })
  if (error) {
    throw new Error('We could not save your journey. Please try again.')
  }
}

/**
 * Sign out of the current device only. Never deletes anything — that is
 * deleteAccountAndData's job (AC7), so "Start again" can sign out safely.
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabase()
  if (supabase === null) return
  await supabase.auth.signOut()
}

/**
 * AC7 — self-serve permanent deletion: deletes the authentication account and
 * its profile row (via FK cascade) inside the delete-account Edge Function,
 * then clears the local save on this device.
 */
export async function deleteAccountAndData(): Promise<void> {
  const supabase = getSupabase()
  if (supabase === null) return
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'DELETE',
  })
  if (error) {
    throw new Error('We could not delete your account. Please try again.')
  }
  // The server row is gone; wipe this device too (AC7): local save plus the
  // now-invalid session. Sign-out here never touches server data — the
  // account already no longer exists.
  clearAnswers()
  try {
    await supabase.auth.signOut()
  } catch {
    // Session already invalid with the deleted user — nothing left to clear.
  }
}
