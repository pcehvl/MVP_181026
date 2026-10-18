import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LessonsView } from './LessonsView'
import { LESSONS } from '@/lib/lessons-content'
import { SKILLS_CONTENT } from '@/lib/skills-content'

/**
 * US-004 ("Try short sample lessons for a skill") — AC evidence.
 * Spec: product/stories/US-004-sample-lessons/spec.md (status: ready).
 *
 * The real lessons-content module ships with the gate pending (AC6); tests
 * that need lesson text mock the module as approved (US-002 test pattern).
 */

const FAMILY = 'Retail and shops' as const
const SKILL = SKILLS_CONTENT[FAMILY].skills[0].name // Serving customers kindly

afterEach(() => {
  cleanup()
  vi.doUnmock('@/lib/lessons-content')
  vi.resetModules()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).speechSynthesis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).SpeechSynthesisUtterance
})

async function renderApprovedView(onBack = () => {}) {
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
  const { LessonsView: ApprovedView } = await import('./LessonsView')
  render(<ApprovedView family={FAMILY} skillName={SKILL} onBack={onBack} />)
}

describe('US-004 sample lessons', () => {
  it('AC6 — while the gate is pending, no lesson text and no titles are shown', async () => {
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
    const { LessonsView: PendingView } = await import('./LessonsView')
    render(<PendingView family={FAMILY} skillName={SKILL} onBack={() => {}} />)
    expect(
      screen.getByText(/sample lessons are being checked/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: /what this looks at work/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(LESSONS[FAMILY][SKILL].explainer),
    ).not.toBeInTheDocument()
    // Context stays visible so the screen is never a dead end (AC6 + UX note).
    expect(screen.getByRole('heading', { name: SKILL })).toBeInTheDocument()
    expect(screen.getByText(/belongs to/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /back to my skills map/i }),
    ).toBeInTheDocument()
    vi.doUnmock('@/lib/lessons-content')
    vi.resetModules()
  })

  it('AC1/AC2 — approved: both lessons with template titles and short bodies', async () => {
    await renderApprovedView()
    expect(
      screen.getByRole('region', { name: /what this looks at work/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /try this/i })).toBeInTheDocument()
    expect(
      screen.getByText(LESSONS[FAMILY][SKILL].explainer),
    ).toBeInTheDocument()
    expect(screen.getByText(LESSONS[FAMILY][SKILL].practice)).toBeInTheDocument()
  })

  it('UX note — shows which skill and which jobs it belongs to', async () => {
    await renderApprovedView()
    expect(screen.getByRole('heading', { name: SKILL })).toBeInTheDocument()
    expect(screen.getByText(FAMILY)).toBeInTheDocument()
  })

  it('AC4 — no media elements anywhere on the lesson screen', async () => {
    const { container } = render(<LessonsView family={FAMILY} skillName={SKILL} onBack={() => {}} />)
    expect(container.querySelector('img, video, audio')).toBeNull()
  })

  it('AC5 fallback — where speech is unsupported, no button and full text', async () => {
    await renderApprovedView()
    expect(
      screen.queryByRole('button', { name: /read aloud/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(LESSONS[FAMILY][SKILL].explainer),
    ).toBeInTheDocument()
  })

  it('AC5 — where supported, read-aloud speaks the lesson and can be stopped', async () => {
    const speak = vi.fn()
    const cancel = vi.fn()
    class FakeUtterance {
      text: string
      onend: (() => void) | null = null
      constructor(text: string) {
        this.text = text
      }
    }
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak, cancel },
      configurable: true,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).SpeechSynthesisUtterance = FakeUtterance

    await renderApprovedView()
    const readButtons = screen.getAllByRole('button', { name: /read aloud/i })
    expect(readButtons).toHaveLength(2)

    await userEvent.click(readButtons[0])
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0][0].text).toBe(LESSONS[FAMILY][SKILL].explainer)
    expect(
      screen.getByRole('button', { name: /stop reading/i }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /stop reading/i }))
    expect(cancel).toHaveBeenCalled()
    expect(
      screen.getAllByRole('button', { name: /read aloud/i }),
    ).toHaveLength(2)
  })

  it('AC5 — leaving the screen stops any speech', async () => {
    const cancel = vi.fn()
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: vi.fn(), cancel },
      configurable: true,
    })
    class FakeUtterance {
      text: string
      onend: (() => void) | null = null
      constructor(text: string) {
        this.text = text
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).SpeechSynthesisUtterance = FakeUtterance

    const { unmount } = render(<LessonsView family={FAMILY} skillName={SKILL} onBack={() => {}} />)
    unmount()
    expect(cancel).toHaveBeenCalled()
  })

  it('navigates back via the map button', async () => {
    const onBack = vi.fn()
    render(<LessonsView family={FAMILY} skillName={SKILL} onBack={onBack} />)
    await userEvent.click(
      screen.getByRole('button', { name: /back to my skills map/i }),
    )
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
