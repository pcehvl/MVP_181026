import { describe, expect, it } from 'vitest'
import { JOB_FAMILIES } from './job-families'
import { HONEST_LABEL, SKILLS_CONTENT } from './skills-content'

/**
 * US-002 ("Trust the skills data I am shown") — content-package AC evidence.
 * Spec: product/stories/US-002-trustworthy-skills-data/spec.md (status: ready).
 */

describe('US-002 skills content package', () => {
  it('AC1 — every job family states sample status', () => {
    for (const family of JOB_FAMILIES) {
      expect(SKILLS_CONTENT[family].isSampleData).toBe(true)
    }
  })

  it('AC2 — every job family records provenance', () => {
    for (const family of JOB_FAMILIES) {
      expect(SKILLS_CONTENT[family].provenance.length).toBeGreaterThan(0)
    }
  })

  it('AC3 — covers exactly the seeded families, no more, no fewer', () => {
    expect(Object.keys(SKILLS_CONTENT).sort()).toEqual([...JOB_FAMILIES].sort())
  })

  it('AC4 — every skill carries a plain-English reason', () => {
    for (const family of JOB_FAMILIES) {
      for (const skill of SKILLS_CONTENT[family].skills) {
        expect(skill.name.length).toBeGreaterThan(0)
        expect(skill.whyItMatters.length).toBeGreaterThan(0)
      }
    }
  })

  it('every family has skills and the label is present', () => {
    for (const family of JOB_FAMILIES) {
      expect(SKILLS_CONTENT[family].skills.length).toBeGreaterThan(0)
    }
    expect(HONEST_LABEL).toMatch(/sample content/i)
  })
})
