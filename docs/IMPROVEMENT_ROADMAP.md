# Improvement roadmap

Sequencing for `docs/TECHNICAL_DEBT.md`'s items across this program's
remaining phases for this repo. Mirrors the per-repo Phase 4-11 plan in
`projects/info/analysis/rengarenk-dizayn-cicekleri-plan.md` (full detail
there); this file is the short, sequenced, action-oriented view.

## Before anything else — Rasim's decisions (blocking Phase 9's scope)

1. **Product scope**: is the product-permissions/RBAC admin panel the
   actual intended product (the only surface with a complete real backend),
   with the cash register / onboarding / global dashboard / AI assistant
   treated as separate demos or deprecated — or is the intent to make all
   of them real? This determines most of Phase 9's actual workload.
2. **Registration-flow fix exposure check**: before removing the public
   admin-role self-selection (P0 fix), confirm via live Supabase access
   whether any real external account already depends on it (this repo-only
   audit could not check `auth.users` directly). If yes, Gate 5 applies.

## Phase 4 — Git hygiene

- Delete `bun.lockb`; harden `.gitignore` for `.env*`; add a secret-scan
  pre-commit hook.
- Triage the 4 open DeepSource PRs + issue #20; reconcile/record the
  22-vs-4 PR count discrepancy.

## Phase 5 — Container baseline

- Dockerfile/compose/Makefile from scratch (nothing exists today).
- `.env.example` with `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`.
- Explicitly document that `"build"` (not `"build:dev"`) is the only script
  that should ever produce a deployable image.
- First-ever real build+preview, recorded in `docs/BASELINE.md`.

## Phase 6 — Upgrade to latest

- One major at a time, Docker-verified each: React 19, Tailwind v4,
  `lucide-react`, `recharts`, `sonner`, `tailwind-merge`, `react-day-picker`,
  `react-resizable-panels`, `@hookform/resolvers`, TypeScript 7,
  `eslint-plugin-react-hooks` off its RC pin onto stable 7.x, remaining
  devDependency majors.
- Resolve the `minimatch`/`postcss-selector-parser` `npm audit` findings as
  part of their parent packages' own upgrades.

## Phase 7 — Dead code & restructure

- Run `knip`/`ts-prune`/`depcheck`; resolve `date-fns` and the other
  "maybe unused" packages with real evidence.
- Reconcile `src/pages/` vs. `src/features/*/pages/` into one layout
  convention.

## Phase 8 — Architecture

- Split `CashRegister.tsx` (SRP: cart/pricing hook + presentational
  component).
- DRY the 6 mock-CRUD admin pages' shared pattern once (if) Phase 9 makes
  them real.
- DDD/EDA/Clean-Hexagonal explicitly `n/a` for this repo — no case strong
  enough to introduce them (see per-repo plan for reasons).

## Phase 9 — Hardening (highest-value phase for this repo)

1. Fix the P0 registration privilege-escalation path (remove public
   admin-role self-selection; new users default to lowest privilege; admin
   assignment happens through an authenticated admin action against the
   already-existing `user_product_roles`/`product_role_assignments` tables).
2. Remove or properly gate every `import.meta.env.DEV` auth-bypass instance
   (`ProtectedRoute`, `AdminLayout.tsx`, `use-user.ts`'s `createAdminUser()`).
3. Write the missing migrations for the 8 untracked tables / 2 RPC functions
   / 2 enums from a live schema export (not guessed from `types.ts` alone).
4. Decide and execute the mock-admin-pages / simulated-AI-QR-voice question
   per Rasim's product-scope decision above.
5. Move the hardcoded Supabase URL/key to env vars.
6. Fix TypeScript strict-mode flags, migrating incrementally.

## Phase 10 — CI/CD

- Full pipeline from scratch: lint+typecheck → Docker build+test → secret
  scan → publish on tag. SHA-pinned actions from day one.

## Phase 11 — Tests

- Priority order: registration-flow regression (no admin self-assignment) →
  `ProtectedRoute`/`AdminLayout` authorization tests (no DEV-flag bypass in
  a production build) → RLS-policy tests against the newly-versioned
  migrations → component tests for the two real Supabase screens →
  regression tests for whichever mock pages went real.

## Later phases (13-17), as they apply

- **Phase 13 (lib-extractor)**: no duplication across repos identified for
  this repo specifically in this audit; revisit once `DUPLICATION_MAP.md`
  is built across all repos.
- **Phase 14 (renamer)**: `package.json`'s `name` and the repo's own
  business-name mapping — decide together with the Phase 15 rebrand.
- **Phase 15 (documenter)**: README rewrite (currently unmodified Lovable
  template), `LICENSE` file, `DEPENDENCY_DECISIONS.md` entries for any new
  library Phase 9 ends up adding (real QR decode / real AI backend client),
  Mermaid diagrams of the real (post-Phase-9) Supabase schema.
- **Phase 16 (platform-engineer)**: not applicable unless this repo is
  folded into a platform umbrella — no indication of that in this audit.
