import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JOB_FAMILIES } from '@/lib/job-families'
import {
  AREA_SUGGESTIONS,
  NOT_SURE,
  QUALIFICATION_OPTIONS,
  type IntakeAnswers,
  type Qualification,
} from '@/lib/intake'

/**
 * US-001 — the three-question intake.
 *
 * Behaviour is pinned by product/stories/US-001-situation-questions/spec.md:
 * exactly three questions in order (AC5); Q1 and Q2 required, Q3 optional with
 * "Not sure" behaving like a skip (AC6/AC7); plain language (AC2); completable
 * on a phone without zooming (AC3).
 *
 * UX choice (implementation, not product scope): one question per screen with
 * a "Question X of 3" indicator — lowest cognitive load for residents with
 * varied education levels, and native radio/checkbox inputs keep the flow
 * accessible and testable by label.
 */
const STEPS = ['qualification', 'area', 'work'] as const
type Step = (typeof STEPS)[number]

interface IntakeFlowProps {
  onComplete: (answers: IntakeAnswers) => void
}

export function IntakeFlow({ onComplete }: IntakeFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const step: Step = STEPS[stepIndex]

  const [qualification, setQualification] = useState<Qualification | null>(null)
  const [area, setArea] = useState('')
  const [selectedWork, setSelectedWork] = useState<string[]>([])

  const canContinue = step === 'qualification' ? qualification !== null : step === 'area' ? area.trim().length > 0 : true

  function goBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  function goNext() {
    if (!canContinue) return
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }
    onComplete({
      qualification: qualification as Qualification,
      area: area.trim(),
      selectedWork,
    })
  }

  function toggleWork(option: string) {
    if (option === NOT_SURE) {
      setSelectedWork((current) => (current.includes(NOT_SURE) ? [] : [NOT_SURE]))
      return
    }
    setSelectedWork((current) => {
      const withoutNotSure = current.filter((item) => item !== NOT_SURE)
      return withoutNotSure.includes(option)
        ? withoutNotSure.filter((item) => item !== option)
        : [...withoutNotSure, option]
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 p-6">
      <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
        Question {stepIndex + 1} of {STEPS.length}
      </p>

      {step === 'qualification' && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-2xl font-semibold tracking-tight">
            What is the highest school qualification you have?
          </legend>
          <p className="text-sm text-muted-foreground">Please choose one answer.</p>
          <div className="flex flex-col gap-2">
            {QUALIFICATION_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-base has-checked:border-primary has-checked:bg-primary/5"
              >
                <input
                  type="radio"
                  name="qualification"
                  className="size-5 shrink-0 accent-primary"
                  checked={qualification === option}
                  onChange={() => setQualification(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 'area' && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-2xl font-semibold tracking-tight">
            Which area do you live in?
          </legend>
          <p className="text-sm text-muted-foreground">
            Type your area. You can pick a suggestion or write your own.
          </p>
          <input
            type="text"
            className="min-h-12 w-full rounded-lg border border-border bg-background p-3 text-base"
            value={area}
            list="area-suggestions"
            aria-label="Your area"
            placeholder="For example: Khayelitsha"
            onChange={(event) => setArea(event.target.value)}
          />
          <datalist id="area-suggestions">
            {AREA_SUGGESTIONS.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </fieldset>
      )}

      {step === 'work' && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-2xl font-semibold tracking-tight">
            Which kind of work are you interested in, or have you done before?
          </legend>
          <p className="text-sm text-muted-foreground">
            Choose as many as you like, choose “Not sure”, or skip this question.
          </p>
          <div className="flex flex-col gap-2">
            {[...JOB_FAMILIES, NOT_SURE].map((option) => (
              <label
                key={option}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-base has-checked:border-primary has-checked:bg-primary/5"
              >
                <input
                  type="checkbox"
                  name="work"
                  className="size-5 shrink-0 accent-primary"
                  checked={selectedWork.includes(option)}
                  onChange={() => toggleWork(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-auto flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="lg" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeft aria-hidden="true" data-icon="inline-start" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={goNext} disabled={!canContinue}>
          {stepIndex === STEPS.length - 1 ? 'Show my skills map' : 'Next'}
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
    </main>
  )
}
