# Test Report — Phase 11

Repo: `rengarenk-dizayn-cicekleri`
Branch: `phase-11/tests` (worktree `projects/worktrees/rengarenk-dizayn-cicekleri`)
Base commit: `2979792` (`main` — "Merge pull request #80 from RasimAghayev/phase-11/docs", `typescript ~5.9.3`)
Report date: 2026-11-14

## 1. Baseline (before this phase)

| Item | State |
|---|---|
| Test files | 0 (confirmed by the repo's own docs and by `find`) |
| Test runner | none in `package.json`; Docker `test` stage gated on `npx tsc -b` only |
| `make test` equivalent (`docker build --target test`) at `2979792` | **exit 0** — green |
| `make build` equivalent (`docker compose build app`) | **exit 0** — green |

The `typescript` / `typescript-eslint` peer conflict that made `npm ci` fail (Dependabot PR #75) is **not**
present at this base: `main` carries the TypeScript `~5.9.3` alignment, `npm ci` resolves cleanly inside the
Docker `deps` stage, and the test stage exits 0. No red baseline was inherited, and none was introduced.

## 2. Verification evidence

| # | Command | Exit | Result |
|---|---|---|---|
| 1 | `docker build --target test -t rengarenk-p11:test .` (worktree; `npm ci` + `npm run build` + `npx tsc -b`) | **0** | green — the repo's own gate still passes with the new `tests/` tree present |
| 2 | `docker compose -f docker-compose.yml build app` (`COMPOSE_PROJECT_NAME=rengarenk-p11`, `HOST_PORT=20070`) | **0** | runtime image built (`rengarenk-dizayn-cicekleri:runtime`) |
| 3 | `docker run --rm rengarenk-p11:test sh -c "npm i --no-save --no-package-lock vitest@5.1.0 @vitest/coverage-v8@5.1.0 jsdom@31.0.1 @testing-library/react@16.3.3 @testing-library/dom@10.4.1 && npx vitest run --config tests/vitest.config.ts"` | **0** | **8 test files, 66 test cases: 65 passed, 1 expected fail (known defect, §5)** |
| 4 | same, with `--coverage` | **0** | coverage table in §4 |
| 5 | same, executed **3× back to back** | **0 / 0 / 0** | identical results each run (65 passed, 1 expected fail, 4.3–5.0 s) — deterministic |
| 6 | `npx eslint tests` (inside the test image) | **0** | zero findings in the new test code |
| 7 | `npx eslint .` (whole repo, for comparison) | 1 | `75 problems (64 errors, 11 warnings)` — **exactly** the pre-existing count in `docs/BASELINE.md`/`docs/TECHNICAL_DEBT.md`; no new finding introduced |
| 8 | `docker run --rm rengarenk-p11:test sh -c "test -s /app/dist/index.html"` | **0** | `dist/index.html` = 1177 bytes, non-empty (`TC_BUILD_SMOKE_001`) |

`make verify` itself could not be invoked: the Makefile declares `SHELL := /bin/bash` and no bash/WSL is
available on this host. Commands 1 + 2 are the exact steps `make verify` runs (`make test` = `docker build
--target test`, `make build` = `docker compose build app`), executed directly with the same arguments.

## 3. Test case results

`TC_BUILD_SMOKE_001` is executed by the Docker `test` stage; every other case is a Vitest case in `tests/`.

| ID | Module | Scenario | Result |
|---|---|---|---|
| `TC_BUILD_SMOKE_001` | build | production bundle compiles and `dist/index.html` is non-empty | **PASS** (command 1 + 8) |
| `TC_CASH_CART_001` | cash | add a new product → cart line + total | PASS |
| `TC_CASH_CART_002` | cash | add the same product twice → quantity 2, total doubled | PASS |
| `TC_CASH_CART_003` | cash | out-of-stock product is ignored | PASS |
| `TC_CASH_CART_004` | cash | stock limit is enforced with a destructive toast | PASS |
| `TC_CASH_CART_005` | cash | remove one unit → quantity and total decrease | PASS |
| `TC_CASH_CART_006` | cash | removing the last unit drops the line and zeroes the total | PASS |
| `TC_CASH_CART_007` | cash | clear cart empties cart, total and payment | PASS |
| `TC_CASH_CALC_001` | cash | change = paid − total | PASS |
| `TC_CASH_CALC_002` | cash | non-numeric payment → change 0 | PASS |
| `TC_CASH_CALC_003` | cash | partial payment → negative change (debt) | PASS |
| `TC_CASH_CHECKOUT_001` | cash | checkout completes the sale and resets the register | PASS |
| `TC_CASH_CHECKOUT_002` | cash | debt checkout reports the outstanding amount | PASS |
| `TC_CASH_STOCK_001` | cash | characterization: limit is reported against the already-decremented stock (see §5) | PASS |
| `TC_CASH_STOCK_002` | cash | unknown product id → not at stock limit | PASS |
| `TC_CASH_STOCK_003` | cash | cached cart lines are re-synced with fresh stock levels | PASS |
| `TC_CASH_STOCK_004` | cash | **known defect**: limit stays open while stock remains | **EXPECTED FAIL** (`it.fails`) — §5 |
| `TC_CASH_BARCODE_001` | cash | known barcode adds the product | PASS |
| `TC_CASH_BARCODE_002` | cash | unknown barcode → destructive toast, cart untouched | PASS |
| `TC_CASH_SEARCH_001` | cash | search filters by product name, case-insensitive | PASS |
| `TC_CASH_SEARCH_002` | cash | search filters by category | PASS |
| `TC_CASH_SEARCH_003` | cash | blank search restores the full list | PASS |
| `TC_CASH_LOAD_001` | cash | categories and products load; loading flag clears | PASS |
| `TC_CASH_LOAD_002` | cash | category request failure → mock fallback + destructive toast | PASS |
| `TC_CASH_LOAD_003` | cash | selecting a category re-fetches the products | PASS |
| `TC_CASH_PERSIST_001` | cash | cart/total/payment/customer rehydrate from localStorage | PASS |
| `TC_CASH_PERSIST_002` | cash | cart changes are persisted to localStorage | PASS |
| `TC_CASH_FALLBACK_001` | cash | empty backend result leaves the list empty (no silent mock injection in the hook) | PASS |
| `TC_CASHSERVICE_CATEGORIES_001` | cashService | database rows → `Category` objects (icon re-used from mock set) | PASS |
| `TC_CASHSERVICE_CATEGORIES_002` | cashService | query error → mock categories | PASS |
| `TC_CASHSERVICE_CATEGORIES_003` | cashService | empty table → mock categories | PASS |
| `TC_CASHSERVICE_CATEGORIES_004` | cashService | client exception → mock categories | PASS |
| `TC_CASHSERVICE_PRODUCTS_001` | cashService | snake_case row → `Product` (price/stock/originalPrice/image fallback) | PASS |
| `TC_CASHSERVICE_PRODUCTS_002` | cashService | category filter applied through the query builder | PASS |
| `TC_CASHSERVICE_PRODUCTS_003` | cashService | query error → filtered mock products | PASS |
| `TC_CASHSERVICE_PRODUCTS_004` | cashService | no category / `All Products` → full mock product list | PASS |
| `TC_CASHSERVICE_PRODUCTS_005` | cashService | empty database result → fallback list for that category | PASS |
| `TC_CASHSERVICE_PRODUCTS_006` | cashService | client exception → fallback list survives | PASS |
| `TC_AUTH_REGISTER_001` | auth | sign-up metadata always carries `role: "client"`, never `admin` (P0 regression guard) | PASS |
| `TC_AUTH_REGISTER_002` | auth | successful sign-up → success toast + navigate to `/login` | PASS |
| `TC_AUTH_REGISTER_003` | auth | mismatched passwords → blocked before any network call | PASS |
| `TC_AUTH_REGISTER_004` | auth | backend sign-up error → destructive toast, no navigation | PASS |
| `TC_AUTH_REGISTER_005` | auth | thrown error → destructive toast, no navigation | PASS |
| `TC_AUTH_PROTECTEDROUTE_001` | auth | anonymous `/admin` → redirected to `/login` | PASS |
| `TC_AUTH_PROTECTEDROUTE_002` | auth | admin `/admin` → dashboard renders | PASS |
| `TC_AUTH_PROTECTEDROUTE_003` | auth | signed-in non-admin `/admin` → guard denies access (ends on `/`) | PASS |
| `TC_AUTH_PROTECTEDROUTE_004` | auth | no dev-mode bypass: `import.meta.env.DEV` is `true` under Vitest and the guard still denies | PASS |
| `TC_AUTH_PROTECTEDROUTE_005` | auth | unknown session → loading state, route unchanged | PASS |
| `TC_SUPERADMIN_SMOKE_001` | permissions | dashboard renders the four Supabase stat counts and all three tabs | PASS |
| `TC_SUPERADMIN_SMOKE_002` | permissions | restricted-access notice is rendered | PASS |
| `TC_SUPERADMIN_SMOKE_003` | permissions | non-admin is kept out of the admin layout | PASS |
| `TC_PRODUCTPERMS_SMOKE_001` | permissions | permission rows render (incl. `N/A` description) and the query hits `product_permissions` | PASS |
| `TC_PRODUCTPERMS_SMOKE_002` | permissions | empty table → empty-state message | PASS |
| `TC_PRODUCTPERMS_ERROR_001` | permissions | fetch error → destructive toast | PASS |
| `TC_PRODUCTPERMS_DELETE_001` | permissions | deletion refused while the permission is assigned to a role | PASS |
| `TC_PRODUCTPERMS_DELETE_002` | permissions | dismissed confirmation → no Supabase call, no toast | PASS |
| `TC_CASH_UI_PRODUCTS_001` | components | product card shows name, price, stock and discount state | PASS |
| `TC_CASH_UI_PRODUCTS_002` | components | out-of-stock product is badged and not clickable | PASS |
| `TC_CASH_UI_PRODUCTS_003` | components | in-stock product click adds it to the cart | PASS |
| `TC_CASH_UI_PRODUCTS_004` | components | search input forwards the term to the parent state | PASS |
| `TC_CASH_UI_PRODUCTS_005` | components | empty result → empty-state message | PASS |
| `TC_CASH_UI_PRODUCTS_006` | components | loading → skeletons instead of stale products | PASS |
| `TC_CASH_UI_PRODUCTS_007` | components | info button click does not add to the cart (propagation stopped) | PASS |
| `TC_UTIL_CN_001` | lib | conflicting Tailwind utilities: last one wins | PASS |
| `TC_UTIL_CN_002` | lib | non-conflicting utilities are all kept | PASS |
| `TC_UTIL_CN_003` | lib | falsy conditional values are ignored | PASS |
| `TC_UTIL_CN_004` | lib | object and array class inputs are supported | PASS |

Totals: **65 PASS, 1 EXPECTED FAIL (known defect), 0 FAIL, 0 BLOCKED, 0 SKIPPED, 0 N/A.**

## 4. Coverage (`@vitest/coverage-v8`, whole `src/**`)

| Metric | All files |
|---|---|
| Statements | **27.41 %** |
| Branches | 21.87 % |
| Functions | 18.21 % |
| Lines | 27.73 % |

Modules with real behaviour (the reason the suite exists):

| Module | Stmts | Branch | Funcs | Lines |
|---|---|---|---|---|
| `src/hooks/useCashRegister.ts` | 95.94 | 87.30 | 97.50 | 96.32 |
| `src/features/cash/services/cashService.ts` | 94.59 | 90.62 | 100 | 93.75 |
| `src/components/cash/ProductsSection.tsx` | 90.90 | 92.00 | 87.50 | 90.90 |
| `src/features/auth/pages/LoginPage.tsx` | 100 | 100 | 100 | 100 |
| `src/features/auth/components/RegisterForm.tsx` | 83.33 | 87.50 | 37.50 | 82.75 |
| `src/features/permissions/pages/SuperAdminPage.tsx` | 83.33 | 100 | 75 | 83.33 |
| `src/layouts/AdminLayout.tsx` | 68.42 | 69.23 | 42.85 | 68.42 |
| `src/features/permissions/components/ProductPermissionsManagement.tsx` | 53.03 | 41.46 | 50 | 55.00 |
| `src/features/permissions/components/ProductRolesManagement.tsx` | 34.84 | 27.88 | 21.53 | 37.98 |
| `src/lib/utils.ts` | 100 | 100 | 100 | 100 |
| `src/App.tsx` | 100 | 100 | 100 | 100 |
| `src/components/CashRegister.tsx` | 11.11 | 0 | 0 | 11.11 |

The low overall percentage is dominated by files this phase deliberately does not characterize: the six
mock-data admin CRUD pages (`CategoriesPage` 4.41 %, `ProductsPage` 3.94 %, `OrdersPage` 7.89 %,
`ReportsPage` 7.93 %, `UsersPage` 4.16 %, `RolesPage` 5 %), the simulated AI/onboarding/global surfaces
(0–9 %), and the generated shadcn/ui primitives (excluded from the report). That is an honest reflection of
where the behaviour is, not a coverage target that was missed.

## 5. Defect found (not fixed — R8)

**Stock accounting is off by one in `src/hooks/useCashRegister.ts`.**

`addToCart` decrements `allProducts[].stockQuantity` on every add (line 194-200) while the cart line stores an
ever-growing `quantity`; `isAtStockLimit` then compares the cart quantity against that *already decremented*
stock value (lines 258-265). Consequences, verified by the tests:

- With `stockQuantity: 2`, adding **one** unit already reports "stock limit reached" (`TC_CASH_STOCK_001`,
  `isAtStockLimit` → `true`), so the UI (`ProductsSection`, red border + disabled add) stops the shopper at
  1 of 2 units.
- With `stockQuantity: 3`, the limit is reported at 2 of 3 units.
- The two guards disagree: `addToCart`'s own check compares against the *stale* product object passed in, so it
  would still accept the third unit if called directly.

`TC_CASH_STOCK_004` encodes the intended contract ("one more unit must stay purchasable while stock remains")
via `it.fails(...)`, so the defect is documented, the suite stays green, and fixing it will turn that case red
until the wrapper is removed. **Not fixed here**: production code is out of scope for Phase 11.

## 6. Out-of-scope findings (for the Orchestrator / later phases)

1. **The suite is not wired into `package.json`, the Dockerfile `test` stage, the Makefile or CI.** Phase 11 is
   explicitly forbidden from editing those files. Wiring needs (a) a standing-decision-3 entry in
   `docs/DEPENDENCY_DECISIONS.md` for `vitest` / `jsdom` / `@testing-library/*` and (b) a `test` script +
   `RUN npx vitest run --config tests/vitest.config.ts --coverage` in the `test` stage. Until then the suite is
   executed with the documented Docker command and does **not** run on every PR, contrary to the Phase 11 ideal.
2. **Stock-limit off-by-one** — §5. Owner: the phase that owns `useCashRegister` (Phase 8/9), reopened via R8.
3. **Signed-in non-admin users bounce `/admin` → `/login` → `/`.** `ProtectedRoute` redirects to `/login`, and
   `LoginPage` immediately redirects any authenticated user to `/`, so the "Access Denied" intent is never shown
   (`TC_AUTH_PROTECTEDROUTE_003` documents the actual behaviour). Cosmetic/UX, not a security hole — access is
   still denied.
4. `npm run lint` remains non-blocking with 75 pre-existing findings (unchanged by this phase, evidence item 7).
5. The hardcoded Supabase URL/anon key in `src/integrations/supabase/client.ts` (Phase 9 item) — untouched.

## 7. Known limitations

- jsdom, not a real browser: no layout, CSS, `getUserMedia`, or `MediaRecorder` coverage; no E2E layer.
- Supabase is mocked at the transport level, so RLS policies and the ~80 % of the schema that is not
  version-controlled are not verified.
- No performance/load testing (static SPA, no server of this repo's own).
- `make verify` could not be executed through `make` (no bash on the host); the two exact commands it wraps were
  run directly (evidence items 1 and 2).

## 8. AI attribution

No AI co-author/session markers in any commit, PR or this document (CLAUDE.md decision 12).