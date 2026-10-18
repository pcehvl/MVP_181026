import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LESSONS, LESSONS_APPROVAL } from '@/lib/lessons-content'
import { JOB_FAMILIES, type JobFamily } from '@/lib/job-families'
import { SKILLS_CONTENT } from '@/lib/skills-content'

/**
 * US-004 — "Try short sample lessons for a skill".
 * Spec: product/stories/US-004-sample-lessons/spec.md (status: ready).
 *
 * - Reached from a skill in the map (US-003); shows which skill and which
 *   jobs it belongs to (spec UX note)
 * - Exactly 2 micro-lessons per skill: explainer + "Try this" (AC1)
 * - Text-first, no media (AC4); "Read aloud" uses the phone's built-in
 *   voice (Web Speech API, zero data); where unsupported, no button and the
 *   text stays fully usable (AC5)
 * - AC6 gate: lesson text renders only while LESSONS_APPROVAL is approved
 */

const LESSON_TITLES = {
  explainer: 'What this looks at work',
  practice: 'Try this',
} as const

type LessonKind = keyof typeof LESSON_TITLES

/** AC5 fallback: no button, no speech calls, text fully usable. */
function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

export function LessonsView({
  family,
  skillName,
  onBack,
}: {
  family: JobFamily
  skillName: string
  onBack: () => void
}) {
  const approved = LESSONS_APPROVAL.status === 'approved'
  const speechSupported = isSpeechSupported()
  const [speaking, setSpeaking] = useState<LessonKind | null>(null)

  // Stop any speech when leaving the lesson (AC5 hygiene on slow phones).
  useEffect(() => {
    return () => {
      if (isSpeechSupported()) window.speechSynthesis.cancel()
    }
  }, [])

  const familiesWithSkill = JOB_FAMILIES.filter((jobFamily) =>
    SKILLS_CONTENT[jobFamily].skills.some((skill) => skill.name === skillName),
  )
  const lessonSet = approved ? LESSONS[family]?.[skillName] : undefined

  function toggleSpeak(kind: LessonKind) {
    if (!speechSupported || !lessonSet) return
    if (speaking === kind) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(lessonSet[kind])
    utterance.onend = () => setSpeaking(null)
    window.speechSynthesis.speak(utterance)
    setSpeaking(kind)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <BookOpen className="size-4" aria-hidden="true" />
        <span className="text-sm font-medium">Sample lessons</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">{skillName}</h1>

      <p className="text-sm text-muted-foreground">
        Job it belongs to{familiesWithSkill.length > 1 ? 's' : ''}:{' '}
        {familiesWithSkill.map((jobFamily, index) => (
          <span key={jobFamily}>
            {index > 0 ? ', ' : ''}
            <strong>{jobFamily}</strong>
          </span>
        ))}
      </p>

      {lessonSet ? (
        (Object.keys(LESSON_TITLES) as LessonKind[]).map((kind) => (
          <section
            key={kind}
            aria-label={LESSON_TITLES[kind]}
            className="flex flex-col gap-2 rounded-lg border border-border p-3"
          >
            <h2 className="text-lg font-semibold">{LESSON_TITLES[kind]}</h2>
            <p className="text-sm">{lessonSet[kind]}</p>
            {speechSupported ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                aria-pressed={speaking === kind}
                onClick={() => toggleSpeak(kind)}
              >
                <Volume2 className="size-4" aria-hidden="true" />
                {speaking === kind ? 'Stop reading' : 'Read aloud'}
              </Button>
            ) : null}
          </section>
        ))
      ) : (
        <p className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
          Sample lessons are being checked and will appear here once approved.
        </p>
      )}

      <Button type="button" variant="outline" size="lg" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to my skills map
      </Button>
    </main>
  )
}
