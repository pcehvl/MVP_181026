import { describe, expect, it } from 'vitest'
import { JOB_FAMILIES } from './job-families'
import { consideredFamilies, type IntakeAnswers } from './intake'
import {
  MIN_QUALIFICATION,
  matchMap,
  qualificationRank,
} from './matching'

/**
 * US-003 matching rules — the qualification decision (Product Owner,
 * 2026-10-18). Spec: product/stories/US-003-personalised-skills-map/spec.md.
 */

function answers(partial: Partial<IntakeAnswers>): IntakeAnswers {
  return {
    qualification: 'Matric (finished high school)',
    area: 'Athlone',
    selectedWork: [],
    ...partial,
  }
}

describe('qualification ranks', () => {
  it('ranks the decided options from lowest to highest requirement', () => {
    expect(qualificationRank('No schooling')).toBe(0)
    expect(qualificationRank('Matric (finished high school)')).toBe(4)
    expect(qualificationRank('Matric (finished high school)')).toBeGreaterThan(
      qualificationRank('No schooling'),
    )
  })

  it('every seeded family has a minimum level', () => {
    for (const family of JOB_FAMILIES) {
      expect(MIN_QUALIFICATION[family]).toBeDefined()
    }
  })
})

describe('matchMap', () => {
  it('qualifies every family for a matric resident (highest seeded bar is some high school)', () => {
    const match = matchMap(answers({}))
    expect(match.qualifying).toHaveLength(JOB_FAMILIES.length)
    expect(match.nearMiss).toHaveLength(0)
  })

  it('filters by minimum level: no-schooling resident qualifies only open families', () => {
    const match = matchMap(answers({ qualification: 'No schooling' }))
    // Seeded content order of the three families with min "No schooling".
    expect(match.qualifying).toEqual([
      'Cleaning',
      'Building and manual work',
      'Cooking and food work',
    ])
    expect(match.nearMiss).not.toContain('Cleaning')
    expect(match.nearMiss).toContain('Office and admin work')
  })

  it('top families are the first 3 qualifying in seeded content order (AC10)', () => {
    const match = matchMap(answers({}))
    expect(match.topFamilies).toEqual([...JOB_FAMILIES].slice(0, 3))
    expect(match.qualifyingOverflowCount).toBe(JOB_FAMILIES.length - 3)
  })

  it('honours the Q3 selection: only selected families considered', () => {
    const match = matchMap(
      answers({
        qualification: 'Finished primary school',
        selectedWork: ['Cleaning', 'Office and admin work'],
      }),
    )
    expect(match.considered).toEqual(['Cleaning', 'Office and admin work'])
    // Cleaning is open to all; Office requires some high school → near-miss.
    expect(match.topFamilies).toEqual(['Cleaning'])
    expect(match.nearMiss).toEqual(['Office and admin work'])
  })

  it('considers selection in content order, not click order (AC10)', () => {
    const considered = consideredFamilies([
      'Working with computers',
      'Cleaning',
      'Retail and shops',
    ])
    expect(considered).toEqual(['Retail and shops', 'Cleaning', 'Working with computers'])
  })

  it('near-miss overflow counts entries beyond the cap of 2 (AC9)', () => {
    const match = matchMap(
      answers({
        qualification: 'No schooling',
        selectedWork: [
          'Office and admin work',
          'Working with computers',
          'Retail and shops',
          'Driving and delivery',
        ],
      }),
    )
    // All four selected require more than no schooling.
    expect(match.nearMiss).toHaveLength(4)
    expect(match.nearMissOverflowCount).toBe(2)
    expect(match.topFamilies).toHaveLength(0)
  })

  it('produces an empty qualifying set without dropping near-misses (never a dead end)', () => {
    const match = matchMap(
      answers({ qualification: 'No schooling', selectedWork: ['Office and admin work'] }),
    )
    expect(match.topFamilies).toHaveLength(0)
    expect(match.nearMiss).toEqual(['Office and admin work'])
    expect(match.nearMissOverflowCount).toBe(0)
  })

  it('skip / Not sure on Q3 opens all families into matching (US-001 AC7)', () => {
    const match = matchMap(answers({ selectedWork: [] }))
    expect(match.considered).toHaveLength(JOB_FAMILIES.length)
  })
})
