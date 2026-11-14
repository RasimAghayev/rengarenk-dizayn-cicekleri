# Testing Strategy

Repo: `rengarenk-dizayn-cicekleri` (Vite + React 19 + TypeScript SPA, hosted Supabase backend).
Phase: 11 (tests). Scope of this document: what is tested, how it is executed, and what is deliberately **not** tested.

## Test case IDs

Every test case is identified as `TC_<MODULE>_<SCENARIO>_<NUMBER>` (e.g. `TC_AUTH_LOGIN_001`) and is
recorded in `docs/TEST_REPORT.md` as one of: `PASS` / `FAIL` / `BLOCKED` / `NOT RUN` / `SKIPPED` / `N/A`.
A case is `PASS` only after it has actually been executed. The test title in the source file carries the
same ID, so a report row can always be traced to a single `it(...)` block.

Known-defect cases use Vitest's `it.fails(...)`: the body asserts the *intended* contract and is expected to
fail while the defect exists. The suite stays green, the defect stays visible, and the test starts failing
loudly the moment somebody fixes it — at which point the `it.fails` wrapper must be removed.

## Stack and runner

| Concern | Choice | Why |
|---|---|---|
| Test runner | Vitest 5.1.0 | Vite-native; reuses the app's own transform pipeline (`@vitejs/plugin-react-swc`) and `resolve.alias` |
| Environment | jsdom 31.0.1 | React component rendering without a real browser |
| Component queries | `@testing-library/react` 16.3.3 + `@testing-library/dom` 10.4.1 | Behaviour-level queries (role/label/text), React 19 compatible |
| Coverage | `@vitest/coverage-v8` 5.1.0 | V8 native, no extra instrumentation step |
| Assertions/mocks | Vitest built-ins (`expect`, `vi`) | No Jest, no sinon, no extra assertion library |

Versions are the latest stable published on npm at the time of writing (checked from inside
`node:26.13.0-alpine3.24`, the repo's own base image) and are compatible with the repo's `vite ^8.3.7`
(peer range `^6.4.0 || ^7.0.0 || ^8.0.0`).

## Layout

```
tests/
├── vitest.config.ts                     # test-only Vite/Vitest config (jsdom, "@" alias, coverage)
├── setup.ts                             # jsdom API stubs (matchMedia/ResizeObserver/...) + cleanup
├── helpers/
│   ├── supabaseMock.ts                  # chainable Supabase query-builder mock + call recording
│   └── fixtures.ts                      # Product factory
├── cash/
│   ├── useCashRegister.test.ts          # hook: cart, totals, stock, barcode, search, persistence
│   └── cashService.test.ts              # Supabase → Product/Category mapping + mock fallbacks
├── auth/
│   ├── registerForm.test.tsx            # registration must never self-assign `admin`
│   └── protectedRoute.test.tsx          # /admin guard (anonymous, admin, non-admin, loading)
├── permissions/
│   ├── superAdminPage.test.tsx          # dashboard smoke test (real Supabase queries, mocked transport)
│   └── productPermissionsManagement.test.tsx  # list/empty/error/delete-guard
├── components/
│   └── productsSection.test.tsx         # product grid rendering + click behaviour
└── lib/
    └── cn.test.ts                       # class-name merge helper
```

`tests/vitest.config.ts` is a **test-only** file: the application's root `vite.config.ts`, `package.json`,
`Dockerfile`, `Makefile` and CI workflow are not modified by Phase 11 (R1: tests only). See
"Known limitations" below for the consequences.

## How to run

The repo gate (`make test` → `docker build --target test`) type-checks with `npx tsc -b`; it does **not**
run this suite, because wiring a runner into `package.json`/Dockerfile/CI is outside this phase's scope.
Until that wiring lands, run the suite in Docker against the repo's own `test` stage image:

```sh
# 1. Build the repo's test stage (npm ci + vite build + tsc -b)
docker build --target test -t rengarenk-p11:test .

# 2. Run the suite inside that image. The runner packages are installed into the
#    container's own node_modules only (--no-save --no-package-lock): the repo's
#    package.json / package-lock.json are never touched.
docker run --rm rengarenk-p11:test sh -c "\
  npm i --no-save --no-package-lock \
    vitest@5.1.0 @vitest/coverage-v8@5.1.0 jsdom@31.0.1 \
    @testing-library/react@16.3.3 @testing-library/dom@10.4.1 && \
  npx vitest run --config tests/vitest.config.ts --coverage"
```

Exit code 0 = green. Add `--coverage` for the coverage table; omit it for the fast path (~5 s).

`COMPOSE_PROJECT_NAME=rengarenk-p11` and the repo's reserved port block (20070-20079, `projects/info/state/ports.md`)
are used for any container that needs a name/namespace; the test run itself needs no published port.

## Layers

| Layer | Where | What it proves |
|---|---|---|
| Unit — hook logic | `tests/cash/useCashRegister.test.ts` | cart arithmetic, stock guards, change/debt math, barcode lookup, search filtering, localStorage persistence, error fallbacks |
| Unit — service mapping | `tests/cash/cashService.test.ts` | snake_case → domain mapping, category filtering, mock-data fallback on error/empty |
| Unit — pure helper | `tests/lib/cn.test.ts` | Tailwind class merge/conflict resolution |
| Component | `tests/components/productsSection.test.tsx`, `tests/auth/registerForm.test.tsx` | rendering, disabled/enabled states, click targets, form validation and submit payloads |
| Integration | `tests/auth/protectedRoute.test.tsx`, `tests/permissions/*.test.tsx` | real routing + real page components + real Supabase query call-sites against a mocked transport |
| Build smoke | Docker `test` stage (`npx tsc -b` + `npm run build`) | the SPA still compiles and `dist/index.html` is produced (`TC_BUILD_SMOKE_001`) |

## Mocking policy

Mocked (with a reason):

- **`@/integrations/supabase/client`** — the only external system. The mock implements the query-builder chain
  the app uses (`from().select().eq()…`, `insert/update/delete`, `rpc`, `auth`) and **records** every
  table/operation so tests can assert *which* data was requested, not only what rendered.
  No test performs network I/O; the suite is deterministic and offline.
- **`@/features/cash/services/cashService`** in hook tests — so the hook's own state machine is tested in
  isolation; the service has its own dedicated tests.
- **`@/hooks/use-toast`** where a toast is an observable side effect (asserted), and **`@/hooks/use-user`**
  where the authenticated user is the input (App/layout tests).

Not mocked (deliberately): the components and hooks under test, React Router, `react-hook-form` + `zod`,
Radix UI primitives, Tailwind class helpers. Mocking those would test the mock, not the app.

## Determinism rules

- No `fetch`, no timers, no `Math.random`, no dependency on execution order.
- `localStorage` is cleared before every test and `cleanup()` runs after every test (`tests/setup.ts`).
- Supabase mock state is reset in `beforeEach`; mock call history is reset by `restoreMocks: true`.
- jsdom gaps (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView`) are stubbed once in setup.
- Expected error paths keep `console.error` silent so a green run has a readable log.
- Verified by running the suite three times back to back: identical results (8 files, 65 passed, 1 expected fail).

## Coverage policy

Coverage is reported honestly with `@vitest/coverage-v8`, including files that no test touches.
Generated shadcn/ui primitives (`src/components/ui/**`), the auto-generated Supabase types and the Vite
entry point are excluded — they contain no project logic and are re-generated by tooling.

Current result (see `docs/TEST_REPORT.md`): **27.41 % statements** across `src/**` — the suite concentrates on
the modules with real behaviour (cash register hook 95.94 %, cash service 94.59 %, `cn` 100 %,
`RegisterForm` 83.33 %, `SuperAdminPage` 83.33 %, `ProductsSection` 90.9 %) and does not pretend to cover the
mock-data admin shells.

## Priority order (why these modules first)

1. `TC_AUTH_REGISTER_*` — regression guard for the P0 privilege-escalation finding (registration must never
   submit `admin`).
2. `TC_AUTH_PROTECTEDROUTE_*` — the `/admin` guard, including "no dev-mode bypass" (the suite itself runs with
   `import.meta.env.DEV === true`, so a bypass would fail these tests).
3. `TC_SUPERADMIN_SMOKE_*` / `TC_PRODUCTPERMS_SMOKE_*` — the only two genuinely backend-wired screens.
4. `TC_CASH_*` — the largest real business-logic surface (the `useCashRegister` hook extracted in Phase 8, ADR-0001).
5. `TC_BUILD_SMOKE_001` — cheapest possible "the SPA still compiles" characterization.

## Known limitations

- **The runner is not wired into the repo's own gate.** `package.json` (test script + devDependencies),
  `Dockerfile` (`test` stage), `Makefile` and the CI workflow are Phase 6/10 artefacts and are off-limits to
  Phase 11 (R1, explicit instruction). Consequence: `make verify` and CI do not execute this suite yet; it is
  run with the Docker command above. Wiring requires a standing-decision-3 entry in
  `docs/DEPENDENCY_DECISIONS.md` plus a one-line `test` script — an Orchestrator-level follow-up.
- **No real Supabase.** The transport is mocked, so RLS policies and the ~80 % of the schema that is not
  version-controlled are *not* verified by these tests. Only the client-side call-sites and mapping are.
- **jsdom is not a browser.** Layout, CSS, real camera (`getUserMedia`), and `MediaRecorder` behaviour are not
  exercised. There is no Playwright/Cypress E2E layer.
- **No performance/load testing** — this is a static SPA with no server of its own.
- The six mock-data admin CRUD pages (`CategoriesPage`, `ProductsPage`, `OrdersPage`, `ReportsPage`,
  `UsersPage`, `RolesPage`) are deliberately untested beyond incidental import coverage: they have no
  persistence to characterize (see `docs/REPOSITORY_AUDIT.md`).
- Lint stays non-blocking in CI: the pre-existing 75 ESLint findings are unchanged by this phase
  (`npx eslint tests` → exit 0, zero findings).