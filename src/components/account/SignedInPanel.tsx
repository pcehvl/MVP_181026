import { DeleteAccountButton } from '@/components/account/DeleteAccountButton'
import { Button } from '@/components/ui/button'

/**
 * US-007 — the signed-in state on the map: says plainly what is saved (their
 * journey, on their account, private to them) and carries the self-serve
 * deletion control (AC7). Shown only when a Supabase project is configured
 * and a resident is signed in; the signed-out journey never renders it.
 */
export function SignedInPanel({
  onDelete,
  onSignOut,
}: {
  onDelete: () => Promise<void>
  /** Sign out of this device only — never deletes anything. */
  onSignOut: () => void
}) {
  return (
    <section
      aria-label="Your saved account"
      className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4"
    >
      <p className="text-sm">
        <strong>Your journey is saved to your account.</strong> You can open it
        on any phone you sign in on. It belongs to you and is private to you.
      </p>
      <p className="text-xs text-muted-foreground">
        Deleting your account removes your saved journey everywhere. It cannot
        be undone.
      </p>
      <DeleteAccountButton onDelete={onDelete} />
      <Button type="button" variant="ghost" size="lg" onClick={onSignOut}>
        Sign out of this phone
      </Button>
    </section>
  )
}
