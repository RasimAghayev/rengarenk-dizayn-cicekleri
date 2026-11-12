# Test report — CI/CD pipeline (Phase 10)

Repo: rengarenk-dizayn-cicekleri
Pipeline: .github/workflows/ci.yml (SHA-pinned actions, PR #79)

## Target (CI/CD runner-time standard, PROMPT.md Phase 10)

PR pipeline wall-clock budget: <= 10 min.
Cheap checks first and in parallel (lint, typecheck, secret scan), heavy
jobs after, fail fast. Every job has timeout-minutes. Actions pinned by
commit SHA. Fork PRs receive no secrets. Full/slow image scan runs on the
nightly schedule only, not on every PR. Publish is gated to tags.

## Jobs (in order)

| Job | Gate | Trigger | Notes |
|-----|------|---------|-------|
| lint | non-blocking (continue-on-error) | push + PR | npm run lint; informational while 75 pre-existing findings exist (docs/TECHNICAL_DEBT.md #23, Phase 8/9 item) |
| typecheck | HARD | push + PR | docker build --target test (npx tsc -b); the make verify test portion |
| build | HARD (needs typecheck) | push + PR | docker compose build app (runtime image); mirrors make build |
| secret-scan | HARD | push + PR | gitleaks (SHA-pinned); .gitleaks.toml allowlists only the known-safe Supabase anon key |
| security | reported only | nightly schedule | docker scout cves on runtime image, best-effort (|| true) |
| publish | validated only | tags only | no registry credentials configured yet; no image pushed |

## Measured ground truth (local Docker, worktree phase-10/ci-cd, commit 9c7ef09)

| Command | Result |
|---------|--------|
| docker build --target test -t rengarenk-dizayn-cicekleri:test . | FAILED ~6.5s - npm ci ERESOLVE (see below) |

## Current state: red, pre-existing, not a P10 regression

`make verify` (and therefore the CI typecheck/build jobs) is RED on `main`
because of a dependency conflict introduced by Dependabot PR #75, which
bumped `typescript` to `7.0.2` while `typescript-eslint@8.72.x` requires
`typescript >=4.8.4 <6.1.0` (the cap Phase 6 itself documented in
docs/TECHNICAL_DEBT.md #25). `npm ci` fails with ERESOLVE before any test
or lint step can run, so no CI job can currently pass.

This is a pre-existing baseline regression, not caused by Phase 10, and
fixing it is dependency work (Phase 6/upgrader), out of ci-engineer scope
per R1 (ci-engineer = CI files only). Phase 6 should re-pin `typescript`
to `^6.0.x` to restore a green build, after which this TEST_REPORT should
be updated with actual green-CI timings and the PR merged.

No AI attribution (CLAUDE.md decision 12).
