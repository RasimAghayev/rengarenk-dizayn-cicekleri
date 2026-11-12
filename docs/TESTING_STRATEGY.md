# Testing Strategy

Repo: `rengarenk-dizayn-cicekleri` (Vite + React + TypeScript SPA, hosted Supabase backend).

## Test case IDs

Every test case is identified as `TC_<MODULE>_<SCENARIO>_<NUMBER>` (e.g. `TC_AUTH_LOGIN_001`) and recorded in `docs/TEST_REPORT.md` as one of: `PASS` / `FAIL` / `BLOCKED` / `NOT RUN` / `SKIPPED` / `N/A`. A case is marked `PASS` only after it has been executed and verified; never assumed.

## Current state

- Zero test files exist (`find src -iname "*.test.*" -o -iname "*.spec.*"` → 0 results).
- No test runner is installed (no vitest / jest / mocha / testing-library in `package.json`).
- The Docker `test` stage gates on `npx tsc -b` (TypeScript project-reference type-check across `tsconfig.app.json` + `tsconfig.node.json`) and exits 0 on the current base.
- `make verify` (= `make test` + `make build`) is green on the latest base (`github/main`, commit `ef32087`, `typescript ~5.9.3`): `docker build --target test` exit 0, `docker compose build app` exit 0.

## Test runner decision (deferred — standing decision 3)

Adding a runner (vitest + React Testing Library is the intended stack for a Vite/React app) is a new dependency. Per standing decision 3 it requires Phase 2 data (`projects/info/deps/rengarenk-dizayn-cicekleri.md`, `DEPENDENCY_MAP.md`) and a decision entry in `docs/DEPENDENCY_DECISIONS.md` before the dependency is added. That dependency decision is outside this phase's scope (R1: one agent, one phase — test-engineer does not own dependency decisions). No runner is added here, and no test is reported as `PASS` unless executed.

## Priority test cases (adopted from docs/BASELINE.md Phase 11 hand-off)

Ready to implement once a runner is available, in this order:

1. `TC_AUTH_REGISTER_001` — registration flow must not grant the `admin` role (P0: self-registration allows self-assignment of `admin`, docs/TECHNICAL_DEBT.md #1).
2. `TC_AUTH_PROTECTEDROUTE_001` — `ProtectedRoute`/`AdminLayout` authorization; no `DEV`-flag bypass reachable from a production build (docs/TECHNICAL_DEBT.md #2).
3. `TC_SUPERADMIN_SMOKE_001` — smoke test for the genuinely backend-wired `SuperAdminPage`.
4. `TC_PRODUCTPERMS_SMOKE_001` — smoke test for `ProductPermissionsManagement`.
5. `TC_BUILD_SMOKE_001` — `vite build` produces a non-empty `dist/index.html` (simplest "SPA still compiles" characterization; already covered by the Docker `test` stage, exit 0).

## Non-goals for this phase

- Do not fix the `typescript`/`typescript-eslint` peer conflict (Phase 6 scope).
- Do not add a test runner dependency without a standing-decision-3 entry.
- Do not report any test as `PASS` unless executed.
