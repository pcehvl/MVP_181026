# MyMVP

AI-assisted MVP development harness built on OpenCode. This repository is the
**harness**, not the product: it defines how product work and implementation
work proceed, with the human as Product Owner.

Product scope, requirements and backlog live under `product/` and are established
with the Product Owner. Nothing in the product area is inferred from tooling
defaults.

## Development model

```text
PRODUCT LOOP
Design Thinking → Product Framing → Product Backlog → User Story → Refinement → Ready

BUILDING LOOP
Ready Story → Plan → Human Plan Approval → Feature Branch → Implement → Test
→ Pull Request → Human Acceptance → Merge → Deploy → External Test → Feedback
→ Product Loop
```

You work in OpenCode's built-in Build agent. It delegates to three project agents
(`.opencode/agents/`) that carry the work: Product Assistant
(WHY/WHAT), Planner (HOW), Coder (BUILD/VERIFY). Six generic skills
(`.opencode/skills/`) describe the reusable methods. `AGENTS.md` binds them to
this repository.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide |
| Backend / data | Supabase (PostgreSQL, RLS) |
| Testing | Vitest, React Testing Library, Playwright |
| Hosting | Vercel (frontend), Supabase (backend/data) |

## Commands

```bash
npm install            # install dependencies (use npm ci when a lockfile is present)
npm run dev            # start the dev server
npm run lint           # lint
npm run typecheck      # type checking
npm run test -- --run  # unit/component tests (non-watch)
npm run test:e2e       # Playwright E2E (installs its own browser if needed)
npm run test:e2e:ui    # Playwright UI mode
npm run build          # production build
npm run verify         # lint → typecheck → tests → build → E2E, in sequence
```

First-time E2E setup: `npx playwright install chromium`.

## Configuration

Copy `.env.example` to `.env` and fill in values. Only public client-side
values belong in `VITE_` variables; never commit `.env` or privileged
credentials.

## Layout

| Path | Purpose |
|---|---|
| `product/` | Product context and Story backlog (Product Assistant); each Story directory holds `spec.md`, `plan.md`, `verification.md` |
| `.opencode/` | Project agents and generic skills |
| `docs/` | Architecture, UI guidelines, deployment, bootstrap verification |
| `supabase/` | Migrations and Edge Functions |
| `e2e/` | Playwright end-to-end tests |
| `src/` | Application source |

## Documentation

- `AGENTS.md` — project rules binding skills to this repository
- `docs/architecture.md` — stack and structure
- `docs/ui-guidelines.md` — interface expectations
- `docs/deployment.md` — deployment flow and prerequisites
- `docs/bootstrap-verification.md` — recorded bootstrap verification results
