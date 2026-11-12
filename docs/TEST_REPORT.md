# Test Report

Repo: `rengarenk-dizayn-cicekleri`
Base commit: `ef32087` (`github/main`, `typescript ~5.9.3`, PR #78 "TS 5.9.3 alignment")
Report date: 2026-11-12

## Verification evidence

| Command | Result |
|---|---|
| `docker build --target test -t rengarenk-dizayn-cicekleri:test .` (the `make test` step: `npm ci` + `vite build` + `npx tsc -b`) | exit 0 — green base |
| `docker compose build app` (the `make build` step) | exit 0 — green base |
| `make verify` (= `make test` + `make build`) at this base | exit 0 — green base |
| `find . -iname "*.test.*" -o -iname "*.spec.*" --not -path "*/node_modules/*" --not -path "*/.git/*"` | 0 results — no test files |

## Test case results

| ID | Module | Scenario | Result | Reason |
|---|---|---|---|---|
| `TC_BUILD_SMOKE_001` | build | `vite build` produces a non-empty `dist/index.html` | PASS | executed via `docker build --target test` exit 0 (vite build ran as part of the test stage) |
| `TC_AUTH_REGISTER_001` | auth | registration must not grant `admin` role | NOT RUN | no test runner installed (runner gated by standing decision 3) |
| `TC_AUTH_PROTECTEDROUTE_001` | auth | `ProtectedRoute`/`AdminLayout` authorization, no `DEV` bypass | NOT RUN | no test runner installed |
| `TC_SUPERADMIN_SMOKE_001` | SuperAdminPage | backend-wired smoke test | NOT RUN | no test runner installed |
| `TC_PRODUCTPERMS_SMOKE_001` | ProductPermissionsManagement | backend-wired smoke test | NOT RUN | no test runner installed |

## Coverage

0% — zero test files, no runner, no coverage tooling configured.

## Known limitations / baseline notes

- `make` itself could not be invoked in this session because the Makefile declares `SHELL := /bin/bash` and WSL (bash) is unavailable in this environment; the equivalent `docker build --target test` and `docker compose build app` were run directly and both exited 0, so `make verify` is green at this base.
- The local canonical `main` clone (`af9e590`) is at the pre-existing `typescript ^7.0.2` baseline (Dependabot PR #75) where `npm ci` fails ERESOLVE against `typescript-eslint <6.1.0`. That is Phase 6 scope, is NOT the base this phase was built from, and is not fixed or claimed here. This phase's base (`ef32087`, TS `~5.9.3`) is green.
- No behavior regression introduced or claimed; no regression fixed; no false green reported.

## AI attribution

No AI co-author/session markers in any commit or this document (CLAUDE.md decision 12).
