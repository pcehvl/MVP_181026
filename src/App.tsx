import { useEffect, useState } from 'react'
import { IntakeFlow } from '@/components/intake/IntakeFlow'
import { LessonsView } from '@/components/LessonsView'
import { NextStepView } from '@/components/NextStepView'
import { SkillsMap } from '@/components/SkillsMap'
import { SignInOffer } from '@/components/account/SignInOffer'
import { SignedInPanel } from '@/components/account/SignedInPanel'
import { SavedJourneyChoice } from '@/components/account/SavedJourneyChoice'
import type { JobFamily } from '@/lib/job-families'
import type { IntakeAnswers } from '@/lib/intake'
import { answersEqual, clearAnswers, loadAnswers, saveAnswers } from '@/lib/persistence'
import {
  type Account,
  deleteAccountAndData,
  isSyncConfigured,
  loadSavedAnswers,
  onAuthChange,
  saveAnswersToAccount,
  sendMagicLink,
  signOut,
} from '@/lib/sync'

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
 * wipes the local save; that is the resident's control over data left on a
 * shared phone. It never deletes account data (US-007 AC7 is the only
 * deletion path).
 *
 * US-007 (PO decisions 2026-10-18): optional save-across-phones. When a
 * Supabase project is configured, an invitation is offered on the map and on
 * the practical step (AC1 — signing in is never required and the signed-out
 * journey is untouched; Question 1 renders no account UI at all). A magic
 * link signs the resident in; their saved answers are recomputed into the
 * same map/intro on any phone (AC3). The account row is written at exactly
 * two resident-driven moments: signing in with local answers and no saved
 * copy (AC2), and choosing "keep the answers from this phone" in the
 * cross-phone conflict (AC3). Without a Supabase project every sync call is
 * a no-op and this file behaves exactly as the US-006 build.
 */
function App() {
  const [answers, setAnswers] = useState<IntakeAnswers | null>(() => loadAnswers())
  const [openLesson, setOpenLesson] = useState<OpenLesson | null>(null)
  const [showNextStep, setShowNextStep] = useState(false)
  const [account, setAccount] = useState<Account | null>(null)
  // The account's saved copy, as last loaded. Shown as a choice only when it
  // differs from this phone's answers (AC3); equal copies show the plain
  // signed-in panel instead.
  const [savedAnswers, setSavedAnswers] = useState<IntakeAnswers | null>(null)

  // One subscription for the component's lifetime. The callback reads local
  // storage (not state) so it never acts on stale answers, and a network
  // failure here never blocks the journey — the offer/panel simply reflects
  // "no saved copy" for this visit.
  useEffect(
    () =>
      onAuthChange((next) => {
        setAccount(next)
        if (next === null) {
          setSavedAnswers(null)
          return
        }
        const local = loadAnswers()
        loadSavedAnswers(next)
          .then((saved) => {
            if (saved === null) {
              // AC2: signing in saves this phone's answers when the account
              // has none yet. Silent on failure — the journey continues.
              if (local !== null) {
                return saveAnswersToAccount(next, local).catch(() => undefined)
              }
              setSavedAnswers(null)
              return
            }
            setSavedAnswers(saved)
          })
          .catch(() => setSavedAnswers(null))
      }),
    [],
  )

  function handleComplete(next: IntakeAnswers) {
    saveAnswers(next)
    setAnswers(next)
  }

  function restart() {
    // Local-only wipe (US-006 AC5). Never touches the account session or row.
    clearAnswers()
    setAnswers(null)
    setOpenLesson(null)
    setShowNextStep(false)
  }

  function handleUseSaved(saved: IntakeAnswers) {
    // AC3: the saved journey becomes the journey — local storage is replaced
    // and the map/intro recompute from the saved answers.
    saveAnswers(saved)
    setAnswers(saved)
    setSavedAnswers(null)
    setOpenLesson(null)
    setShowNextStep(false)
  }

  function handleUseLocal() {
    // AC3: this phone's answers win and become the account's saved copy.
    if (account !== null && answers !== null) {
      saveAnswersToAccount(account, answers).catch(() => {
        /* Journey continues on this phone; the account catches up next sign-in. */
      })
    }
    setSavedAnswers(null)
  }

  function handleDelete() {
    // AC7: account + server row + this device's local save, permanently.
    return deleteAccountAndData().then(() => {
      clearAnswers()
      setAnswers(null)
      setAccount(null)
      setSavedAnswers(null)
      setOpenLesson(null)
      setShowNextStep(false)
    })
  }

  function handleSignOut() {
    // Ends the session on this device only; local answers stay (US-006).
    signOut()
      .then(() => {
        setAccount(null)
        setSavedAnswers(null)
      })
      .catch(() => {
        /* Sign-out is a convenience; the journey is unaffected either way. */
      })
  }

  if (answers === null) {
    return <IntakeFlow onComplete={handleComplete} />
  }
  if (showNextStep) {
    return (
      <NextStepView
        answers={answers}
        onRestart={restart}
        accountSection={
          !isSyncConfigured() || account !== null ? null : (
            <SignInOffer onSendMagicLink={sendMagicLink} />
          )
        }
      />
    )
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
      accountSection={
        !isSyncConfigured() ? null : savedAnswers !== null && !answersEqual(savedAnswers, answers) ? (
          <SavedJourneyChoice
            savedAnswers={savedAnswers}
            localAnswers={answers}
            onUseSaved={handleUseSaved}
            onUseLocal={handleUseLocal}
          />
        ) : account !== null ? (
          <SignedInPanel onDelete={handleDelete} onSignOut={handleSignOut} />
        ) : (
          <SignInOffer onSendMagicLink={sendMagicLink} compact />
        )
      }
    />
  )
}

export default App
