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

- **build(deps):** bumped Radix UI and small UI-primitive packages to
  latest stable - 18 `@radix-ui/react-*` packages (minor bumps, no
  majors), `cmdk` 1.0.0→1.1.1, `embla-carousel-react` 8.3.0→8.6.0,
  `input-otp` 1.2.4→1.5.0. All peer-compatible with `react@18` and already
  declare `react@19` support ahead of this repo's eventual React 19
  migration. Commit `f728a0b`. Verified: `make verify` → exit 0.
- **build(deps):** bumped `@tanstack/react-query` 5.59.16→5.106.1 and
  `react-hook-form` 7.53.1→7.91.0 (both same-major, minor bumps) - the
  react-hook-form bump also clears the `^7.55.0` peer floor
  `@hookform/resolvers`' own upcoming major needs. Commit `243660c`.
  Verified: `make verify` → exit 0.
- **build(deps):** bumped `@hookform/resolvers` 3.9.0→7.0.3 (4 majors) and
  migrated the zod-resolver typing in `InventoryManagement.tsx` and
  `AdminSettingsPage.tsx`. Breaking change, migrated (type-only, no
  behavior change): the newer `Resolver`/`useForm` typing distinguishes a
  zod schema's input type (pre-coercion) from its output type
  (post-coercion); switched both files' `useForm<X>` calls to the
  3-generic `useForm<Input, unknown, Output>` form (`Input =
  z.input<typeof schema>`), plus two `value={field.value as number |
  string}` casts in `InventoryManagement.tsx` for its two
  `z.coerce.number()` fields. Commit `2500d35`. Verified: `docker build
  --no-cache --target test .` → exit 0 (`tsc -b` clean); `docker build
  --no-cache .` → exit 0; `make verify` → exit 0.
- **build(deps):** bumped `date-fns` 3.6.0→4.4.0 (major) and
  `react-day-picker` 8.10.2→10.0.2 (two majors) together - v10 vendors
  `date-fns@^4.1.0` as a direct dependency rather than a peer, so bumping
  `date-fns` alone first produced a peer warning; bumping both at once
  removes the conflict instead of masking it. Breaking change, migrated:
  rewrote `src/components/ui/calendar.tsx`'s `classNames`/`components`
  mapping from v8's key names to v10's real `UI` enum values
  (`month_caption`, `month_grid`, `weekdays`, `weekday`, `week`,
  `day`/`day_button`, `selected`, `outside`, `disabled`, `range_end`,
  `range_middle`, `hidden`, `button_previous`/`next`, `Chevron` replacing
  `IconLeft`/`IconRight`) - identical Tailwind classes, same visual
  output. This wrapper has zero importers anywhere in the app (confirmed
  via `grep -rln "ui/calendar" src`) but was migrated rather than left
  broken, since `tsc -b` type-checks it regardless of the import graph;
  actual removal is Phase 7's call. Commit `28b69c1`. Verified: `make
  verify` → exit 0.
- **build(deps):** bumped `lucide-react` 0.462.0→1.70.0 (major). Diffed
  every one of the 61 distinct icon names imported anywhere in `src/`
  against the new version's real export list - only `Facebook` was
  removed (lucide-react 1.x dropped all brand/social icons). Fix:
  `LoginForm.tsx`'s Facebook button now uses an inline SVG of the real
  glyph (matching the existing in-file pattern already used for the
  Google button), same size/color, no visual change. Commit `80c3873`.
  Verified: `docker build --no-cache --target test .` → exit 0; `docker
  build --no-cache .` → exit 0; `make verify` → exit 0.
- **build(deps):** bumped `tailwind-merge` 2.5.4→3.7.0 (major). Only usage
  is the standard `twMerge(clsx(...))` call in `src/lib/utils.ts`'s
  `cn()` helper - stable API across this major, no source changes needed.
  Commit `bf7b225`. Verified: `make verify` → exit 0.
- **build(deps):** bumped `vaul` 0.9.3→1.1.2 (major). `drawer.tsx` uses
  only the stable `Root`/`Trigger`/`Portal`/`Close`/`Overlay`/`Content`/
  `Title`/`Description` API, unchanged across this major; the wrapper
  itself has zero importers in this repo (dead code). Commit `b90f20c`.
  Verified with `--no-cache` (a first cached run looked suspiciously
  all-cached given the dependency edit, so re-ran clean to be sure):
  `docker build --no-cache --target test .` → exit 0; `docker compose
  build --no-cache app` → exit 0.
- **build(deps):** bumped `sonner` 1.5.0→2.0.8 (major). `sonner.tsx` uses
  only the stable `Toaster` component API (`theme`, `className`,
  `toastOptions.classNames`), unchanged across this major. Commit
  `ddae88b`. Verified with `--no-cache`: both the test-stage build and the
  full runtime build → exit 0.
- **build(deps):** bumped `recharts` 2.12.7→3.10.1 (major). The live,
  routed `ReportsPage.tsx` uses only the stable chart-component API
  unchanged across this major - no source changes needed there. The dead
  (zero-importer) `src/components/ui/chart.tsx` wrapper needed migrating
  since `tsc -b` type-checks it unconditionally: v3 splits Tooltip's
  component props from its content-render-callback props (`payload`/
  `label`/`coordinate`/`active`/`accessibilityLayer` moved to the new
  `TooltipContentProps` type), and similarly drops `payload` from
  `LegendProps` (kept on the renderer-facing `DefaultLegendContentProps`
  type); also `Payload.dataKey` is now typed as possibly a function, not
  assignable to React's `key` prop. Fixed by swapping
  `ChartTooltipContent`'s prop type to `RechartsPrimitive.TooltipContentProps`,
  `ChartLegendContent`'s `Pick<>` source to `DefaultLegendContentProps`,
  and reusing an already-computed string key instead of the raw
  `item.dataKey`. Commit `8f1fe2e`. Verified with `--no-cache`: both
  builds → exit 0.
- **build(deps):** bumped `react-resizable-panels` 2.1.3→**3.0.6**, not
  the actual latest stable `4.18.1` - documented standing-decision-1
  exception, `docs/TECHNICAL_DEBT.md` item 24. `4.0.0` is a ground-up
  rewrite by the same maintainer into a general docking/workspace
  library (`Panel`/`PanelGroup`/`PanelResizeHandle` replaced entirely by
  `Group`/`Panel`/`Separator`/`Grid`/`Workspace`/`Tab`/`Tabset`, no 1:1
  mapping), confirmed by reading both versions' shipped `.d.ts` files.
  The sole consumer, `resizable.tsx`, has zero importers - guess-porting
  an unrelated API on dead code with no consumer or test suite to
  validate against would be an unverifiable rewrite. `3.0.6` is the last
  release still exposing the familiar API, peer-compatible with React
  16-19. Commit `046143f`. Verified with `--no-cache`: both builds →
  exit 0.

- **build(deps):** bumped `@types/node` 22.5.5→26.6.6 (four majors) to
  match the Node runtime the Dockerfile already pins
  (`node:26.13.0-alpine3.24`). Commit `7dddd00`. Verified: both builds →
  exit 0.
- **build(deps):** bumped TypeScript 5.5.3→**6.0.3**, not the actual
  latest stable `7.0.2` - documented standing-decision-1 exception,
  `docs/TECHNICAL_DEBT.md` item 25. `typescript-eslint@8.72.1` (latest
  stable) caps its `typescript` peer at `<6.1.0`; no released
  `typescript-eslint` version supports TS7 yet. `6.0.3` is the highest
  release inside that range and a real upgrade over `5.5.3`. Fixed two
  real breaks surfaced by the bump: dropped the now-deprecated `baseUrl`
  from `tsconfig.json`/`tsconfig.app.json` (TS5101 - `paths` already
  resolves relative to each config file with no `baseUrl` set, same
  result); switched `VoiceRecorder.tsx`'s `timerRef` from `NodeJS.Timeout`
  (a browser-only component had no business depending on the Node global
  namespace) to the cross-environment-safe
  `ReturnType<typeof setTimeout>`. Commit `a44f4ae`. Verified with
  `--no-cache`: both builds → exit 0.
- **build(deps):** migrated Tailwind CSS v3.4.11→v4.3.4 (CSS-first
  config) using the official `@tailwindcss/upgrade` codemod, then
  finished by hand what it couldn't complete automatically (its
  template-class-migration step crashed on `bun` not being present in
  the scratch container - checked afterward that this repo doesn't use
  any utility class that changed name/meaning in v4, so nothing was
  actually missed). `src/index.css`'s `@tailwind` directives became
  `@import 'tailwindcss'` plus a `@theme`/`@custom-variant`/`@utility`/
  `@plugin` block carrying everything `tailwind.config.ts`'s
  `theme.extend`/`darkMode`/`plugins` used to define.
  `postcss.config.js`'s `tailwindcss`+`autoprefixer` pair became
  `@tailwindcss/postcss` (v4 bundles vendor-prefixing internally;
  `autoprefixer` removed as a devDependency per the official migration
  guide). `tailwind.config.ts` itself is now dead/inert - left in place,
  Phase 7's call (`docs/TECHNICAL_DEBT.md` #12a). Commit `0e60554`.
  Verified with `--no-cache`: both builds → exit 0; additionally
  extracted the built runtime image's compiled CSS and confirmed the
  migrated brand colors, sidebar colors, float keyframe/animation, and
  the v4 border-color compatibility shim all compiled correctly.
- **build(deps):** bumped React 18.3.1→19.3.1 and `@types/react`/
  `@types/react-dom` 18.x→19.3.0 (major) - the framework bump, sequenced
  deliberately last since every other direct dependency's latest stable
  was already confirmed (via live peer-dependency queries made before
  each earlier bump this phase) to support both React 18 and 19, so this
  carries no compound peer-conflict risk. No source changes needed - `tsc
  -b` and `vite build` both clean against the React 19 types. Commit
  `c128386`. Verified with `--no-cache`: both builds → exit 0.
- **chore(deps):** ran `npm outdated` against the fully-upgraded tree -
  confirms only the two documented exceptions above
  (`react-resizable-panels` capped at `3.0.6`, TypeScript capped at
  `6.0.3`) remain behind latest; every other direct and transitive
  dependency is current. Ran `npm audit` - 12 moderate / 0 high / 0
  critical findings (down from the Phase 2/5 baseline's 1 high), all
  tracing to two upstream-unfixed advisories (`minimatch` via `eslint`/
  `typescript-eslint`, `postcss-selector-parser` via
  `@tailwindcss/typography`) where both affected packages are already at
  their own latest stable and the only `npm audit fix` path is `--force`,
  which would downgrade both - not applied, since that's the wrong
  direction under standing decision 1. Full analysis and re-check
  instructions: `docs/TECHNICAL_DEBT.md` item 9.

<!-- Further Phase 6 entries appended below as the upgrade proceeds. -->
