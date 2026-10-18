---
name: UI Design
description: Design user interfaces from user and task context through hierarchy, states, responsiveness and accessibility, reusing existing components first
---

# UI Design

Generic method for designing interface changes. Work from the user and the task,
not from decoration. Reuse existing components before creating new ones.

## 1. User and task

Before designing, establish:

- who is using this, and in what context
- what they are trying to accomplish
- what decision or action the screen supports
- what happens after they succeed, and what they do if they fail

If the user or task is unclear, that is a product question, not a design detail.

## 2. Information hierarchy

Decide what the user must see first, second and last. Express it through:

- placement and order
- size and weight
- colour and contrast
- spacing and grouping

One primary action per view is usually enough. Remove anything that does not
serve the task.

## 3. Interaction

Specify, for every interactive element:

- what it does on activation
- its available, focused, pressed, disabled and loading states
- keyboard behaviour and focus order
- what the system does while work is in progress
- what confirms success and what happens on failure

## 4. Structure

Describe the page or component structure in terms of:

- layout regions
- component composition (reusing existing primitives first)
- content slots and their constraints
- the visual relationship between related and unrelated elements

Prefer the project's existing component library and design tokens over custom
equivalents. A new component is justified only when no existing one fits.

## 5. States

Every data-driven view needs all four, designed not left to chance:

| State | Expectation |
|---|---|
| loading | Stable layout, clear progress, no layout shift |
| empty | Explains why it is empty and offers a sensible next step |
| success | Confirms what happened and what the user can do next |
| error | Says what failed, preserves the user's input where possible, offers retry or an alternative |

Also design partial states: stale data, permission denied, offline, and
conflict between two edits.

## 6. Responsive behaviour

Define how the design adapts across the supported viewport range:

- what reflows, what stacks and what is hidden
- minimum and maximum content widths
- touch target sizes on coarse pointers
- behaviour of dense tables, lists and toolbars when space runs out

Do not simply shrink a desktop layout; re-prioritise for the smaller context.

## 7. Accessibility

Treat as non-negotiable:

- semantic structure and landmark regions
- keyboard operability for every interaction
- visible focus indication
- text contrast meeting WCAG AA, and non-text contrast where applicable
- accessible names for controls, and alternative text for meaningful images
- ARIA used to supplement semantics, never to replace them
- reduced-motion preferences respected

## 8. Consistency and reuse

- follow existing spacing, typography, colour and radius tokens
- reuse existing components, patterns and iconography before inventing
- keep naming, copy tone and interaction patterns consistent with the rest of
  the product
- record any new pattern you introduce so it can be reused next time

## 9. Boundaries

- Do not invent product requirements while designing. Unresolved product
  questions go back to the product loop.
- Ask the human at most ONE question per message, and only when the answer
  materially affects the design and cannot be determined from existing context.
