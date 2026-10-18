# Verification — US-007 optional save-across-phones

- **Story:** US-007 — Save my journey across phones (optional)
- **Spec:** `product/stories/US-007-optional-save-across-phones/spec.md` (status: ready, AC1–AC7 frozen by the Product Owner 2026-10-18)
- **Tested source commit:** `53f3b77` ("US-007: optional save-across-phones …")
- **Branch:** `feature/US-007-optional-save-across-phones`
- **Date:** 2026-10-18
- **Environment:** Windows, Node v24.22.0, Vitest 5 (jsdom), Playwright 1.63 (chromium); **no Supabase project configured** — all Supabase calls are faked in automated tests, per the shared verification approach
- **Uncommitted changes at test time:** none (verification.md added after the tested commit, no source changes)

## Local verification

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **PASS** |
| Typecheck | `npm run typecheck` | **PASS** |
| Unit / component tests | `npm run test -- --run` | **PASS** — 97/97 (10 files) |
| Production build | `npm run build` | **PASS** — 314.47 kB JS (gzip 101.91 kB), 27.44 kB CSS |
| E2E | `npm run test:e2e` | **PASS** — 5/5 (chromium) |

Baseline before this story: 68 tests / 8 files. Added: `src/lib/sync.test.ts` (13), `src/App.account.test.tsx` (12), `answersEqual` coverage in `src/lib/persistence.test.ts` (4).

## Acceptance Criterion verification

| AC | Short title | Result | Evidence |
|---|---|---|---|
| AC1 | Sign-in never required | **PASS** | `App.account.test.tsx` → "with sync unconfigured the journey is untouched: no account UI anywhere"; "the map shows the offer but the journey never requires it; 'Not now' hides it". `sync.test.ts` → "every operation is a no-op when no Supabase is linked". `e2e/journey.spec.ts` → "US-007 AC1 — no account UI anywhere while no backend is configured" (Question 1 renders no account UI, real app). Question 1 (`IntakeFlow.tsx`) is unchanged by this story. |
| AC2 | Optional save on sign-in | **PASS** | `sync.test.ts` → "sendMagicLink requests a passwordless email link"; "a send failure surfaces a plain message". `App.account.test.tsx` → "entering an email requests the magic link (no password)"; "signing in with local answers and an empty account saves them to the account" (asserts `saveAnswersToAccount` with the local answers). |
| AC3 | Restored on any phone | **PASS** | `App.account.test.tsx` → "signing in on another phone loads the saved journey (map + intro recompute)"; "choosing 'keep the answers from this phone' saves the local ones instead"; "a matching saved copy shows the plain signed-in panel, no choice"; "a failed saved-journey load never blocks the journey". `sync.test.ts` → load returns stored answers / null / rejects wrong shape. |
| AC4 | Profile contents, minimal | **PASS** | `sync.test.ts` → "saveAnswersToAccount upserts the own row: identifier + answers + timestamp only" (payload keys exactly `user_id`, `answers`, `updated_at`); "loadSavedAnswers rejects a wrong-shaped payload". Migration defines only `user_id`, `answers`, `created_at`, `updated_at`. No lesson history, no tracking, no editable intro anywhere in the code. |
| AC5 | Own data only (RLS) | **PASS (app level) / NOT RUN (live enforcement)** | Migration `supabase/migrations/20261018000001_profiles_rls.sql`: RLS enabled with own-row-only select/insert/update/delete (`auth.uid() = user_id`), no anonymous policy. `user_id` always comes from the session (`sync.ts`), never from user input. **Live RLS enforcement is NOT RUN — no Supabase project exists** (manual step M3). |
| AC6 | No secrets in browser | **PASS** | Built bundle grepped: no `service_role` / `SUPABASE_SERVICE` / `deleteUser` / `admin.` strings. Only public `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` reach the client (`src/lib/supabase.ts`). Service-role key used only inside the `delete-account` Edge Function (server-side). Error paths surface plain messages only (`sync.test.ts` × 3). |
| AC7 | Self-serve permanent deletion | **PASS** | `App.account.test.tsx` → "deleting asks once, then removes account, local save and returns to Question 1"; "'Keep my account' cancels the deletion". `sync.test.ts` → invoke `delete-account` (DELETE) + local wipe + session end; "a failed deletion keeps the local save". Edge Function verifies the caller's own JWT and deletes only that user; the profile row follows via `ON DELETE CASCADE`. **Live invocation NOT RUN** (manual step M4). |

## E2E, persistence and security checks

- **Critical journey:** `e2e/journey.spec.ts` "critical journey" passes (intake → map → lesson → step → start again), unchanged by this story — the strongest AC1 evidence.
- **Persistence:** US-006 AC5 E2E still passes (reload resumes at the map; Start again wipes). New unit test: "US-006 AC5 signed-in — 'Start again' wipes only the local save, never the account".
- **Migration:** present and reviewed; **not applied** — no project (M1).
- **Security review (explicit, required for auth/RLS):**
  - No privileged credential in the browser bundle or public config (grepped `dist/`).
  - `VITE_` variables carry only the project URL and the anon key; the anon key is protected by RLS.
  - The service-role key lives only in the Edge Function's server environment; the function deletes only the caller's own user id (never an id from the request body).
  - RLS is the enforcement layer for own-data-only; the app never relies on hiding UI.
  - Error handling returns generic messages; no internals leak (`sync.test.ts` covers three failure paths).
  - No secrets, `.env` files or credentials committed (`.env.example` placeholders only; `.env.local`/`.vercel` ignored).

## Checks not run

| Required check | Status | Reason |
|---|---|---|
| Apply migration to a live database | **NOT RUN** | No Supabase project exists (human action M1). |
| Deploy + invoke the `delete-account` Edge Function | **NOT RUN** | Same; requires the project and the service-role secret (M4). |
| Real magic-link round trip (email → click → session) | **NOT RUN** | Requires the project and email delivery; documented as manual steps M2/M5. |
| Live RLS enforcement (user A cannot read/write user B) | **NOT RUN** | Requires the project (M3). |

Per the shared verification approach these are recorded as not run, never as passed. They must be completed before the feature is enabled in production (it stays hidden until the env vars are set — see below).

## Manual steps (for when the Supabase project exists)

1. **M1** Create a Supabase project (free tier) and install the Supabase CLI. Expected: project ref available.
2. **M2** `supabase link --project-ref <ref>` then `supabase db push`. Expected: `profiles` table exists with RLS enabled.
3. **M3** In the SQL editor: as user A, `select * from profiles` returns only A's row; inserting a row with B's `user_id` is rejected. Expected: only own data.
4. **M4** `supabase functions deploy delete-account`. Expected: function deployed. (No manual secret: Supabase injects `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions automatically.)
5. **M5** Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in Vercel (and local `.env`), redeploy. Expected: the map/step offers appear; a magic link signs in; the saved journey loads on a second phone; "Delete my account and data" removes the account, the row and the local save.

## Follow-up verification (same branch, after the tested commit)

Two changes were made after `53f3b77` and the affected checks were re-run:

- **Test determinism guard** (`vitest.config.ts`, `playwright.config.ts`): once a developer's `.env.local` holds the Supabase values, the unconfigured-journey tests must not change behaviour. Vitest now pins the two `VITE_SUPABASE_*` variables empty for tests, and Playwright forces them empty for the dev server it spawns. Verified by temporarily adding dummy values to `.env.local`: **E2E 5/5 PASS** (fresh server spawned) and **unit 97/97 PASS**; `.env.local` then restored byte-for-byte.
- **Edge Function key fallback** (`supabase/functions/delete-account/index.ts`): accepts the newer `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` names as a fallback to the legacy `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` injected by Supabase.

Full `npm run verify` re-run after both changes: **lint PASS · typecheck PASS · 97/97 unit PASS · build PASS · 5/5 E2E PASS**.

## Plan deviations and known limitations

- **Edge Function for deletion (plan item 4).** The Planner offered a simpler profile-row-only deletion to avoid server code; the frozen spec (AC7) requires deleting the authentication account, so the Edge Function was implemented. No spec deviation.
- **Added "Sign out of this phone".** Not named in the ACs. A shared-phone resident needs to end a session without deleting the account; without it, the only session control would be deletion. Recorded as an implementation addition, reviewed against AC1/AC7 (it deletes nothing).
- **Account writes happen at exactly two resident-driven moments:** signing in when the account has no saved copy (AC2), and choosing "keep the answers from this phone" in the conflict (AC3). There is no background/auto-sync — the "latest saved profile" position from the spec's Out of Scope.
- **No silent restore on load.** A signed-in session with no local answers does not auto-load the saved journey (shared-phone safety: the next person must not see the previous resident's journey). Restore happens through the explicit offer/choice.
- **Conflict prompt can reappear** after "Start again" + a new intake while still signed in (the account keeps the older copy). This is deliberate: nothing is overwritten silently; either choice resolves it.
- **Known limitations:** magic-link delivery depends on Supabase's shared SMTP (rate-limited) — accepted by the Product Owner at free-tier scale; the offer appears only after the auth state resolves (a brief absence, never a flash of wrong state); the feature stays completely hidden until the Supabase env vars are configured, so the deployed US-006 behaviour is unchanged today.
