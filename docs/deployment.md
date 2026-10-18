# Deployment

Deployment targets: **frontend → Vercel**, **backend/data → Supabase**.
Deployment is a human-authorised act, separate from local verification.

> **Status:** Not yet configured. No Supabase project or Vercel project exists
> for this repository. Creating and linking them is a human action (see
> *Human actions required* below).

## Prerequisites

| Tool | Validated version | Status |
|---|---|---|
| Node.js | v24.21.0 | installed |
| npm | 12.0.2 | installed |
| Vercel CLI | 59.23.2 | installed |
| Supabase CLI | — | **not installed — human action required** |

Commands below are written for the installed CLI versions. Re-validate after
any CLI upgrade.

## Environment configuration

- Local: copy `.env.example` to `.env` (git-ignored) and fill in values.
- Vercel: set the same variables in the project's environment settings
  (Production / Preview / Development as appropriate).
- Supabase: configuration and secrets live in the Supabase project settings,
  never in the repository.

Only public, browser-safe values may appear in `VITE_` variables. Privileged
credentials must never be committed or shipped to the browser.

## Deployment flow

### 1. Verify before deploying

From the exact revision to be deployed:

```bash
npm ci
npx playwright install chromium
npm run verify
```

Confirm also:

- the critical user journey passes end to end
- required migrations are identified and ordered
- relevant access-control checks pass
- no secrets are committed
- the human has authorised the target environment and this revision

Local passing checks do not prove that a remote deployment or remote database
works. Keep the claims separate.

### 2. Deploy the backend/data (Supabase)

With the Supabase CLI installed and authenticated:

```bash
# One-time: link the local directory to a remote development/test project
supabase link --project-ref <project-ref>

# Apply pending migrations in order to the linked project
supabase db push
```

Migration order matters: apply migrations in filename order and verify the
schema afterwards. Never reset or repurpose a database without confirming its
identity and purpose with the human.

### 3. Deploy the frontend (Vercel)

From the verified revision, using the installed CLI:

```bash
# One-time: create/link the Vercel project (human decision on org and project name)
vercel link

# Deploy a preview from the current revision
vercel

# Deploy to production from the reviewed, accepted revision
vercel --prod
```

Set build and environment details in Vercel project settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 24.x |

Do **not** enable automatic Git-triggered deployment during this phase;
deployment stays manual and independent of hosted workflows.

### 4. Post-deployment verification

Against the **live** environment, not the local one:

- the deployed URL loads over HTTPS
- the deployed revision matches the intended one
- the critical user journey works end to end against the live service
- schema changes are present in the target database
- access-control behaviour behaves as expected with real policies
- logs and error reporting show no new failures

Record: deployed revision, environment, timestamp, checks run and results.

## Rollback

- **Frontend:** redeploy the previous known-good revision with
  `vercel redeploy` or `vercel --prod` from that revision.
- **Database:** prefer forward-fix migrations; ensure each migration has a
  considered rollback path before applying it to a shared environment. Never
  run destructive resets against a database whose identity is unconfirmed.

## Human actions required

1. Install the Supabase CLI and authenticate (`supabase login`).
2. Create or confirm the remote Supabase development/test project, then link it
   (`supabase link --project-ref ...`). Confirm the project's identity and
   purpose before any `db push`.
3. Create or confirm the Vercel project (`vercel link`) and set the
   environment variables listed above.
4. Give explicit authorisation for each deployment target and revision before
   any deploy.
