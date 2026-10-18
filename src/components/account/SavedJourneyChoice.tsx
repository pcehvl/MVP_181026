import { Button } from '@/components/ui/button'
import type { IntakeAnswers } from '@/lib/intake'

/**
 * US-007 AC3 — when a resident signs in and BOTH a saved journey (their
 * account) and fresh answers (this phone) exist, they choose which one
 * continues. Nothing is overwritten silently; either choice loses nothing.
 */
export function SavedJourneyChoice({
  savedAnswers,
  localAnswers,
  onUseSaved,
  onUseLocal,
}: {
  savedAnswers: IntakeAnswers
  localAnswers: IntakeAnswers
  onUseSaved: (saved: IntakeAnswers) => void
  onUseLocal: () => void
}) {
  return (
    <section
      aria-label="Choose which journey to keep"
      className="flex flex-col gap-3 rounded-lg border border-border p-4"
    >
      <div>
        <h2 className="text-base font-semibold">You have a saved journey</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account has a journey saved earlier (area:{' '}
          <strong>{savedAnswers.area}</strong>). This phone has answers you
          gave here (area: <strong>{localAnswers.area}</strong>). Which one do
          you want to keep?
        </p>
      </div>
      <Button type="button" size="lg" onClick={() => onUseSaved(savedAnswers)}>
        Use my saved journey
      </Button>
      <Button type="button" variant="outline" size="lg" onClick={onUseLocal}>
        Keep the answers from this phone
      </Button>
    </section>
  )
}
