# Changelog

All notable changes to this repo are recorded here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); dates are UTC+4
(repo's commit timestamps).

## Phase 6 — Upgrade to latest (in progress)

Goal: every dependency, runtime, base image, and CI action at latest stable
(standing decision 1), one step/group at a time, each verified in Docker
before commit. Baseline/behavior contract: `docs/BASELINE.md` (Phase 5).

### 2026-11-06

- **fix(deps):** resolved the `npm ci` ERESOLVE conflict on `vite@8` that
  forced Phase 5's `--legacy-peer-deps` workaround. Bumped
  `@vitejs/plugin-react-swc` 3.7.1→4.3.3 and `lovable-tagger` 1.1.7→1.3.5
  (both registry-confirmed to declare peer support for `vite@8`). Dropped
  `--legacy-peer-deps` from the Dockerfile `deps` stage. Commit `d143d12`.
  Verified: `docker build --no-cache --target test .` → exit 0;
  `docker build --no-cache .` → exit 0. Re-verified clean on resume
  (2026-11-06, see Phase 6 handoff): both exit 0 again.
- **fix(deps):** bumped the ESLint ecosystem to latest stable - `eslint`
  9.39.5→10.14.0, `@eslint/js`→10.0.1, `typescript-eslint` 8.11.0→8.72.1,
  `eslint-plugin-react-hooks` `5.1.0-rc-fb9a90fa48-20240614`→**7.1.1**
  (closing `docs/TECHNICAL_DEBT.md` #6, the prerelease-RC pin),
  `eslint-plugin-react-refresh`→0.5.7, `globals`→17.14.0. This fixes the
  `npm run lint` tool-crash in `docs/BASELINE.md` finding #2 (`eslint .`
  now exits 1 with 75 real findings instead of exit 2 with a `TypeError`).
  `npm run lint` stays out of the Docker `test` hard gate (the 75 findings
  are pre-existing source content, out of Phase 6's scope — see
  `docs/TECHNICAL_DEBT.md` #23 for the itemized breakdown and owner
  phases). Commit `261c3b2`. Verified: `docker build --no-cache
  --target test .` → exit 0; `docker build --no-cache .` → exit 0;
  `make verify` → exit 0; `npm run lint` inside the build-stage image →
  exit 1 with real findings (confirmed not a crash).

<!-- Further Phase 6 entries appended below as the upgrade proceeds. -->
