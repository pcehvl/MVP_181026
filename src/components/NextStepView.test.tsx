import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NextStepView } from './NextStepView'
import type { IntakeAnswers } from '@/lib/intake'

/**
 * US-005 ("Take one practical next step") — AC evidence.
 * Spec: product/stories/US-005-practical-next-step/spec.md (status: ready).
 */

afterEach(cleanup)

const matric: IntakeAnswers = {
  qualification: 'Matric (finished high school)',
  area: 'Khayelitsha',
  selectedWork: [], // skip → all families considered
}

describe('US-005 practical next step', () => {
  it('AC1 — offers exactly one step: the 3-sentence introduction', () => {
    render(<NextStepView answers={matric} onRestart={() => {}} />)
    expect(
      screen.getByRole('heading', { name: /3-sentence introduction/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/my name is/i)).toBeInTheDocument()
    expect(screen.getByText(/looking for work in/i)).toBeInTheDocument()
    expect(screen.getByText(/learning skills like/i)).toBeInTheDocument()
  })

  it('AC3 — states how and why in plain English', () => {
    render(<NextStepView answers={matric} onRestart={() => {}} />)
    expect(
      screen.getByText(/write these three sentences on a paper or in your phone notes/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/read them out loud once/i)).toBeInTheDocument()
    expect(screen.getByText(/tell me about yourself/i)).toBeInTheDocument()
    expect(
      screen.getByText(/first step from learning towards work/i),
    ).toBeInTheDocument()
  })

  it('AC5 — pre-fills from the map: top family + its first two skills', () => {
    render(<NextStepView answers={matric} onRestart={() => {}} />)
    // Matric + skip → first top-3 family in seeded order is Retail and shops.
    expect(screen.getByText('Retail and shops')).toBeInTheDocument()
    expect(
      screen.getByText('Serving customers kindly'),
    ).toBeInTheDocument()
    expect(screen.getByText('Handling cash and change')).toBeInTheDocument()
  })

  it('AC5 — a near-miss-only map still offers a step from their selection', () => {
    render(
      <NextStepView
        answers={{
          qualification: 'No schooling',
          area: 'Delft',
          selectedWork: ['Office and admin work'],
        }}
        onRestart={() => {}}
      />,
    )
    // No family qualifies; fall back to the first considered family.
    expect(screen.getByText('Office and admin work')).toBeInTheDocument()
    expect(
      screen.getByText('Typing and using a keyboard'),
    ).toBeInTheDocument()
    expect(screen.getByText('Filing and organising')).toBeInTheDocument()
  })

  it('echoes their own area in sentence 1 (display only, like US-003)', () => {
    render(
      <NextStepView answers={{ ...matric, area: 'Mitchells Plain' }} onRestart={() => {}} />,
    )
    expect(screen.getByText(/mitchells plain/i)).toBeInTheDocument()
  })

  it('AC2 / decision 3 — self-contained: no links, no forms, nothing applied for', () => {
    const { container } = render(<NextStepView answers={matric} onRestart={() => {}} />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('input, textarea, select')).toBeNull()
  })

  it('decision 4 — the journey ends here: only "Start again", nothing to submit', async () => {
    const onRestart = vi.fn()
    render(<NextStepView answers={matric} onRestart={onRestart} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent(/start again/i)
    await userEvent.click(buttons[0])
    expect(onRestart).toHaveBeenCalledTimes(1)
  })
})
