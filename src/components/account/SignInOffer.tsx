import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * US-007 (AC1/AC2) — the optional sign-in invitation. Never a gate: it is
 * rendered only when a Supabase project is configured, and only inside the
 * journey screens (Question 1 stays byte-for-byte unchanged). Declining
 * ("Not now") hides it for this visit; the journey is exactly the same.
 *
 * Sign-in method (PO decision 2026-10-18): email magic link only — no
 * password. The wording states plainly what is saved, that it belongs to the
 * resident, and that they can delete it (spec UX).
 */
export function SignInOffer({
  onSendMagicLink,
  compact = false,
}: {
  onSendMagicLink: (email: string) => Promise<void>
  /** Compact (map prompt): collapsed behind one button until tapped. */
  compact?: boolean
}) {
  const [open, setOpen] = useState(!compact)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (dismissed) return null

  async function handleSend() {
    const trimmed = email.trim()
    if (trimmed.length === 0) return
    setSending(true)
    setError(null)
    try {
      await onSendMagicLink(trimmed)
      setSent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <section
        aria-label="Sign-in email sent"
        className="rounded-lg border border-border bg-muted/50 p-4 text-sm"
      >
        <p className="font-medium">Check your email.</p>
        <p className="mt-1 text-muted-foreground">
          Open the sign-in link on this phone to save your journey. This is
          optional — your journey works the same without it.
        </p>
      </section>
    )
  }

  if (compact && !open) {
    return (
      <section className="rounded-lg border border-border p-4">
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setOpen(true)}>
          <Mail aria-hidden="true" data-icon="inline-start" />
          Keep my journey on any phone
        </Button>
      </section>
    )
  }

  return (
    <section aria-label="Keep my journey on any phone" className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div>
        <h2 className="text-base font-semibold">Keep my journey on any phone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your email and we save your skills map and your
          3-sentence introduction. They belong to you — you can delete them at
          any time. This is optional; your journey works the same without it.
        </p>
      </div>

      <label className="text-sm font-medium" htmlFor="sign-in-email">
        Your email address
      </label>
      <input
        id="sign-in-email"
        type="email"
        className="min-h-12 w-full rounded-lg border border-border bg-background p-3 text-base"
        value={email}
        placeholder="For example: name@example.com"
        onChange={(event) => setEmail(event.target.value)}
      />

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="button" size="lg" onClick={() => void handleSend()} disabled={sending || email.trim().length === 0}>
        {sending ? 'Sending…' : 'Email me a sign-in link'}
      </Button>
      <Button type="button" variant="ghost" size="lg" onClick={() => setDismissed(true)}>
        Not now
      </Button>
    </section>
  )
}
