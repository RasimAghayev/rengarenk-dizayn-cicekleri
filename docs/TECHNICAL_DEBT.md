# Technical debt

Each item states what it is, why it's debt, and which future phase owns
fixing it. Nothing here is fixed in this phase (docs-only). Folds in every
unresolved Phase 2 item plus this phase's new findings — no item is repeated
without being carried to a concrete owner phase.

## P0 — Critical

1. **Public self-registration allows self-assignment of the `admin` role.**
   `src/features/auth/components/RegisterForm.tsx`'s role dropdown value
   flows into `supabase.auth.signUp({ options: { data: { role } } })` →
   `user.user_metadata.role` → the exact field `ProtectedRoute` (`App.tsx`)
   and `AdminLayout.tsx` trust for admin access. Any visitor can become an
   admin by registering. New finding, this phase. Owner: Phase 9
   (`hardener`), with a possible Gate 5 check first (see risks in the
   per-repo plan file). Evidence: direct code read, `src/features/auth/pages/RegisterPage.tsx`,
   `RegisterForm.tsx`, `App.tsx`'s `ProtectedRoute`.
2. **Dev-mode auth bypass reachable from a real build script.**
   `ProtectedRoute`'s `isDev = import.meta.env.DEV` check grants access
   unconditionally when true; `package.json`'s `"build:dev": "vite build
--mode development"` produces exactly that build. A second instance
   exists in `AdminLayout.tsx` (dev-only loading skip);
   `src/hooks/use-user.ts`'s `createAdminUser()` creates a real
   `admin@example.com`/`adminpassword` account against the live Supabase
   project under the same flag. New finding, this phase. Owner: Phase 9.
3. **~80% of the live Supabase schema is not version-controlled.** 8 of 10
   tables, both RPC functions (`has_permission`, `has_product_permission`),
   both enums exist only in the auto-generated `src/integrations/supabase/types.ts`,
   not in `supabase/migrations/` (which has exactly one file, covering 2
   tables, and itself references the undefined `has_permission`). `git log
--follow` on `types.ts` proves schema changes were applied directly
   against the live project outside version control. No reviewable RLS
   coverage, no backup/rollback story, for most of this app's database.
   Carried forward from Phase 2's narrower observation, confirmed and
   quantified this phase. Owner: Phase 9 (write the missing migrations from
   a live schema export) — also needs real Supabase project access Phase 3
   did not have (see per-repo plan's risks).

## P1 — High

4. **All 6 admin CRUD pages are non-functional mock-data shells.**
   `CategoriesPage`, `ProductsPage`, `OrdersPage`, `ReportsPage`,
   `UsersPage`, `RolesPage` (`src/features/permissions/components/`) —
   hardcoded data, simulated loading, `console.log`-only mutations, zero
   Supabase calls. New finding, this phase. Owner: Phase 9 (decide real vs.
   documented-demo) then Phase 7 (remove dead mock scaffolding) /
   Phase 8 (DRY the shared pattern if made real).
5. **Hardcoded Supabase URL + anon key in source** instead of env vars; no
   `.env.example`; `.gitignore` doesn't cover `.env*`. Not rotation-worthy
   (RLS-gated, client-safe) but a convention gap. Carried from Phase 2.
   Owner: Phase 5 (`.env.example`) / Phase 9 (migrate `client.ts`).
6. ~~**`eslint-plugin-react-hooks` pinned to a prerelease RC build
   (`5.1.0-rc-fb9a90fa48-20240614`), two majors behind the stable `7.1.1`.**~~
   **Resolved, Phase 6:** bumped to `7.1.1` stable (along with `eslint`
   9.39.5→10.14.0, `@eslint/js`→10.0.1, `typescript-eslint` 8.11.0→8.72.1,
   `eslint-plugin-react-refresh`→0.5.7, `globals`→17.14.0). This also fixed
   the `npm run lint` tool-crash documented in `docs/BASELINE.md` finding
   #2 (verified: `eslint .` now exits 1 with real findings instead of
   exit 2 with a `TypeError`). See item 23 below for what that now exposes.
7. ~~**Multiple direct-dependency major-version gaps**: React 18→19,
   `lucide-react` 0.x→1.x, `recharts` 2.x→3.x, `sonner` 1.x→2.x,
   `tailwind-merge` 2.x→3.x, `react-day-picker` 8.x→10.x (×2 majors),
   `react-resizable-panels` 2.x→4.x (×2 majors), `@hookform/resolvers`
   3.x→7.x (×4 majors), Tailwind CSS v3→v4, TypeScript 5.6→7.x (×2 majors).~~
   **In progress, Phase 6** (one major at a time, each Docker-verified and
   committed separately — see `CHANGELOG.md` and the Phase 6 handoff for the
   running list). `react-resizable-panels` capped at `3.0.6`, not the latest
   `4.18.1` — see item 24 below for why. Full table:
   `projects/info/deps/rengarenk-dizayn-cicekleri.md`.
8. **Zero tests of any kind** for an app with a real auth/RBAC surface.
   Carried from Phase 2 (confirmed absence), elevated to P1 given the P0
   findings above that specifically need regression coverage. Owner:
   Phase 11.
9. **`npm audit`: 1 high (`minimatch` ReDoS, dev-only) + 2 moderate
   (`postcss-selector-parser` DoS via `@tailwindcss/typography`).** Carried
   from Phase 2. Owner: Phase 6.

## P2 — Moderate

10. **`bun.lockb` is dead weight** — 1 commit ever (the initial Lovable
    scaffold), never updated across 112 subsequent commits; `package-lock.json`
    is the real, maintained lockfile. Carried from Phase 2. Owner: Phase 4
    (`git-steward`).
11. **`date-fns` is a likely-unused direct dependency** — zero `grep` matches
    in `src/`. Carried from Phase 2, re-confirmed this phase. Owner: Phase 7
    (needs `knip`/`ts-prune`/`depcheck` evidence, not a grep-based deletion).
12. **Several other shadcn-wrapped packages are "maybe unused"** (`vaul`,
    `cmdk`, `embla-carousel-react`, `input-otp`, `react-resizable-panels`,
    `recharts`, `sonner`, `react-day-picker`, some single-use `@radix-ui/*`)
    — single-grep-hit heuristic only, not claimed as dead. Carried from
    Phase 2. Owner: Phase 7.
13. **Two parallel page-layout conventions** (`src/pages/` flat vs.
    `src/features/*/pages/`) coexist, never reconciled. New finding, this
    phase. Owner: Phase 7/8.
14. **`CashRegister.tsx` (380 lines) is a god-component** mixing cart state,
    pricing math, and rendering. New finding, this phase. Owner: Phase 8
    (SRP split).
15. **The AI assistant, QR scanner, and voice recorder present real-looking
    UI backed by simulated or absent logic** (canned AI responses,
    `simulateQRScan()`, no real transcription). New finding, this phase — a
    user-trust/honesty-in-UI concern as much as a functionality gap. Owner:
    Phase 9 (decide real-backend vs. explicit demo labeling).
16. **TypeScript strict-mode checks are disabled**
    (`noImplicitAny`/`strictNullChecks`/`noUnusedLocals`/`noUnusedParameters`
    all `false`). New finding, this phase. Owner: Phase 9.
17. **`package.json`'s `name` field (`vite_react_shadcn_ts`) and `README.md`
    are still the unmodified Lovable template**, never rebranded. Carried
    from Phase 2. Owner: Phase 15 (documenter) / Phase 14 (renamer, if a
    business-name mapping applies).
18. **4 open DeepSource auto-format PRs (#18/#21/#22/#24) and 1 open
    DeepSource lint issue (#20)**, unreviewed; separately, Phase 1's stated
    "22 open PRs" does not match the live count of 4 — re-confirmed this
    phase, still unresolved. Carried from Phase 2. Owner: Phase 4.

## P3 — Low

19. **No `LICENSE` file, no `license` field in `package.json`.** Owner:
    Phase 15.
20. **No Node version pin** (`.nvmrc`/`.node-version`/`engines`) anywhere.
    Owner: Phase 5 (Docker base image pin) / Phase 9 (repo-level pin).
21. **No CI, so no automated lint/secret-scan runs today** despite ESLint
    being configured locally. Owner: Phase 10.
22. **Custom brand colors in `tailwind.config.ts`** (`brandBlue`/`brandRed`/
    `brandGreen`/`brandWhite`) duplicate information already expressible via
    the existing shadcn CSS-variable palette — minor tidiness, not
    functional. Owner: Phase 7/8, low priority.
23. **`npm run lint` now runs (item 6 above resolved) and reports 75 real,
    pre-existing findings (64 errors, 11 warnings)** across application
    source, previously hidden behind the ESLint tool crash. New finding,
    this phase (Phase 6) — surfaced as a side effect of the dependency
    bump, not introduced by it; no source files were edited to produce or
    fix these. Breakdown by rule (`docker run --rm --entrypoint npm
    <build-image> run lint`, full output in the Phase 6 handoff):
    `@typescript-eslint/no-explicit-any` ×38, `react-hooks/set-state-in-effect`
    ×9, `react-hooks/immutability` ×7, `react-refresh/only-export-components`
    ×6 (warn), `react-hooks/exhaustive-deps` ×5, `react-hooks/purity` ×4,
    `react-hooks/static-components` ×2, `@typescript-eslint/no-empty-object-type`
    ×2, `@typescript-eslint/no-require-imports` ×1 (`tailwind.config.ts`).
    `npm run lint` is deliberately left out of the Docker `test` hard gate
    for this reason (see Dockerfile `test` stage comment) — `make lint`
    surfaces it non-blocking. Owner: Phase 9 (quality tooling — decide
    whether/how to re-enable `npm run lint` as a hard gate) for the
    `no-explicit-any`/`no-require-imports`/`exhaustive-deps` class; Phase 8
    (architecture/hooks correctness) for the `set-state-in-effect`/
    `immutability`/`purity`/`static-components` class, several of which
    land inside `CashRegister.tsx` (already item 14, the god-component).

24. **`react-resizable-panels` capped at `3.0.6`, one major behind the
    latest stable `4.18.1` — standing-decision-1 exception, written blocker.**
    `4.0.0` is not a renamed-API major like the others handled this phase
    (`react-day-picker`, `lucide-react`, `recharts`); confirmed by reading
    the shipped `.d.ts` of both versions in a scratch container that it is
    a ground-up rewrite by the same maintainer (bvaughn/react-resizable-panels,
    verified via `npm view ... repository.url` — not a hijacked/renamed
    package) into a general docking/workspace library: `Panel`/`PanelGroup`/
    `PanelResizeHandle` are gone entirely, replaced by a new `Group`/`Panel`/
    `Separator`/`Grid`/`Workspace`/`Tab`/`Tabset` concept set with a
    different props shape (`defaultLayout`, `orientation`, imperative
    handles, etc.) and no 1:1 mapping. The only consumer in this repo,
    `src/components/ui/resizable.tsx`, has **zero importers** (confirmed via
    `grep -rln "ui/resizable" src`) — guess-porting a completely different
    API on dead code with no runtime consumer to validate against, and no
    test suite, would mean shipping an unverifiable rewrite, which the
    honesty discipline in `CLAUDE.md` ("document the assumption instead of
    guessing") rules out. Highest compatible version kept meanwhile: `3.0.6`
    (last release still exposing the familiar `Panel`/`PanelGroup`/
    `PanelResizeHandle` API this wrapper uses; peerDependencies confirm
    React 16–19 support). Verified: `docker build --no-cache --target test`
    and `docker compose build --no-cache app`, both exit 0 at `3.0.6`.
    Owner: Phase 7 (`cleaner`) should resolve this by deleting
    `resizable.tsx` as dead code (same disposition as `calendar.tsx`'s
    react-day-picker-v8-era dead-code precedent would suggest, but confirm
    with real tooling, not a grep guess) — at that point this debt item and
    the `react-resizable-panels` dependency itself disappear together. If a
    future phase instead decides to resurrect/use this wrapper, the v4
    migration must be done then, with a real consumer to validate against.

## Not treated as debt

- **The app's multi-surface, seemingly-unfocused scope** (cash register +
  RBAC panel + onboarding + global dashboard + AI assistant, with no single
  obvious "main" product). This is a product-direction question for Rasim,
  documented as an open risk in the per-repo Phase 4-11 plan
  (`projects/info/analysis/rengarenk-dizayn-cicekleri-plan.md`), not a code
  defect to silently "fix" by picking a direction unilaterally.
- **The two genuinely real Supabase-backed screens** (`SuperAdminPage.tsx`,
  `ProductPermissionsManagement.tsx`) — these work correctly against the
  live schema's versioned portion and are not debt.
- **Supabase's own anon-key client-exposure design** — the hardcoded key
  itself is not debt (it's meant to be public); only its hardcoded-in-source
  _location_ (vs. an env var) and the missing `.env.example` are.
