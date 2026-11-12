# rengarenk-dizayn-cicekleri

Vite + React + TypeScript SPA with [shadcn-ui](https://ui.shadcn.com) and Tailwind CSS, backed by a hosted [Supabase](https://supabase.com) project. The production bundle is served by nginx inside Docker; there is no backend process of this repo's own to run locally.

## Tech stack

- Vite, React 19, TypeScript
- shadcn-ui, Tailwind CSS
- @tanstack/react-query, react-hook-form, zod, recharts, sonner, lucide-react
- Supabase JS client (hosted project — URL/anon key are client-safe by Supabase's own design; see docs/TECHNICAL_DEBT.md item 5)

## Local development (Docker-first)

Everything builds, tests, and runs in containers per this repo's workflow:

```sh
# 1. Clone
git clone https://github.com/RasimAghayev/rengarenk-dizayn-cicekleri.git
cd rengarenk-dizayn-cicekleri

# 2. Baseline behavior-contract gate: test stage (tsc type-check + vite build)
#    then the runtime image build.
make verify

# 3. Start the stack (runs verify first)
make up
# app: http://localhost:20070/  (health: /healthz)
```

- `make test` — Docker `test` stage only (TypeScript project-reference type-check across `tsconfig.app.json` + `tsconfig.node.json`; `noEmit: true` so it is a real type-check, not an artifact build).
- `make build` — runtime image (`docker compose build app`); structurally re-runs the `test` stage, so no runtime image exists whose tests didn't pass.
- `make lint` — `npm run lint` inside the test-stage image (non-blocking; surfaces pre-existing ESLint findings, see docs/TECHNICAL_DEBT.md item 23).
- `make down` / `make logs` / `make shell` — stop the stack, follow logs, open a shell in the runtime image.
- `make clean` — removes local build output; containers/images only with `CONFIRM=1` (never deletes user data).

Environment: copy `.env.example` to `.env` and fill in placeholders. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are reserved names Phase 9 will wire into `src/integrations/supabase/client.ts` (currently hardcoded — see docs/TECHNICAL_DEBT.md item 5). No real values in `.env.example` ever.

## CI status / known baseline (read before merging)

- Phase 10 added the GitHub Actions CI pipeline (lint → typecheck in the Docker `test` stage → build → secret scan; SHA-pinned actions, `timeout-minutes` on every job, full image scan nightly only, publish gated to tags) as **PR #79 — open, not merged**.
- `make verify` is **RED — pre-existing baseline, not a regression**: `npm ci` fails ERESOLVE because `main` carries `typescript@^7.0.2` (Dependabot PR #75) while `typescript-eslint@^8.72.x` requires `typescript >=4.8.4 <6.1.0`. This is a dependency-version conflict owned by **Phase 6/upgrader** (re-pin `typescript` to `^6.0.x`, or upgrade `typescript-eslint` once it supports TS 7.x), out of scope for docs-only phases.
- Until Phase 6 restores a green build, CI cannot go green and PR #79 stays open. Documented in `docs/CI_BASELINE.md`; not hidden, not blamed on any later phase.

No behavior was changed by any docs-only commit; `make verify`'s exit code matches the P10 baseline recorded in `docs/CI_BASELINE.md`.

## How to contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Branches: `phase-<n>/<topic>`. Conventional commits. No AI attribution in commits or PRs (no `Co-Authored-By` / `Claude-Session` trailers).

## Deploy

Publish via Lovable (Project > Settings > Domains > Connect Domain) or push to `main` — the CI pipeline publishes only on tags (no registry credentials configured yet).
