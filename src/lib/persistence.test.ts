import { beforeEach, describe, expect, it } from 'vitest'
import type { IntakeAnswers } from './intake'
import {
  STORAGE_KEY,
  answersEqual,
  clearAnswers,
  loadAnswers,
  saveAnswers,
} from './persistence'

/**
 * US-006 AC5 — persistence contract: save, restore, wipe, degrade.
 * Spec: product/stories/US-006-end-to-end-journey/spec.md (status: ready).
 */

const answers: IntakeAnswers = {
  qualification: 'Matric (finished high school)',
  area: 'Athlone',
  selectedWork: ['Cleaning', 'Retail and shops'],
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('persistence (US-006 AC5)', () => {
  it('round-trips answers through storage', () => {
    saveAnswers(answers)
    expect(loadAnswers()).toEqual(answers)
  })

  it('returns null when nothing was saved', () => {
    expect(loadAnswers()).toBeNull()
  })

  it('Start again equivalent: clearAnswers wipes the save', () => {
    saveAnswers(answers)
    clearAnswers()
    expect(loadAnswers()).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('survives an interruption: save now, load in a fresh call', () => {
    saveAnswers({ ...answers, selectedWork: [] })
    // Simulates the tab closing and reopening — storage outlives the session.
    expect(loadAnswers()).toEqual({ ...answers, selectedWork: [] })
  })

  it('rejects corrupt JSON without throwing', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadAnswers()).toBeNull()
  })

  it('rejects wrong-shaped data and removes it (never hands garbage to the journey)', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ qualification: 42, area: null, selectedWork: 'Cleaning' }),
    )
    expect(loadAnswers()).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('tolerates a broken storage backend (private mode / disabled storage)', () => {
    const original = window.localStorage
    const boom = {
      length: 0,
      key: () => {
        throw new Error('nope')
      },
      getItem: () => {
        throw new Error('nope')
      },
      setItem: () => {
        throw new Error('nope')
      },
      removeItem: () => {
        throw new Error('nope')
      },
      clear: () => {
        throw new Error('nope')
      },
    }
    Object.defineProperty(window, 'localStorage', {
      value: boom,
      configurable: true,
    })
    try {
      expect(() => saveAnswers(answers)).not.toThrow()
      expect(loadAnswers()).toBeNull()
      expect(() => clearAnswers()).not.toThrow()
    } finally {
      Object.defineProperty(window, 'localStorage', {
        value: original,
        configurable: true,
      })
    }
  })
})

describe('answersEqual (US-007 AC3 conflict detection)', () => {
  it('treats identical answers as equal', () => {
    expect(answersEqual(answers, { ...answers })).toBe(true)
  })

  it('ignores the order work types were ticked (not meaningful to matching)', () => {
    expect(
      answersEqual(answers, {
        ...answers,
        selectedWork: [...answers.selectedWork].reverse(),
      }),
    ).toBe(true)
  })

  it('flags a different area or qualification as a conflict', () => {
    expect(answersEqual(answers, { ...answers, area: 'Delft' })).toBe(false)
    expect(
      answersEqual(answers, { ...answers, qualification: 'No schooling' }),
    ).toBe(false)
  })

  it('flags different work selections as a conflict', () => {
    expect(
      answersEqual(answers, { ...answers, selectedWork: ['Cleaning'] }),
    ).toBe(false)
  })
})
