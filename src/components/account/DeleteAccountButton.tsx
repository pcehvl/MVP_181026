import { useState } from 'react'
import { Button } from '@/components/ui/button'

/**
 * US-007 AC7 — self-serve permanent deletion with one confirmation. The
 * resident never needs a support contact: one tap opens the confirmation,
 * one more tap deletes the account and its saved data (and this device's
 * local save). "Keep my account" cancels and changes nothing.
 */
export function DeleteAccountButton({
  onDelete,
}: {
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await onDelete()
      // Parent resets the journey on success; nothing to do here.
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (!confirming) {
    return (
      <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setConfirming(true)}>
        Delete my account and data
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-destructive/40 p-3" role="group" aria-label="Confirm deleting your account">
      <p className="text-sm">
        This deletes your account and your saved journey. It cannot be undone.
      </p>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="button" size="lg" onClick={() => void handleDelete()} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Yes, delete everything'}
      </Button>
      <Button type="button" variant="ghost" size="lg" onClick={() => setConfirming(false)} disabled={deleting}>
        Keep my account
      </Button>
    </div>
  )
}
