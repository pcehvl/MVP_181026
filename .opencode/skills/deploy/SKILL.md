---
name: Deploy
description: Verify deployment readiness, configuration and security, deploy a reviewed revision through documented manual or CLI flow, and confirm the live result
---

# Deploy

Generic method for deploying an application and verifying the deployed result.
Deployment is a human-authorised act, separate from local verification.

## 1. Preconditions

Deploy only when all of the following hold:

- the revision to deploy is the reviewed and accepted one
- the human has explicitly authorised the target environment and the revision
- the target environment's identity and purpose are confirmed (never deploy to
  an unknown or unconfirmed environment)
- required schema changes are identified and ordered

Local passing checks do not prove that a remote deployment or remote database
works. Keep the two claims separate in every report.

## 2. Pre-deployment verification

Confirm, and record the results:

- production build succeeds
- automated tests pass at every level that is required for release
- the critical user journey passes end to end
- the target environment and its configuration are correct
- required schema changes are identified, ordered and reversible where possible
- relevant access-control protections are in place for the data being exposed
- no secrets or privileged credentials are committed to the repository
- environment configuration lives in ignored local files and provider-side
  settings, with only placeholders committed

Missing tools, unavailable configuration and skipped checks are not success.
Report each as not run with the reason.

## 3. Security checks

Before release, verify:

- no privileged database credentials, service credentials or signing secrets
  appear in client-bundled code or public environment variables
- client-visible configuration contains only values intended for public use
- access to protected data is enforced by the data layer's own protections, not
  only by hiding UI
- error handling does not leak internals to end users

## 4. Deployment

Deploy the exact verified revision using the documented, validated flow for the
installed tooling — typically a CLI or console deployment from a tagged or
pinned revision.

Keep deployment independent of hosted workflows and automatic triggers during
early development. Do not deploy from an unverified working tree.

## 5. Post-deployment verification

After deployment, verify against the real environment — not the local one:

- the actual deployed URL loads
- the deployed revision matches the intended one
- the critical user journey works end to end against the live service
- schema changes are present in the target database
- access-control behaviour behaves as expected with real policies
- logs and error reporting show no new failures

Record: deployed revision, environment, timestamp, checks run and their results.

## 6. Rollback

Know the rollback path before deploying:

- how to redeploy the previous known-good revision
- how to handle schema changes that are not trivially reversible
- who decides to roll back, and on what evidence

## 7. Boundaries

- Never expose secrets or privileged credentials in any environment
- Never reset, reuse or repurpose a database without confirming its identity
  and purpose with the human
- Report local verification, review, merge and deployment as separate stages
- Ask the human at most ONE question per message, and only when the answer
  materially affects the deployment and cannot be determined from existing
  context.
