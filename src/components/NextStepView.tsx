import type { ReactNode } from 'react'
import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IntakeAnswers } from '@/lib/intake'
import { matchMap } from '@/lib/matching'
import { SKILLS_CONTENT } from '@/lib/skills-content'

/**
 * US-005 — "Take one practical next step" (the journey's closing moment).
 * Spec: product/stories/US-005-practical-next-step/spec.md (status: ready).
 *
 * - The step is exactly the decided 3-sentence work introduction (AC1):
 *   written on paper/phone notes, then said out loud once
 * - What / how / why all on one screen in plain English (AC3)
 * - Pre-filled from the map session data: top family (or first considered
 *   family when nothing qualifies) + its first two skills (AC5); the area
 *   answer is echoed in sentence 1 only (display, consistent with US-003)
 * - Self-contained: no external services named, no links (decision 3)
 * - Journey ending: only "Start again"; no completion control, nothing
 *   stored or tracked (decision 4)
 *
 * NOTE: the wording on this screen is team-drafted and awaiting the Product
 * Owner's approval at preview (US-003 wording-gate pattern).
 */
export function NextStepView({
  answers,
  onRestart,
  accountSection,
}: {
  answers: IntakeAnswers
  onRestart: () => void
  /**
   * US-007: optional account section (the main sign-in invitation) rendered
   * after the step. Omit to render the screen exactly as the signed-out
   * US-006 build (AC1).
   */
  accountSection?: ReactNode
}) {
  const match = matchMap(answers)
  // AC5: top qualifying family; when none qualifies (near-miss-only map),
  // fall back to the first considered family so the step stays theirs.
  const family = match.topFamilies[0] ?? match.considered[0]
  const suggestedSkills = SKILLS_CONTENT[family].skills
    .slice(0, 2)
    .map((skill) => skill.name)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Flag className="size-4" aria-hidden="true" />
        <span className="text-sm font-medium">Your next step</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Say your 3-sentence introduction
      </h1>

      <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
        Employers and people you meet often ask: &ldquo;Tell me about
        yourself.&rdquo; With three short sentences ready, you can answer
        well. This is your first step from learning towards work.
      </p>

      <p className="text-sm">
        <strong>How:</strong> Write these three sentences on a paper or in
        your phone notes. Then read them out loud once.
      </p>

      <ol className="flex flex-col gap-3">
        <li className="rounded-lg border border-border p-3 text-sm">
          <span className="font-medium">1.</span> My name is _______. I live
          in <strong>{answers.area}</strong>.
        </li>
        <li className="rounded-lg border border-border p-3 text-sm">
          <span className="font-medium">2.</span> I am looking for work in{' '}
          <strong>{family}</strong>.
        </li>
        <li className="rounded-lg border border-border p-3 text-sm">
          <span className="font-medium">3.</span> I am learning skills like{' '}
          <strong>{suggestedSkills[0]}</strong> and{' '}
          <strong>{suggestedSkills[1]}</strong>.
        </li>
      </ol>

      {accountSection}

      <Button type="button" variant="outline" size="lg" onClick={onRestart}>
        Start again
      </Button>
    </main>
  )
}
