import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { IntakeAnswers } from '@/lib/intake'
import { STORAGE_KEY } from '@/lib/persistence'

/**
 * US-007 ("Save my journey across phones") — AC evidence at the journey
 * level, with the sync layer mocked (shared verification approach: no
 * backend project is configured, so the Supabase calls are faked and the
 * real-project steps are documented manual checks in verification.md).
 * Spec: product/stories/US-007-optional-save-across-phones/spec.md (ready).
 */

interface AuthCallback {
  (account: { userId: string } | null): void
}

const mocks = vi.hoisted(() => {
  const state: {
    configured: boolean
    authCallback: AuthCallback | null
    savedAnswers: IntakeAnswers | null
    loadError: boolean
  } = { configured: true, authCallback: null, savedAnswers: null, loadError: false }

  const fns = {
    isSyncConfigured: () => state.configured,
    onAuthChange: (cb: AuthCallback) => {
      state.authCallback = cb
      return () => {
        state.authCallback = null
      }
    },
    sendMagicLink: vi.fn(async (_email: string) => {
      void _email
    }),
    loadSavedAnswers: vi.fn(async () => {
      if (state.loadError) throw new Error('network down')
      return state.savedAnswers
    }),
    saveAnswersToAccount: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    deleteAccountAndData: vi.fn(async () => {}),
  }
  return { state, fns }
})

vi.mock('@/lib/sync', () => mocks.fns)

const { default: App } = await import('./App')

beforeEach(() => {
  window.localStorage.clear()
  mocks.state.configured = true
  mocks.state.savedAnswers = null
  mocks.state.loadError = false
  mocks.fns.sendMagicLink.mockClear()
  mocks.fns.saveAnswersToAccount.mockClear()
  mocks.fns.deleteAccountAndData.mockClear()
})

afterEach(() => {
  cleanup()
})

const matric: IntakeAnswers = {
  qualification: 'Matric (finished high school)',
  area: 'Khayelitsha',
  selectedWork: [],
}

async function reachTheMap(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: /matric/i }))
  await user.click(screen.getByRole('button', { name: /next/i }))
  await user.type(screen.getByLabelText('Your area'), 'Khayelitsha')
  await user.click(screen.getByRole('button', { name: /next/i }))
  await user.click(screen.getByRole('button', { name: /show my skills map/i }))
}

/** Deliver the sign-in result the way the auth subscription would. */
function signInAs(userId: string) {
  mocks.state.authCallback?.({ userId })
}

describe('US-007 optional save-across-phones', () => {
  it('AC1 — with sync unconfigured the journey is untouched: no account UI anywhere', async () => {
    mocks.state.configured = false
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    expect(screen.queryByText(/keep my journey on any phone/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /see my practical next step/i }))
    expect(screen.queryByText(/keep my journey on any phone/i)).not.toBeInTheDocument()
  })

  it('AC1 — the map shows the offer but the journey never requires it; "Not now" hides it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    // The compact map prompt (decision: end of journey + map prompt).
    await user.click(screen.getByRole('button', { name: /keep my journey on any phone/i }))
    expect(screen.getByRole('region', { name: /keep my journey on any phone/i })).toBeInTheDocument()
    // Decline: nothing lost, journey exactly as before.
    await user.click(screen.getByRole('button', { name: /not now/i }))
    expect(screen.queryByRole('region', { name: /keep my journey on any phone/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /see my practical next step/i })).toBeInTheDocument()
  })

  it('AC2 — entering an email requests the magic link (no password)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    await user.click(screen.getByRole('button', { name: /keep my journey on any phone/i }))
    await user.type(screen.getByLabelText(/your email address/i), 'me@example.com')
    await user.click(screen.getByRole('button', { name: /email me a sign-in link/i }))
    expect(mocks.fns.sendMagicLink).toHaveBeenCalledWith('me@example.com')
    // Honest sent state — says to check email, promises nothing else.
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
  })

  it('AC2 — signing in with local answers and an empty account saves them to the account', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)
    expect(mocks.fns.saveAnswersToAccount).toHaveBeenCalledWith(
      { userId: 'user-1' },
      expect.objectContaining({ area: 'Khayelitsha' }),
    )
  })

  it('AC3 — signing in on another phone loads the saved journey (map + intro recompute)', async () => {
    const user = userEvent.setup()
    // This phone: fresh answers (different area).
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...matric, area: 'Delft' }),
    )
    mocks.state.savedAnswers = { ...matric, area: 'Mitchells Plain' }
    render(<App />)
    signInAs('user-1')
    // The cross-phone choice is offered — nothing overwritten silently.
    const choice = await screen.findByRole('region', { name: /choose which journey to keep/i })
    await user.click(screen.getByRole('button', { name: /use my saved journey/i }))
    // The saved journey is now the journey: map echoes the saved area.
    expect(screen.queryByRole('region', { name: /choose which journey to keep/i })).not.toBeInTheDocument()
    expect(screen.getByText(/mitchells plain/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
    expect(choice).toBeDefined()
  })

  it('AC3 — choosing "keep the answers from this phone" saves the local ones instead', async () => {
    const user = userEvent.setup()
    mocks.state.savedAnswers = { ...matric, area: 'Mitchells Plain' }
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByRole('region', { name: /choose which journey to keep/i })
    await user.click(screen.getByRole('button', { name: /keep the answers from this phone/i }))
    expect(screen.getByText(/khayelitsha/i)).toBeInTheDocument()
    expect(mocks.fns.saveAnswersToAccount).toHaveBeenCalledWith(
      { userId: 'user-1' },
      expect.objectContaining({ area: 'Khayelitsha' }),
    )
  })

  it('AC3 — a matching saved copy shows the plain signed-in panel, no choice', async () => {
    mocks.state.savedAnswers = { ...matric, area: 'Khayelitsha' }
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)
    expect(screen.queryByRole('region', { name: /choose which journey to keep/i })).not.toBeInTheDocument()
  })

  it('a failed saved-journey load never blocks the journey (offer degrades to signed-in state)', async () => {
    mocks.state.loadError = true
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    // Signed in, but no saved copy could be read → plain panel, no choice, no crash.
    await screen.findByText(/your journey is saved to your account/i)
    expect(screen.queryByRole('region', { name: /choose which journey to keep/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
  })

  it('AC7 — deleting asks once, then removes account, local save and returns to Question 1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)

    await user.click(screen.getByRole('button', { name: /delete my account and data/i }))
    expect(mocks.fns.deleteAccountAndData).not.toHaveBeenCalled() // one confirmation first
    await user.click(screen.getByRole('button', { name: /yes, delete everything/i }))
    await screen.findByText('Question 1 of 3')
    expect(mocks.fns.deleteAccountAndData).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('AC7 — "Keep my account" cancels the deletion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)
    await user.click(screen.getByRole('button', { name: /delete my account and data/i }))
    await user.click(screen.getByRole('button', { name: /keep my account/i }))
    expect(mocks.fns.deleteAccountAndData).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
  })

  it('sign-out leaves this phone exactly as it was — answers stay, account state clears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)

    await user.click(screen.getByRole('button', { name: /sign out of this phone/i }))
    await screen.findByRole('button', { name: /keep my journey on any phone/i })
    // US-006 AC5 still holds signed-out: the local journey is intact.
    expect(screen.getByText(/khayelitsha/i)).toBeInTheDocument()
    expect(mocks.fns.deleteAccountAndData).not.toHaveBeenCalled()
  })

  it('US-006 AC5 signed-in — "Start again" wipes only the local save, never the account', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reachTheMap(user)
    signInAs('user-1')
    await screen.findByText(/your journey is saved to your account/i)

    await user.click(screen.getByRole('button', { name: /start again/i }))
    await screen.findByText('Question 1 of 3')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    // Restart is local-only: no deletion, no sign-out call.
    expect(mocks.fns.deleteAccountAndData).not.toHaveBeenCalled()
    expect(mocks.fns.signOut).not.toHaveBeenCalled()
  })
})
