# Repository audit

Phase 3, 2026-11-05, `auditor`. Docs-only — nothing in this repo was changed.
Builds on Phase 2's `projects/info/deps/rengarenk-dizayn-cicekleri.md`
(dependency table, `npm audit`, cross-repo check — cited by reference, not
reproduced in full here) and its handoff
(`projects/info/state/handoff/2/rengarenk-dizayn-cicekleri.md`).

## Git history forensics

```
git -C projects/repos/rengarenk-dizayn-cicekleri log --oneline | wc -l   → 113
git log -1 --format="%H %s"                                              → 4a07fe2d6a778b867a97dcd11e905a2cd6c43b9e "build(deps): bump the npm_and_yarn group across 1 directory with 9 updates (#57)"
```

HEAD matches Phase 2's recorded commit exactly — working tree unchanged
since Phase 2 ran.

```
git shortlog -sn --all
```

| Author                    | Commits |
| ------------------------- | ------- |
| `gpt-engineer-app[bot]`   | 67      |
| `renovate[bot]`           | 30      |
| `dependabot[bot]`         | 9       |
| Rasim Aghayev             | 5       |
| `deepsource-autofix[bot]` | 5       |
| `deepsource-io[bot]`      | 1       |

**113 total — 108 bot-authored (95.6%), 5 human-authored.** This is an
almost entirely AI/bot-generated repository, consistent with its Lovable.dev
origin and the dependency-bot activity Phase 2 already found.

```
git branch -a
```

Only `main` plus 4 remote `deepsource-transform-*` branches. Matches Phase
2's `gh pr list` result of exactly 4 open PRs (#18/#21/#22/#24), confirming
no new discrepancy beyond the one Phase 2 already flagged against the Phase
1 loader's stated "22 open PRs."

```
git log --follow --oneline -- supabase/migrations/create_categories_and_products.sql
```

→ 1 commit ever (`e4b6fde`). This migration file has never been updated
since its creation.

```
git log --follow --oneline -- src/integrations/supabase/types.ts | head -5
```

→ reveals 3+ separate commits with messages matching "Run SQL migration" /
"Apply Supabase schema changes" that updated the generated client types
without any corresponding `.sql` file landing in `supabase/migrations/` in
the same or any later commit. This is the direct evidentiary basis for the
schema-as-code gap described in `ARCHITECTURE.md` — it is not an inference
from the types file alone.

```
git log origin/main..origin/deepsource-transform-7a71e8ae --oneline | head -5
```

→ confirms the branch carries only the expected single Prettier/StandardJS
formatting commit, nothing else. Spot-checked one of the four; the other
three follow the same DeepSource bot pattern per Phase 2's PR listing.

## PR/issue count — re-confirmed, same discrepancy, still unresolved

Phase 1's loader context stated 22 open PRs for this repo. Phase 2's live
`gh pr list` returned exactly 4 (all DeepSource style bots) plus 1 open issue
(#20). This phase's `git branch -a` is consistent with exactly 4 open PRs (4
matching remote branches) — no new PR/branch appeared or disappeared since
Phase 2. The discrepancy against the Phase 1 figure remains unexplained from
this repo's own data and is flagged again for the Orchestrator/Phase 4,
not resolved here (same disposition as Phase 2).

## Secret scan (independent, this phase, Docker-based)

Per CLAUDE.md's Docker-first rule, run via the disposable `zricethezav/gitleaks:latest`
image, repo mounted read-only. Windows Git-Bash/MSYS auto-converts container
path arguments unless disabled:

```
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/repo:ro" zricethezav/gitleaks:latest \
  detect --source=/repo --no-git -v
```

**Working tree:** exit non-zero (gitleaks' convention when findings exist),
**1 finding** — rule `jwt`, `src/integrations/supabase/client.ts:6`. This is
the Supabase anon/publishable key Phase 2 already identified; confirmed
client-safe (RLS enabled on at least the 2 versioned tables per the one
migration file) and explicitly not treated as a rotation-worthy secret.
Value not reproduced here or anywhere else in this phase's output —
file:line only, per CLAUDE.md's redaction rule.

```
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/repo:ro" zricethezav/gitleaks:latest \
  detect --source=/repo --log-opts="--all" -v
```

**Full history:** 111 commits scanned (gitleaks' own count; close to the
113 `git log` total, the small difference consistent with gitleaks'
diff-based commit traversal rather than a discrepancy worth chasing),
**2 findings** — same key, in 2 distinct commits:

- `c52d92a9...` — author `deepsource-autofix[bot]`, 2025-05-25
- `d3d71e22...` — author `gpt-engineer-app[bot]`, 2025-05-14

No other secret — no service-role key, password, AWS/API key, private key,
or webhook URL — found anywhere in the working tree or full commit history.
**Result: clean**, beyond the one known, non-rotation-worthy anon key.

## Dependency summary (cited from Phase 2, not re-derived)

67 direct dependencies, ~554 transitive (621 total resolved). `npm audit`:
1 high (`minimatch` ReDoS, dev-only transitive via
`@typescript-eslint/typescript-estree`), 2 moderate
(`postcss-selector-parser` DoS, via the direct `@tailwindcss/typography`
dependency). Multiple major-version gaps against latest stable (React 18→19,
Tailwind v3→v4, `lucide-react`/`recharts`/`sonner`/`tailwind-merge`/
`react-day-picker`/`react-resizable-panels`/`@hookform/resolvers`, several
devDependencies). `eslint-plugin-react-hooks` pinned to a prerelease RC two
majors behind stable. Full tables: `projects/info/deps/rengarenk-dizayn-cicekleri.md`.

## Existing tests

**None.** `find . -iname "*.test.*" -o -iname "*.spec.*"` (excluding
`node_modules`/`.git`) → zero results. No test framework in any dependency
list, no test script in `package.json`. Reconfirmed this phase, consistent
with Phase 2.

## CI/CD

**None.** `find .github -type f` → not found. No `.gitlab-ci.yml`,
`.circleci/`, `netlify.toml`, or `vercel.json`. Reconfirmed this phase.

## Docker / Make

**None.** No `Dockerfile`, `docker-compose.yml`, or `Makefile` at the repo
root or anywhere in the tree. Reconfirmed this phase.

## Code-quality configuration

`tsconfig.json`: `noImplicitAny: false`, `strictNullChecks: false`,
`noUnusedLocals: false`, `noUnusedParameters: false` — TypeScript's strict
guarantees are effectively disabled. `eslint.config.js`: flat config,
`@typescript-eslint/no-unused-vars` explicitly turned off. Both are real
code-quality gaps, not just missing-strictness defaults (someone actively
turned them off relative to TypeScript/ESLint's own recommended starting
points).

## Legal / licence risk

No `LICENSE` file, no `license` field in `package.json`. All 67 direct
dependencies are MIT, ISC, or Apache-2.0 (Phase 2 table; re-sampled this
phase against a handful of entries, consistent). No copyleft dependency, no
licence-compatibility conflict. The gap is that this repo's own code carries
no stated licence at all — a documentation omission (Phase 15), not a
violation, since nothing here is currently being distributed to a third
party under an unstated licence.

## New findings beyond Phase 1/Phase 2 (this phase's full-code-read mandate)

1. **Privilege escalation via public self-registration** — `RegisterForm.tsx`
   lets any visitor select "Administrator," which flows into
   `supabase.auth.signUp`'s `user_metadata.role`, the exact field
   `ProtectedRoute`/`AdminLayout` trust. Full detail: `ARCHITECTURE.md`'s
   "Auth" section and the main analysis file's P0 list.
2. **Dev-mode auth bypass reachable from a real build script** —
   `ProtectedRoute`'s `isDev` shortcut + `package.json`'s `"build:dev"`
   script compile the bypass into a built artifact if that script is ever
   used. A second, milder instance exists in `AdminLayout.tsx`. A live
   Supabase account-creation helper (`createAdminUser()` in `use-user.ts`)
   also gates on the same flag.
3. **~80% of the live Supabase schema is untracked** — 8 of 10 tables, 2 RPC
   functions, 2 enums exist only in the auto-generated `types.ts`, not in any
   versioned migration; `git log --follow` on `types.ts` proves schema
   changes were applied directly against the live project outside version
   control.
4. **All 6 "admin CRUD" pages (Categories/Products/Orders/Reports/Users/
   Roles) are non-functional mock-data shells** with zero real Supabase
   calls — only `SuperAdminPage.tsx` and `ProductPermissionsManagement.tsx`
   are genuinely backend-wired.
5. **The AI assistant, QR scanner, and (partially) voice recorder present
   real-looking UI backed by simulated or absent logic** — not a security
   issue, but a user-trust/honesty-in-UI concern worth documenting
   explicitly rather than leaving implicit.
6. **Two parallel page-layout conventions** (`src/pages/` flat vs.
   `src/features/*/pages/`) coexist, never reconciled.

## Secrets handling gap (carried forward from Phase 2, re-confirmed)

`src/integrations/supabase/client.ts:5-6` hardcodes the Supabase project URL
and anon/publishable key directly in source rather than reading from env
vars; no `.env.example` exists; `.gitignore` covers only `*.local`, not
`.env*`. Not rotation-worthy (RLS-gated, client-safe by Supabase's own
design) but a convention gap for Phase 4/9 to close.
