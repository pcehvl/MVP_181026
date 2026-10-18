import { useState } from 'react'
import { IntakeFlow } from '@/components/intake/IntakeFlow'
import { LessonsView } from '@/components/LessonsView'
import { NextStepView } from '@/components/NextStepView'
import { SkillsMap } from '@/components/SkillsMap'
import type { JobFamily } from '@/lib/job-families'
import type { IntakeAnswers } from '@/lib/intake'
import { clearAnswers, loadAnswers, saveAnswers } from '@/lib/persistence'

interface OpenLesson {
  family: JobFamily
  skillName: string
}

/**
 * MVP journey (US-001…US-006): intake → personalised skills map (US-003,
 * carrying US-002's approved content) → sample lessons for a skill (US-004)
 * → the closing practical step (US-005).
 *
 * US-006 AC5 (PO decision 2026-10-18): answers are saved in the phone's
 * browser storage only — never sent anywhere — so an interrupted journey
 * (battery dies, tab closes) resumes at the map on return. "Start again"
 * wipes the save; that is the resident's control over data left on a
 * shared phone. No account, no server, no tracking (supersedes US-001's
 * original session-only choice; dated notes in US-001/US-005/US-006 specs).
 */
function App() {
  const [answers, setAnswers] = useState<IntakeAnswers | null>(() => loadAnswers())
  const [openLesson, setOpenLesson] = useState<OpenLesson | null>(null)
  const [showNextStep, setShowNextStep] = useState(false)

  function handleComplete(next: IntakeAnswers) {
    saveAnswers(next)
    setAnswers(next)
  }

  function restart() {
    clearAnswers()
    setAnswers(null)
    setOpenLesson(null)
    setShowNextStep(false)
  }

  if (answers === null) {
    return <IntakeFlow onComplete={handleComplete} />
  }
  if (showNextStep) {
    return <NextStepView answers={answers} onRestart={restart} />
  }
  if (openLesson !== null) {
    return (
      <LessonsView
        family={openLesson.family}
        skillName={openLesson.skillName}
        onBack={() => setOpenLesson(null)}
      />
    )
  }
  return (
    <SkillsMap
      answers={answers}
      onRestart={restart}
      onOpenLesson={(family, skillName) => setOpenLesson({ family, skillName })}
      onOpenNextStep={() => setShowNextStep(true)}
    />
  )
}

export default App
