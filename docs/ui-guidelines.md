# UI Guidelines

Expectations for every interface change in this project. Detailed design method
lives in the `ui-design` skill; these are the project-specific bindings.

## Principles

- **Clarity over decoration.** Every screen supports a user task. Remove what
  does not serve it.
- **Reuse before invention.** Prefer existing shadcn/ui components and design
  tokens. A new component is justified only when no existing one fits.
- **Honest states.** Loading, empty, success and error states are designed, not
  left to chance.
- **Accessible by default.** Accessibility is a requirement, not a polish step.

## Visual system

| Token | Source |
|---|---|
| Colour, radius, spacing scale | Tailwind CSS 4 theme variables in `src/index.css` (shadcn tokens: `background`, `foreground`, `primary`, `muted`, `destructive`, `border`, `ring`, ...) |
| Typography | Geist Variable (`--font-sans`); headings via `--font-heading` |
| Components | `src/components/ui/` (shadcn/ui, radix-nova style) |
| Icons | Lucide (`lucide-react`) |

Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`)
rather than raw colour values so theming stays consistent.

## Layout and spacing

- Follow the existing spacing rhythm; avoid one-off pixel values.
- Constrain readable text width; centre or align deliberately.
- Design for the supported viewport range: re-prioritise at small widths rather
  than simply shrinking the desktop layout.
- Keep touch targets comfortably large on coarse pointers.

## Required states

Every data-driven view must implement:

- **loading** — stable layout, clear progress, no layout shift
- **empty** — explains why, offers a sensible next step
- **success** — confirms what happened and what to do next
- **error** — says what failed, preserves user input, offers retry or an
  alternative

Also consider stale data, permission denied, offline and edit conflicts.

## Accessibility

- Semantic structure and landmarks
- Full keyboard operability with visible focus indication
- WCAG AA text contrast (and non-text contrast where applicable)
- Accessible names for controls; alternative text for meaningful images
- ARIA supplements semantics; it never replaces them
- Respect `prefers-reduced-motion`

## Forms and interaction

- Label every input; associate errors with their field.
- Preserve user input on failure.
- Provide feedback for every action: pending, success, failure.
- Disable only when genuinely unavailable, and say why when it matters.

## Consistency

- Match existing copy tone and naming.
- Reuse existing patterns for dialogs, toasts, tables and navigation.
- Record any new pattern introduced so the next change can reuse it.
