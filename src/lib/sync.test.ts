import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IntakeAnswers } from './intake'
import { STORAGE_KEY } from './persistence'

/**
 * US-007 — sync layer contract: graceful no-op when unconfigured (AC1/AC6),
 * magic-link sign-in (AC2), minimal own-row profile read/write (AC4/AC5),
 * and self-serve deletion that also wipes the device (AC7).
 * Spec: product/stories/US-007-optional-save-across-phones/spec.md (status: ready).
 */

interface FakeAuth {
  getSession: ReturnType<typeof vi.fn>
  onAuthStateChange: ReturnType<typeof vi.fn>
  signInWithOtp: ReturnType<typeof vi.fn>
  signOut: ReturnType<typeof vi.fn>
}

interface FakeClient {
  auth: FakeAuth
  from: ReturnType<typeof vi.fn>
  functions: { invoke: ReturnType<typeof vi.fn> }
}

const answers: IntakeAnswers = {
  qualification: 'Matric (finished high school)',
  area: 'Athlone',
  selectedWork: ['Cleaning', 'Retail and shops'],
}

function makeFakeClient(): FakeClient {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(),
    functions: { invoke: vi.fn().mockResolvedValue({ error: null }) },
  }
}

/** Wire the fake `profiles` table: select().eq().maybeSingle() + upsert(). */
function wireProfiles(client: FakeClient, row: { answers: unknown } | null) {
  client.from.mockImplementation(() => ({
    select: () => ({
      eq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: row, error: null }) }),
    }),
    upsert: vi.fn().mockResolvedValue({ error: null }),
  }))
}

const client = makeFakeClient()

vi.mock('./supabase', () => ({
  getSupabase: () => client,
}))

// Import after the mock so the module sees the fake client.
const sync = await import('./sync')

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
  client.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
  client.auth.signInWithOtp.mockResolvedValue({ error: null })
  client.auth.signOut.mockResolvedValue({ error: null })
  client.functions.invoke.mockResolvedValue({ error: null })
})

describe('US-007 sync layer', () => {
  it('AC1 — isSyncConfigured reflects the linked client', () => {
    expect(sync.isSyncConfigured()).toBe(true)
  })

  it('AC1 — every operation is a no-op when no Supabase is linked', async () => {
    vi.resetModules()
    vi.doMock('./supabase', () => ({ getSupabase: () => null }))
    const unlinked = await import('./sync')
    expect(unlinked.isSyncConfigured()).toBe(false)
    // No throw, no side effect: the signed-out journey is untouched.
    await unlinked.sendMagicLink('a@b.com')
    await unlinked.saveAnswersToAccount({ userId: 'u' }, answers)
    expect(await unlinked.loadSavedAnswers({ userId: 'u' })).toBeNull()
    await expect(unlinked.deleteAccountAndData()).resolves.toBeUndefined()
    vi.doUnmock('./supabase')
    vi.resetModules()
  })

  it('AC2 — sendMagicLink requests a passwordless email link', async () => {
    await sync.sendMagicLink('resident@example.com')
    expect(client.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'resident@example.com',
      options: { emailRedirectTo: window.location.origin },
    })
  })

  it('AC6 — a send failure surfaces a plain message, never internals', async () => {
    client.auth.signInWithOtp.mockResolvedValue({ error: { message: 'smtp: 550 relay denied at host' } })
    await expect(sync.sendMagicLink('a@b.com')).rejects.toThrow(
      'We could not send the sign-in email. Please try again.',
    )
  })

  it('AC3/AC4 — loadSavedAnswers returns the stored answers', async () => {
    wireProfiles(client, { answers })
    await expect(sync.loadSavedAnswers({ userId: 'u1' })).resolves.toEqual(answers)
    expect(client.from).toHaveBeenCalledWith('profiles')
  })

  it('AC4 — loadSavedAnswers rejects a wrong-shaped payload (never garbage to the journey)', async () => {
    wireProfiles(client, { answers: { qualification: 42, area: null, selectedWork: 'Cleaning' } })
    await expect(sync.loadSavedAnswers({ userId: 'u1' })).resolves.toBeNull()
  })

  it('AC4 — loadSavedAnswers returns null when the account has no row yet', async () => {
    wireProfiles(client, null)
    await expect(sync.loadSavedAnswers({ userId: 'u1' })).resolves.toBeNull()
  })

  it('AC4/AC5 — saveAnswersToAccount upserts the own row: identifier + answers + timestamp only', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    client.from.mockImplementation(() => ({ upsert }))
    await sync.saveAnswersToAccount({ userId: 'u1' }, answers)
    const payload = upsert.mock.calls[0][0] as Record<string, unknown>
    expect(Object.keys(payload).sort()).toEqual(['answers', 'updated_at', 'user_id'])
    expect(payload.user_id).toBe('u1')
    expect(payload.answers).toEqual(answers)
  })

  it('AC6 — a read failure surfaces a plain message, never internals', async () => {
    client.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'relation pg_catalog.x does not exist' } }) }),
      }),
    }))
    await expect(sync.loadSavedAnswers({ userId: 'u1' })).rejects.toThrow(
      'We could not load your saved journey. Please try again.',
    )
  })

  it('AC7 — deleteAccountAndData invokes the server deletion, wipes the device, ends the session', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    await sync.deleteAccountAndData()
    expect(client.functions.invoke).toHaveBeenCalledWith('delete-account', { method: 'DELETE' })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(client.auth.signOut).toHaveBeenCalled()
  })

  it('AC7 — a failed deletion keeps the local save (never claim a delete that did not happen)', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    client.functions.invoke.mockResolvedValue({ error: { message: 'fn cold start failed' } })
    await expect(sync.deleteAccountAndData()).rejects.toThrow(
      'We could not delete your account. Please try again.',
    )
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    expect(client.auth.signOut).not.toHaveBeenCalled()
  })

  it('signOut ends the session only — it never deletes anything', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    await sync.signOut()
    expect(client.auth.signOut).toHaveBeenCalled()
    expect(client.functions.invoke).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('onAuthChange unsubscribes cleanly', () => {
    const unsubscribe = vi.fn()
    client.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } })
    const stop = sync.onAuthChange(() => {})
    stop()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
