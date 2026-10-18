import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SkillsMap } from './SkillsMap'
import { HONEST_LABEL, SKILLS_CONTENT } from '@/lib/skills-content'
import type { IntakeAnswers } from '@/lib/intake'

/**
 * US-003 ("See my personalised skills map") — AC evidence, plus US-002's
 * honesty surface as it renders on the map (US-002 AC5/AC6).
 * Specs: product/stories/US-003-personalised-skills-map/spec.md,
 *        product/stories/US-002-trustworthy-skills-data/spec.md (ready).
 */

afterEach(() => {
  cleanup()
  vi.doUnmock('@/lib/skills-content')
  vi.doUnmock('@/lib/lessons-content')
  vi.resetModules()
})

const matric: IntakeAnswers = {
  qualification: 'Matric (finished high school)',
  area: 'Athlone',
  selectedWork: [], // skip → all families considered
}

describe('US-003 personalised skills map', () => {
  it('AC1 — different answers change what is shown', () => {
    const { unmount } = render(<SkillsMap answers={matric} onRestart={() => {}} />)
    // Matric → all 9 qualify; top 3 shown with the honest count line.
    expect(screen.getByText(/showing 3 of 9 kinds of work/i)).toBeInTheDocument()
    expect(screen.getByText('Retail and shops')).toBeInTheDocument()
    unmount()

    render(
      <SkillsMap
        answers={{ ...matric, qualification: 'No schooling' }}
        onRestart={() => {}}
      />,
    )
    // No schooling → only the 3 open families qualify (no count line) and
    // 6 near-misses produce their own count line. Different answers, different map.
    expect(screen.queryByText(/showing 3 of 9 kinds of work/i)).not.toBeInTheDocument()
    expect(screen.getByText(/4 more of your choices don/i)).toBeInTheDocument()
    const qualifyingFirst = screen
      .getAllByRole('listitem')
      .filter((item) => item.querySelector('ul') !== null)[0]
    expect(qualifyingFirst).toHaveTextContent('Cleaning')
  })

  it('AC2/AC3/AC11 — each shown family lists 6 skills with why-this-matters', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    const firstFamily = screen
      .getByText('Retail and shops')
      .closest('li') as HTMLElement
    const skills = within(firstFamily).getAllByRole('listitem')
    expect(skills).toHaveLength(6)
    expect(within(firstFamily).getByText(/mistakes at the till/i)).toBeInTheDocument()
  })

  it('AC5/US-002 — sample-data notice visible', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    expect(screen.getByText(HONEST_LABEL)).toBeInTheDocument()
  })

  it('US-002 AC6 — provenance shown per rendered family', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    // Top 3 only → 3 provenance lines.
    expect(screen.getAllByText(/where this came from/i)).toHaveLength(3)
  })

  it('AC7 — area is echoed but never used for matching', () => {
    const { unmount } = render(
      <SkillsMap answers={{ ...matric, area: 'Khayelitsha' }} onRestart={() => {}} />,
    )
    expect(screen.getByText(/khayelitsha/i)).toBeInTheDocument()
    const khayelitshaFamilies = screen
      .getAllByRole('listitem')
      .filter((item) => item.querySelector('ul') !== null)
      .map((el) => el.textContent)
    unmount()

    render(
      <SkillsMap answers={{ ...matric, area: 'Athlone' }} onRestart={() => {}} />,
    )
    expect(screen.getByText(/athlone/i)).toBeInTheDocument()
    // Same qualifying families regardless of area — display only (AC7).
    expect(
      screen
        .getAllByRole('listitem')
        .filter((item) => item.querySelector('ul') !== null)
        .map((el) => el.textContent),
    ).toEqual(khayelitshaFamilies)
  })

  it('AC10 — top 3 qualifying families in seeded content order, with count line', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    expect(screen.getByText(/showing 3 of 9 kinds of work/i)).toBeInTheDocument()
    const sections = screen.getAllByRole('listitem').filter(
      (item) => item.querySelector('ul') !== null,
    )
    expect(sections).toHaveLength(3)
    // Families inside the top-3 list follow seeded content order.
    expect(sections[0]).toHaveTextContent('Retail and shops')
    expect(sections[1]).toHaveTextContent('Cleaning')
    expect(sections[2]).toHaveTextContent('Building and manual work')
    expect(screen.queryByText('Office and admin work')).not.toBeInTheDocument()
  })

  it('AC8/AC9 — near-misses in their own section, capped at 2 with count line', () => {
    render(
      <SkillsMap
        answers={{
          qualification: 'No schooling',
          area: 'Delft',
          selectedWork: [
            'Office and admin work',
            'Working with computers',
            'Retail and shops',
            'Driving and delivery',
          ],
        }}
        onRestart={() => {}}
      />,
    )
    const section = screen.getByRole('region', { name: /close, but not yet/i })
    // Near-misses render in seeded content order: Retail(0), Office(3),
    // Driving(4), Computers(7) → first 2 shown, count line for the rest.
    expect(within(section).getByText('Retail and shops')).toBeInTheDocument()
    expect(within(section).getByText('Office and admin work')).toBeInTheDocument()
    expect(within(section).queryByText('Driving and delivery')).not.toBeInTheDocument()
    expect(within(section).getByText(/2 more of your choices don/i)).toBeInTheDocument()
    // Not mixed with qualifying sections (none qualify here).
    expect(screen.getByText(/none of the work types you chose fit/i)).toBeInTheDocument()
  })

  it('area-independent honesty: skills carry the approved reasons on the map', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    expect(
      screen.getByText(SKILLS_CONTENT['Cleaning'].skills[0].whyItMatters),
    ).toBeInTheDocument()
  })

  it('keeps the US-001 skip echo line', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    expect(
      screen.getByText(/since you were not sure, we look at all work types/i),
    ).toBeInTheDocument()
  })

  it('hides skills text while the content gate is pending', async () => {
    vi.resetModules()
    vi.doMock('@/lib/skills-content', async (importOriginal) => {
      const actual =
        await importOriginal<typeof import('@/lib/skills-content')>()
      return {
        ...actual,
        CONTENT_APPROVAL: {
          status: 'pending-po-review' as const,
          approvedBy: null,
          approvedOn: null,
        },
      }
    })
    const { SkillsMap: PendingMap } = await import('./SkillsMap')
    render(<PendingMap answers={matric} onRestart={() => {}} />)
    expect(screen.queryByText(/serving customers kindly/i)).not.toBeInTheDocument()
    expect(
      screen.getAllByText(/being checked and will appear here once approved/i),
    ).toHaveLength(3)
    vi.doUnmock('@/lib/skills-content')
    vi.resetModules()
  })

  it('US-004 AC6 — no lesson links while the lessons gate is pending; honest note shown', async () => {
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
    const { SkillsMap: MapPendingLessons } = await import('./SkillsMap')
    render(<MapPendingLessons answers={matric} onRestart={() => {}} />)
    expect(
      screen.getByText(/sample lessons are being checked/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /try a sample lesson/i }),
    ).not.toBeInTheDocument()
    vi.doUnmock('@/lib/lessons-content')
    vi.resetModules()
  })

  it('US-004 — every shown skill links to its lessons once approved', async () => {
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
    const { SkillsMap: MapWithLessons } = await import('./SkillsMap')
    const onOpenLesson = vi.fn()
    render(
      <MapWithLessons
        answers={matric}
        onRestart={() => {}}
        onOpenLesson={onOpenLesson}
      />,
    )
    // Top 3 families × 6 skills (AC10 × US-002 coverage).
    const links = screen.getAllByRole('button', { name: /try a sample lesson/i })
    expect(links).toHaveLength(18)
    await userEvent.click(links[0])
    expect(onOpenLesson).toHaveBeenCalledWith(
      'Retail and shops',
      'Serving customers kindly',
    )
    vi.doUnmock('@/lib/lessons-content')
    vi.resetModules()
  })

  it('US-005 — offers the closing next step when a handler is present', async () => {
    const onOpenNextStep = vi.fn()
    render(
      <SkillsMap
        answers={matric}
        onRestart={() => {}}
        onOpenNextStep={onOpenNextStep}
      />,
    )
    expect(
      screen.getByRole('heading', { name: /ready for your next step/i }),
    ).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: /see my practical next step/i }),
    )
    expect(onOpenNextStep).toHaveBeenCalledTimes(1)
  })

  it('US-005 — hides the closing offer when no handler is provided', () => {
    render(<SkillsMap answers={matric} onRestart={() => {}} />)
    expect(
      screen.queryByRole('button', { name: /see my practical next step/i }),
    ).not.toBeInTheDocument()
  })
})
