# Architecture

Product-neutral technical description of the harness shell. Architecture
emerges from real requirements; nothing here is speculative product design.

## Stack

| Layer | Choice | Role |
|---|---|---|
| UI | React 19 + TypeScript | Component model and typing |
| Build | Vite 8 | Dev server and production bundling |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) | Utility-first styling with CSS-variable theming |
| Components | shadcn/ui (radix-nova style, Radix primitives) | Accessible, copy-in primitives under `src/components/ui/` |
| Icons | Lucide | Consistent iconography |
| Backend / data | Supabase (PostgreSQL + RLS) | Data, auth and storage when requirements justify them |
| Unit / component tests | Vitest + React Testing Library | Fast feedback on logic and isolated UI behaviour |
| E2E tests | Playwright | Critical user journeys against the real running app |
| Hosting | Vercel (frontend), Supabase (backend/data) | Low-cost, HTTPS, easy redeployment |

## Repository structure

| Path | Purpose |
|---|---|
| `src/` | Application source (`App.tsx` is a product-neutral shell) |
| `src/components/ui/` | shadcn/ui primitives (copied, editable) |
| `src/lib/utils.ts` | `cn` class-merge helper |
| `src/lib/supabase.ts` | Supabase browser client (public values only) |
| `e2e/` | Playwright tests |
| `supabase/migrations/` | Versioned schema migrations (empty until required) |
| `supabase/functions/` | Edge Functions (introduced only when justified) |
| `product/` | Product context and Story backlog; each Story directory holds `spec.md`, `plan.md` and `verification.md` |
| `.opencode/` | Agents and generic skills |
| `docs/` | Architecture, UI guidelines, deployment, bootstrap verification |

## Data access

The browser talks to Supabase through `src/lib/supabase-js` in
`src/lib/supabase.ts` using only public client values (`VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`). The client is created only when both are configured;
until a project is linked, the shell renders without data access.

Persistent data requirements are derived from the current User Story. The
schema stays as small as the Story requires, with PostgreSQL constraints and
versioned migrations under `supabase/migrations/`. Row Level Security protects
all user-owned or non-public data. Auth, Storage and Edge Functions are
introduced only when a requirement justifies them.

No separate backend server wraps Supabase. No local Supabase containers are
required; a linked remote development/test project is supported.

## TypeScript configuration

- `tsconfig.app.json` — application code, with `@/*` mapped to `./src/*`
- `tsconfig.node.json` — build and test configuration files, plus `e2e/`
- `tsconfig.json` — solution file referencing both; it also carries the `@/*`
  path mapping so tools that read the root tsconfig (including the shadcn CLI)
  resolve aliases

Note: TypeScript 6 deprecates `baseUrl`. Path mappings are therefore declared
without it; both `tsc` and the shadcn CLI resolve them relative to the tsconfig
location.

## Testing strategy

```text
Logic                    → Vitest unit tests
Important isolated UI    → React Testing Library
Critical user journeys   → Playwright (e2e/)
```

Playwright runs against the Vite dev server (`npm run dev`, port 5173) via
`webServer` in `playwright.config.ts`, so `npm run test:e2e` works standalone.
`npm run verify` runs lint → typecheck → unit/component tests → production
build → E2E in sequence and stops at the first failure.

## Verification flow

```text
Story branch → npm run verify → evidence in the Story's verification.md
→ Pull Request (links spec, approved plan, evidence) → human acceptance → merge
```

See `AGENTS.md` for the full process rules and `docs/deployment.md` for the
deployment flow.
