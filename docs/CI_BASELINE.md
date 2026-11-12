# CI / dependency baseline — rengarenk-dizayn-cicekleri

Records the pre-existing CI/dependency state that Phase 10 (CI/CD) and Phase 11
(docs) inherited and deliberately did not fix (out of scope per R1/R3; owned by
Phase 6/upgrader). Kept here so every later phase can compare `make verify`
against a known baseline instead of guessing whether a failure is new.

## make verify — RED (pre-existing baseline)

| Command | Result | Notes |
|---|---|---|
| `docker build --target test -t rengarenk-dizayn-cicekleri:test .` (= `make test`) | exit 1 (expected) | `npm ci` ERESOLVE: `typescript@7.0.2` vs `typescript-eslint@8.72.x` peerDependency `typescript >=4.8.4 <6.1.0`. Same failure on plain `npm ci` and `npm audit fix`. |
| `make verify` (= `make test` + `make build`) | RED — same pre-existing failure | Not caused by P10/P11; P10's CI pipeline (PR #79) is implemented but cannot go green until this is resolved. |
| `docker build .` (default target = `runtime`) | exit 0 | Unaffected: the `deps` stage's `npm ci` is only reached via `--target deps`/`--target test`. See docs/BASELINE.md findings #1/#3 for history. |

## Root cause

Dependabot PR #75 merged `typescript@^7.0.2` onto `main` (commit `6480f59`, merge of PR #75). `typescript-eslint@^8.72.2` (declared devDependency) requires `typescript >=4.8.4 <6.1.0`. `npm ci` cannot resolve the tree → ERESOLVE → exit 1. The lockfile (`package-lock.json`) pins the conflicting pair.

## Owner / fix

Phase 6/upgrader: re-pin `typescript` to `^6.0.x` (the cap this repo already documented — TS 6.0.3 is the highest release inside the accepted range) or upgrade `typescript-eslint` once it publishes TS 7.x support. One dependency step at a time, each Docker-verified and committed separately (standing decision 1 / PROMPT.md Phase 6). Do not force `--legacy-peer-deps`; that masks rather than fixes the conflict.

## Phase 10 (CI/CD) — open, not merged

PR #79: https://github.com/RasimAghayev/rengarenk-dizayn-cicekleri/pull/79
- Adds `.github/workflows/ci.yml` (lint → typecheck in Docker `test` stage → build → secret scan; SHA-pinned actions, per-job `timeout-minutes`, concurrency with cancel-in-progress, fork PRs get no secrets, full image scan nightly only, publish gated to tags), `.gitleaks.toml`, `docs/TEST_REPORT.md`.
- Status: open, not merged — blocked on the green build above, not on the pipeline itself.
- `make lint`/`make format`-equivalent: lint continues-on-error (informational) in CI until the 75 pre-existing ESLint findings (docs/TECHNICAL_DEBT.md item 23) are triaged by Phase 7/8/9.

## Scope note for this phase (docs-writer / P11)

README.md, CONTRIBUTING.md, and this file were refreshed to reflect the current state above. No source, dependency, lockfile, CI file, or Dockerfile changes were made; no behavior regression possible from docs-only commits. `make verify` exit code after this phase: unchanged vs the P10 baseline (see table).
