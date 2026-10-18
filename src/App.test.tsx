import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { STORAGE_KEY } from '@/lib/persistence'

/**
 * US-001 ("Answer a few questions about my situation") — AC evidence.
 * Spec: product/stories/US-001-situation-questions/spec.md (status: ready).
 * US-004 journey evidence (map → lessons → back) is in the last describe.
 */

// Vitest runs without globals, so RTL's automatic cleanup is not registered;
// without this, the DOM accumulates across tests and queries match twice.
// localStorage is also cleared between tests (US-006): a saved journey from
// one test would otherwise restore the next test straight to the map.
beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.doUnmock('@/lib/lessons-content')
  vi.resetModules()
})

async function answerQualification(user: ReturnType<typeof userEvent.setup>, option: RegExp) {
  await user.click(screen.getByRole('radio', { name: option }))
}

async function answerArea(user: ReturnType<typeof userEvent.setup>, area: string) {
  await user.type(screen.getByLabelText('Your area'), area)
}

async function goToWorkQuestion(user: ReturnType<typeof userEvent.setup>) {
  await answerQualification(user, /matric/i)
  await user.click(screen.getByRole('button', { name: /next/i }))
  await answerArea(user, 'Khayelitsha')
  await user.click(screen.getByRole('button', { name: /next/i }))
}

describe('US-001 intake', () => {
  it('asks exactly the three decided questions in order (AC5)', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: /highest school qualification/i }),
    ).toBeInTheDocument()

    await answerQualification(user, /no schooling/i)
    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Question 2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /which area do you live in/i })).toBeInTheDocument()

    await answerArea(user, 'Delft')
    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Question 3 of 3')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /which kind of work/i })).toBeInTheDocument()
  })

  it('blocks progress until Q1 and Q2 are answered, but never blocks on Q3 (AC6)', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Q1 required: Next is disabled with no answer.
    const next = screen.getByRole('button', { name: /next/i })
    expect(next).toBeDisabled()

    await answerQualification(user, /some high school/i)
    expect(next).toBeEnabled()
    await user.click(next)

    // Q2 required: Next is disabled while the area is empty.
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()

    await answerArea(user, 'Mitchells Plain')
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Q3 optional: Next is enabled with nothing selected (a skip).
    expect(screen.getByRole('button', { name: /show my skills map/i })).toBeEnabled()
  })

  it('shows only the chosen work types on the map', async () => {
    const user = userEvent.setup()
    render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('checkbox', { name: /cleaning/i }))
    await user.click(screen.getByRole('checkbox', { name: /cooking and food work/i }))
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
    expect(screen.getByText('Cleaning')).toBeInTheDocument()
    expect(screen.getByText('Cooking and food work')).toBeInTheDocument()
    expect(screen.queryByText('Driving and delivery')).not.toBeInTheDocument()
  })

  it('skipping Q3 considers all work types, like “Not sure” (AC7)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await goToWorkQuestion(user)
    // No selection at all — skip.
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    expect(screen.getByText(/since you were not sure, we look at all work types/i)).toBeInTheDocument()
    // All 9 families considered: all qualify for Matric → US-003's count line
    // proves the full set entered matching, and a top-3 family is shown.
    expect(screen.getByText(/showing 3 of 9 kinds of work/i)).toBeInTheDocument()
    expect(screen.getByText('Retail and shops')).toBeInTheDocument()
  })

  it('choosing “Not sure” on Q3 considers all work types (AC7)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('checkbox', { name: /not sure/i }))
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    expect(screen.getByText(/since you were not sure, we look at all work types/i)).toBeInTheDocument()
    expect(screen.getByText(/showing 3 of 9 kinds of work/i)).toBeInTheDocument()
    expect(screen.getByText('Cleaning')).toBeInTheDocument()
  })

  it('keeps answers in the session only — restarting begins the intake again', async () => {
    const user = userEvent.setup()
    render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))
    await user.click(screen.getByRole('button', { name: /start again/i }))

    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
  })
})

describe('US-004 journey (map → lessons → back)', () => {
  it('AC6 — while the lessons gate is pending, the map links nothing and says why', async () => {
    vi.resetModules()
    vi.doMock('@/lib/lessons-content', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@/lib/lessons-content')>()
      return {
        ...actual,
        LESSONS_APPROVAL: {
          status: 'pending-po-review',
          approvedBy: null,
          approvedOn: null,
        },
      }
    })
    const { default: AppPendingLessons } = await import('./App')
    const user = userEvent.setup()
    render(<AppPendingLessons />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    expect(screen.getByText(/sample lessons are being checked/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /try a sample lesson/i }),
    ).not.toBeInTheDocument()
    vi.doUnmock('@/lib/lessons-content')
    vi.resetModules()
  })

  it('journey — once approved: intake → map → skill lessons → back to map', async () => {
    vi.resetModules()
    vi.doMock('@/lib/lessons-content', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@/lib/lessons-content')>()
      return {
        ...actual,
        LESSONS_APPROVAL: {
          status: 'approved',
          approvedBy: 'Product Owner',
          approvedOn: '2026-10-18',
        },
      }
    })
    const { default: AppWithLessons } = await import('./App')
    const user = userEvent.setup()
    render(<AppWithLessons />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    // First skill of the first top-3 family (seeded content order).
    await user.click(screen.getAllByRole('button', { name: /try a sample lesson/i })[0])
    expect(screen.getByRole('heading', { name: 'Serving customers kindly' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /what this looks at work/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /try this/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back to my skills map/i }))
    expect(screen.getByRole('heading', { name: /work we will look at with you/i })).toBeInTheDocument()
  })
})

describe('US-005 journey (map → practical step → start again)', () => {
  it('journey — intake → map → next step screen → restart begins the intake again', async () => {
    const user = userEvent.setup()
    render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))
    await user.click(
      screen.getByRole('button', { name: /see my practical next step/i }),
    )

    expect(
      screen.getByRole('heading', { name: /3-sentence introduction/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Retail and shops')).toBeInTheDocument()
    expect(screen.getByText(/khayelitsha/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start again/i }))
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
  })
})

describe('US-006 persistence (on-device, localStorage)', () => {
  it('AC5 — reaching the map saves the answers; a fresh load resumes there', async () => {
    const user = userEvent.setup()
    const first = render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))

    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('Khayelitsha')
    first.unmount()

    // A fresh mount (tab reopened after battery dies / data drops) resumes.
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /work we will look at with you/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/since you were not sure/i)).toBeInTheDocument()
  })

  it('AC5 — Start again wipes the save; a fresh load begins at Question 1', async () => {
    const user = userEvent.setup()
    const first = render(<App />)

    await goToWorkQuestion(user)
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))
    await user.click(screen.getByRole('button', { name: /start again/i }))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    first.unmount()

    render(<App />)
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
  })

  it('AC2 — a resumed journey carries the same answers (area echoed on the map)', async () => {
    const user = userEvent.setup()
    const first = render(<App />)

    await goToWorkQuestion(user) // Matric + Khayelitsha + skip Q3
    await user.click(screen.getByRole('button', { name: /show my skills map/i }))
    first.unmount()

    render(<App />)
    expect(screen.getByText(/khayelitsha/i)).toBeInTheDocument()
  })
})
