import type { ReactNode } from 'react'
import { Info, MapPinned } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NOT_SURE, type IntakeAnswers } from '@/lib/intake'
import { LESSONS_APPROVAL } from '@/lib/lessons-content'
import { matchMap } from '@/lib/matching'
import { type JobFamily } from '@/lib/job-families'
import { CONTENT_APPROVAL, HONEST_LABEL, SKILLS_CONTENT } from '@/lib/skills-content'

/**
 * US-003 — "See my personalised skills map": the hero screen and the H1 test.
 * Spec: product/stories/US-003-personalised-skills-map/spec.md (status: ready).
 *
 * - Personalised from Q1 + Q3 only; Q2 (area) is echoed, never matched (AC1/AC7)
 * - Top 3 qualifying families in seeded content order, 6 skills each with
 *   per-skill "why this matters" from the approved US-002 content (AC3/AC10/AC11)
 * - Near-misses in their own section, ≤2 entries + honest count line (AC8/AC9)
 * - Sample-data notice + per-family provenance stay visible (US-002 AC5/AC6)
 * - Skills text renders only while CONTENT_APPROVAL is approved (US-002 gate)
 * - US-004: each shown skill links to its sample lessons; while the lessons
 *   gate is pending no links render and an honest note says why (AC6)
 */
export function SkillsMap({
  answers,
  onRestart,
  onOpenLesson,
  onOpenNextStep,
  accountSection,
}: {
  answers: IntakeAnswers
  onRestart: () => void
  /** US-004: opens a skill's sample lessons. Omit to render the map without lesson entry points. */
  onOpenLesson?: (family: JobFamily, skillName: string) => void
  /** US-005: opens the journey's closing practical step. Omit to hide it. */
  onOpenNextStep?: () => void
  /**
   * US-007: optional account section (sign-in offer / signed-in panel / saved
   * journey choice) rendered after the journey content. Omit to render the
   * map exactly as the signed-out US-006 build (AC1).
   */
  accountSection?: ReactNode
}) {
  const match = matchMap(answers)
  const skippedOrNotSure =
    answers.selectedWork.length === 0 || answers.selectedWork.includes(NOT_SURE)
  const skillsApproved = CONTENT_APPROVAL.status === 'approved'
  const lessonsApproved = LESSONS_APPROVAL.status === 'approved'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPinned className="size-4" aria-hidden="true" />
        <span className="text-sm font-medium">Your skills map</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Work we will look at with you
      </h1>

      <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{HONEST_LABEL}</span>
      </p>

      <p className="text-sm text-muted-foreground">
        Based on your answers: <strong>{answers.qualification}</strong>,{' '}
        <strong>{answers.area}</strong>
        {skippedOrNotSure ? (
          <> — since you were not sure, we look at all work types.</>
        ) : null}
      </p>

      {match.topFamilies.length > 0 ? (
        <>
          {match.qualifyingOverflowCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              Showing 3 of {match.qualifying.length} kinds of work that fit your
              answers.
            </p>
          ) : null}

          <ul className="flex flex-col gap-3">
            {match.topFamilies.map((family) => (
              <li key={family} className="rounded-lg border border-border p-3">
                <span className="text-base font-medium">{family}</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Where this came from: {SKILLS_CONTENT[family].provenance}
                </p>
                {skillsApproved ? (
                  <ul className="mt-2 flex flex-col gap-1.5 border-t border-border pt-2">
                    {SKILLS_CONTENT[family].skills.map((skill) => (
                      <li key={skill.name} className="text-sm">
                        <span className="font-medium">{skill.name}.</span>{' '}
                        <span className="text-muted-foreground">
                          {skill.whyItMatters}
                        </span>
                        {lessonsApproved && onOpenLesson ? (
                          <button
                            type="button"
                            className="mt-1 block text-sm font-medium text-foreground underline underline-offset-2"
                            onClick={() => onOpenLesson(family, skill.name)}
                          >
                            Try a sample lesson
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 border-t border-border pt-2 text-sm text-muted-foreground">
                    Skills for this work type are being checked and will appear
                    here once approved.
                  </p>
                )}
              </li>
            ))}
          </ul>

          {!lessonsApproved ? (
            <p className="text-sm text-muted-foreground">
              Sample lessons are being checked and will appear on each skill
              once approved.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-lg border border-border p-3 text-sm">
          None of the work types you chose fit your answers yet — here is what
          is close.
        </p>
      )}

      {match.nearMiss.length > 0 ? (
        <section aria-labelledby="near-miss-heading" className="flex flex-col gap-2">
          <h2 id="near-miss-heading" className="text-lg font-semibold">
            Close, but not yet
          </h2>
          {match.nearMiss.slice(0, 2).map((family) => (
            <p key={family} className="text-sm text-muted-foreground">
              <strong>{family}</strong> — most employers here ask for more
              schooling than your answers show. With more schooling this could
              open up for you.
            </p>
          ))}
          {match.nearMissOverflowCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              {match.nearMissOverflowCount} more of your choices don&apos;t
              match yet.
            </p>
          ) : null}
        </section>
      ) : null}

      {onOpenNextStep ? (
        <section
          aria-labelledby="next-step-heading"
          className="rounded-lg border border-border bg-muted/50 p-4"
        >
          <h2 id="next-step-heading" className="text-lg font-semibold">
            Ready for your next step?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Take one practical step towards work — it takes a few minutes.
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-3 w-full"
            onClick={onOpenNextStep}
          >
            See my practical next step
          </Button>
        </section>
      ) : null}

      {accountSection}

      <Button type="button" variant="outline" size="lg" onClick={onRestart}>
        Start again
      </Button>
    </main>
  )
}
