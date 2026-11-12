# Changelog

All notable changes to `rengarenk-dizayn-cicekleri` are documented here.

## [Unreleased]

### Phase 7 — Dead code & restructure (`cleaner`)

**Removed**

- 24 unused shadcn UI component files under `src/components/ui/` (accordion, alert-dialog, aspect-ratio, breadcrumb, calendar, carousel, chart, collapsible, command, context-menu, drawer, hover-card, input-otp, menubar, navigation-menu, pagination, radio-group, resizable, sheet, sidebar, slider, toggle-group, toggle, use-toast).
- 5 unused root-level files: `src/App.css`, `src/components/ColorBlock.tsx`, `src/components/Header.tsx`, `src/components/ThemeToggle.tsx`, `src/types/auth.ts`.
- 19 unused dependencies and 1 unused devDependency (`@tailwindcss/typography`); lockfile resynced via `npm install --package-lock-only`.

**Kept despite tooling flags**

- `@tanstack/react-query`, `sonner`, `@radix-ui/react-tooltip` (live import sites).
- `recharts`, `react-hook-form`, `zod`, `class-variance-authority` (conservative on tool conflict).
- `autoprefixer`, `postcss`, `typescript` (depcheck false positives — config-only build pipeline).
- `src/integrations/supabase/types.ts` (`Database` type imported by supabase client).

**Verification**

- `npm run build`: exit 0 (unchanged)
- `npx tsc --noEmit -p tsconfig.app.json`: exit 0, 0 TS errors (unchanged)
- `npm run lint`: exit 1 (pre-existing eslint/@typescript-eslint incompatibility, unchanged)

No behavioral regression.
