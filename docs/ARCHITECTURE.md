# Architecture

## What this is

A Vite + React 18 + TypeScript single-page application, originally
scaffolded by Lovable.dev (`gpt-engineer-app[bot]` is the dominant commit
author — 67 of 113 commits), styled with shadcn/ui on Tailwind CSS v3, backed
by Supabase (Postgres + Auth + Row Level Security) consumed directly from the
browser. No server of this program's own exists — Supabase is the only
backend, and it is a third-party BaaS, not a repo this program owns.

The app's actual subject is ambiguous relative to its name (see
`projects/info/analysis/rengarenk-dizayn-cicekleri.md`'s "Business purpose"
section) — the code implements several loosely-related surfaces rather than
one coherent product: a retail cash-register/POS module, a product-level
RBAC/permissions admin panel (the only one with a complete real backend), a
generic onboarding wizard, a "global dashboard" demo, and an "AI assistant"
page. What follows documents what each surface actually does, distinguishing
real functionality from mock/simulated functionality throughout.

## Routing (`src/App.tsx`)

Single `BrowserRouter` route table. Public routes: `/`, `/login`,
`/register`. Protected routes wrapped in `ProtectedRoute`:

```tsx
const isDev = import.meta.env.DEV;
const hasAccess = isDev || (user && user.user_metadata?.role === "admin");
```

This is the single authorization gate for every admin-facing route in the
app. It has two defects, detailed in `REPOSITORY_AUDIT.md` and
`TECHNICAL_DEBT.md`:

1. `isDev` is a Vite build-time flag, true whenever the app is built with
   `--mode development` (i.e. the `"build:dev"` npm script) — a bypass that
   can ship in a built artifact, not just `vite dev`.
2. `user.user_metadata?.role` is attacker-controllable at registration time
   (see "Auth" below) — the gate trusts a field the user themselves can set.

`AdminLayout.tsx` duplicates a milder version of the same `isDev` check (a
`setTimeout`-based loading skip), so the dev-mode shortcut exists in two
places, not one.

## Pages / feature inventory — real vs. mock, stated explicitly

| Surface                                                        | Location                                                                                                           | Backend reality                                                                                                                                                                                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Marketing landing page                                         | `src/pages/Index.tsx`                                                                                              | Static content, no backend.                                                                                                                                                                                                                                  |
| Login / Register                                               | `src/features/auth/`                                                                                               | **Real** — `supabase.auth.signInWithPassword`/`signUp`, OAuth (Google/Facebook), `onAuthStateChange`. Register form includes a role-selection dropdown (see Auth below — this is the P0 finding).                                                            |
| Cash register (POS)                                            | `src/components/CashRegister.tsx`, `src/components/cash/`, `src/features/cash/services/cashService.ts`             | Mixed — `cashService.ts` attempts a real Supabase query with a mock-data fallback; `mockData.ts` supplies generic placeholder products. 380-line `CashRegister.tsx` mixes cart state, pricing math, and rendering in one component (SRP candidate, Phase 8). |
| Super admin dashboard                                          | `src/features/permissions/pages/SuperAdminPage.tsx`                                                                | **Real** — live Supabase-backed dashboard stats, one of two genuinely real admin screens.                                                                                                                                                                    |
| Product permissions management                                 | `src/features/permissions/components/ProductPermissionsManagement.tsx`                                             | **Real** — full Supabase CRUD example (create/read/update/delete against the permissions tables). The other genuinely real admin screen.                                                                                                                     |
| Categories / Products / Orders / Reports / Users / Roles pages | `src/features/permissions/components/{CategoriesPage,ProductsPage,OrdersPage,ReportsPage,UsersPage,RolesPage}.tsx` | **Mock only** — 100% hardcoded in-memory data, simulated loading delays, `console.log`-only mutations. Zero Supabase calls in any of the six.                                                                                                                |
| Admin settings                                                 | `src/features/permissions/components/AdminSettingsPage.tsx`                                                        | Mixed — some tabs real-ish (local state), Database/Appearance tabs are literal "Coming Soon" placeholders.                                                                                                                                                   |
| Onboarding wizard                                              | `src/features/onboarding/pages/StepByStepOnboarding.tsx`, `CompanySettings.tsx`, `InventoryManagement.tsx`         | **Mock only** — wizard shell with `console.log`-only persistence; no Supabase calls despite being framed as account setup.                                                                                                                                   |
| Global dashboard                                               | `src/features/global/pages/GlobalDashboard.tsx`                                                                    | **Mock only** — demo SaaS dashboard with fabricated stats.                                                                                                                                                                                                   |
| AI assistant                                                   | `src/features/ai/pages/AIAssistantPage.tsx`                                                                        | **Fake** — hardcoded canned Azerbaijani responses, no real model/backend call.                                                                                                                                                                               |
| QR code scanner                                                | `src/features/global/components/QRCodeScanner.tsx`                                                                 | **Half-real** — genuine `getUserMedia` camera access, but `simulateQRScan()` returns a random mock URL instead of decoding anything.                                                                                                                         |
| Voice recorder                                                 | `src/features/global/components/VoiceRecorder.tsx`                                                                 | **Half-real** — genuine `MediaRecorder` recording, but no real transcription/voice-command backend despite UI copy implying one.                                                                                                                             |
| Global settings                                                | `src/features/global/hooks/useGlobalSettings.ts`                                                                   | **Real**, but trivial — plain `localStorage`-backed hook, no Supabase.                                                                                                                                                                                       |

## Auth (Supabase)

`src/hooks/use-user.ts` wraps `supabase.auth`: `signInWithPassword`,
`signUp`, OAuth (`signInWithOAuth` for Google/Facebook), session restore,
`onAuthStateChange` subscription. It also exports a dev-only
`createAdminUser()` helper that, under `import.meta.env.DEV`, creates a real
`admin@example.com` / `adminpassword` account **against the live Supabase
project** — not a local mock. `LoginForm.tsx` surfaces this as a visible
"Create Test Admin User" button.

`RegisterForm.tsx` (`src/features/auth/components/`) presents a role
dropdown including "Administrator," whose selected value is passed straight
into:

```ts
supabase.auth.signUp({ email, password, options: { data: { role } } });
```

landing in `user.user_metadata.role` — the exact field `ProtectedRoute`/
`AdminLayout` trust for admin access. **Any visitor can self-register as
admin.** This is the top P0 finding of this audit; full detail and remediation
direction are in `REPOSITORY_AUDIT.md` and the per-repo Phase 9 plan.

## Database layer (Supabase/Postgres) — the central architectural gap

`supabase/config.toml` is a single line (`project_id` only — no `[api]`/
`[db]`/`[studio]` sections, Supabase CLI/Postgres version unconfirmed).
`supabase/migrations/` contains exactly **one** file,
`create_categories_and_products.sql`, which:

- Creates `categories` and `products` tables, seeds sample rows.
- Enables `ROW LEVEL SECURITY` on both, with public-read policies and
  write policies gated on `has_permission('edit_inventory')`.
- Calls `has_permission(...)` — **a function not defined anywhere in this
  repo's migrations.**

`src/integrations/supabase/types.ts` (486 lines, auto-generated by the
Supabase CLI/dashboard integration, header says "do not edit directly")
reveals the actual live schema is far larger:

| Live table (from `types.ts`) | In a versioned migration? |
| ---------------------------- | ------------------------- |
| `categories`                 | Yes                       |
| `products`                   | Yes                       |
| `product_permissions`        | **No**                    |
| `product_role_assignments`   | **No**                    |
| `product_role_permissions`   | **No**                    |
| `product_roles`              | **No**                    |
| `profiles`                   | **No**                    |
| `role_permissions`           | **No**                    |
| `user_permissions`           | **No**                    |
| `user_product_roles`         | **No**                    |

Plus 2 RPC functions (`has_permission`, `has_product_permission`) and 2
enums (`app_role`: admin/staff/client/company; `permission_type`: 11 values)
— **none** defined in any migration file.

`git log --follow -- src/integrations/supabase/types.ts` shows multiple
"Run SQL migration" / "Apply Supabase schema changes" commits that updated
this generated file without ever adding a corresponding `.sql` file — direct
evidence that most of this schema was applied against the live Supabase
project outside version control (dashboard SQL editor or Lovable's own
Supabase integration), not merely an omission in this repo's history.

**Consequence:** RLS policy coverage for 8 of the 10 live tables cannot be
reviewed from this repo at all — they may or may not be protected, and there
is no way to tell without live access to the Supabase project. There is also
no in-repo backup/rollback story for ~80% of the schema. This is the most
severe "database layer" finding of this audit (P0, schema-as-code gap).

## Build configuration

`vite.config.ts`: Vite 8, `@vitejs/plugin-react-swc`, dev-only
`lovable-tagger` `componentTagger()` plugin (gated on `mode === 'development'`,
correctly excluded from production builds), `@` path alias to `src/`, dev
server on port 8080.

`package.json` defines two build scripts: `"build": "vite build"` (the real
production build — `mode` defaults to `"production"`, so
`import.meta.env.DEV` is false and the `ProtectedRoute` bypass is compiled
out) and `"build:dev": "vite build --mode development"` (compiles the bypass
in). Nothing in this repo prevents `build:dev` from being used for a real
deployment — this is a risk surface, not just a theoretical one, flagged in
`TECHNICAL_DEBT.md` and the per-repo Phase 5/9 plan.

## Styling

Tailwind CSS v3.4.19 with CSS-variable-based shadcn/ui theme tokens plus four
ad hoc custom brand colors (`brandBlue`/`brandRed`/`brandGreen`/`brandWhite`)
defined directly in `tailwind.config.ts` alongside the standard palette —
duplicative but harmless. `components.json` confirms a standard shadcn/ui
setup (New York style, Lucide icons).

## Not present

No CI (`.github/workflows/` doesn't exist), no Dockerfile/compose/Makefile,
no `.nvmrc`/`.node-version`/`engines` field, no test of any kind, no
`LICENSE` file. Confirmed again this phase via `find`/`ls` across the full
tree — Phases 5, 10, and 11 all start from zero for this repo.
