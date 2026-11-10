# Baseline — rengarenk-dizayn-cicekleri

Behavior contract captured at the end of Phase 5 / start of Phase 7.
All verification runs in this project use npm scripts directly (no
Makefile/Dockerfile exists in this repo; see Phase 5 gap).

## Verification signature (pre-Phase 7)

| Command | Exit code | Notes |
|---|---|---|
| `npm run build` | 0 | Vite production build succeeds |
| `npx tsc --noEmit -p tsconfig.app.json` | 0 | 0 TypeScript errors, no error files |
| `npm run lint` | 1 | Pre-existing eslint/@typescript-eslint version incompatibility (`no-unused-expressions` rule load failure), unrelated to Phase 7; unchanged by Phase 7 |

- TS error count: 0; TS error file list: none.
- Test suites: none (no test framework installed); test count: 0.
- Named Jest PASS/FAIL suite list: n/a (no Jest).

## Phase 7 — Dead code & restructure (cleaner)

Tooling cross-validation (all run, exit codes recorded):

| Tool | Exit code | Outcome |
|---|---|---|
| `npx knip` | non-zero | Flagged 29 unused files, 19 unused deps, 1 unused devDep |
| `npx ts-prune` | 0 | No unused exports reported |
| `npx depcheck` | non-zero | Flagged 4 unused devDeps; `@tailwindcss/typography` confirmed unused; `autoprefixer`/`postcss`/`typescript` are build-pipeline config-only (kept — depcheck false positives) |

Manual verification (grep over `src/`) confirmed every knip-flagged package and file had zero import sites, except the live ones deliberately kept below.

### Removed (3 commits)

`refactor: remove unused shadcn UI component files` — 24 files:
`src/components/ui/{accordion,alert-dialog,aspect-ratio,breadcrumb,calendar,carousel,chart,collapsible,command,context-menu,drawer,hover-card,input-otp,menubar,navigation-menu,pagination,radio-group,resizable,sheet,sidebar,slider,toggle-group,toggle,use-toast}.tsx`

`refactor: remove unused root-level files and types` — 5 files:
`src/App.css`, `src/components/ColorBlock.tsx`, `src/components/Header.tsx`, `src/components/ThemeToggle.tsx`, `src/types/auth.ts`

`refactor: remove unused dependencies` — package.json + package-lock.json:
19 dependencies (`@radix-ui/react-accordion/alert-dialog/aspect-ratio/collapsible/context-menu/hover-card/menubar/navigation-menu/radio-group/slider/toggle/toggle-group`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `vaul`) and 1 devDependency (`@tailwindcss/typography`).

### Kept despite tooling flags (judgment calls)

- `@tanstack/react-query`, `sonner`, `@radix-ui/react-tooltip`: live import sites in `src/App.tsx`, `src/components/ui/sonner.tsx`, `src/components/ui/tooltip.tsx` (knip/depcheck did not flag these; kept).
- `recharts`, `react-hook-form`, `zod`, `class-variance-authority`: knip did not flag as unused; kept (conservative on tool conflict).
- `autoprefixer`, `postcss`, `typescript`: depcheck flagged but are config-only build-pipeline packages (kept — depcheck false positives per skill step 4).
- `src/integrations/supabase/types.ts`: knip flagged individual exported types, but `Database` type is imported by `src/integrations/supabase/client.ts`; file kept.
- Exported error/contract types with no current call sites: kept per YAGNI (skill step 5) — not a present problem to solve.

### Post-Phase 7 verification signature

| Command | Exit code | Delta vs pre-Phase 7 |
|---|---|---|
| `npm run build` | 0 | unchanged (still passes) |
| `npx tsc --noEmit -p tsconfig.app.json` | 0 | unchanged (0 errors) |
| `npm run lint` | 1 | unchanged (pre-existing eslint incompatibility) |

No regression introduced by Phase 7. Build output shrank (removed unused UI CSS/JS), but no error-count or suite-list change.

### Out of scope for Phase 7 (deferred to later phases)

- `bun.lockb` removal (Phase 4/git-steward)
- 6 mock admin CRUD pages (Phase 9 decision, then Phase 7 removal if made real)
- `CashRegister.tsx` god-component split (Phase 8)
- `src/pages/` vs `src/features/*/pages/` layout reconciliation (Phase 7/8 — not executed; scope decision pending)
- TypeScript strict-mode flags (Phase 9)
- Supabase URL/key env migration (Phase 9)
- Registration privilege-escalation P0 fix (Phase 9)
