# Docker baseline (Phase 5)

This is the Phase 5 behavior contract for `rengarenk-dizayn-cicekleri`: what
this repo actually builds, tests, and runs as, verified for real in Docker
(not assumed). Before this phase there was **no Dockerfile, `docker-compose.yml`,
or `Makefile` at all** (confirmed by Phase 2/3's audit and reconfirmed here) -
everything in this document is a first-ever execution, not a repair of
something pre-existing.

## Scope decision

This repo is a pure Vite/React SPA. It talks to a **hosted** Supabase project
(not self-run) - there is no backend process of this repo's own to
containerize. The `runtime` stage is nginx serving the static production
bundle; there is no local Supabase container in this setup (correctly - the
real Supabase project is external infrastructure, not something this repo
owns or starts).

## Pipeline

`base` (pinned exact version + digest) → `deps` (full `npm ci`, cached) →
`build` (`npm run build` - the production script, deliberately never
`build:dev`, see below) → `test` (TypeScript project-reference build/
type-check) → `runtime` (nginx-unprivileged, non-root, hardened, serving
only the `test` stage's `/app/dist`).

Because `runtime`'s only path to its static content is `COPY --from=test`,
and `test` is `FROM build`, a plain `docker build .` (no `--target`, i.e.
building `runtime`, which is what `make build`/`make up` do) **always**
re-executes the `test` stage's `RUN` as part of the build graph - there is
no way to produce a runtime image whose test stage didn't pass.

### Why `build`, never `build:dev`

`package.json` has two build scripts: `"build": "vite build"` and
`"build:dev": "vite build --mode development"`. The latter compiles with
`import.meta.env.DEV` truthy, which bakes a dev-only auth bypass into
`ProtectedRoute`/`AdminLayout` (`src/App.tsx`, `src/layouts/AdminLayout.tsx`)
straight into the built artifact - see `docs/TECHNICAL_DEBT.md` P0 #2. The
Dockerfile's `build` stage runs `npm run build` only; this is called out
explicitly in the Dockerfile header so no future edit switches it by habit.

## Verified by sabotage: the test gate is real

```
$ docker build --no-cache .                     # before sabotage, clean
... exit 0

$ cp src/lib/utils.ts <backup>                   # a safe, non-boundary file
$ # inserted: const sabotageTypeError: number = "phase-5-sabotage-test";
$ docker build --no-cache -t rengarenk-dizayn-cicekleri:sabotage-test2 .
...
#16 [test 1/1] RUN npx tsc -b
#16 7.480 src/lib/utils.ts(5,9): error TS2322: Type 'string' is not assignable to type 'number'.
#16 ERROR: process "/bin/sh -c npx tsc -b" did not complete successfully: exit code: 2
ERROR: failed to build: failed to solve: process "/bin/sh -c npx tsc -b" did not complete successfully: exit code: 2
$ echo $?
1                                                 # docker build itself exits 1

$ cp <backup> src/lib/utils.ts                    # restored
$ git diff --stat src/lib/utils.ts                # confirmed byte-identical, no diff
$ docker build --no-cache .
... exit 0                                        # green again
```

No runtime image was ever produced from the sabotaged source - `docker
images` shows no `sabotage-test2` tag because the build errored before the
final `exporting to image` step completed.

## Real, pre-existing findings surfaced by actually building (not fixed here)

Neither of these was visible to Phase 2/3's analysis, which never ran a
clean install/build from an empty `node_modules` - they are new, Phase-5-only
findings, surfaced by this phase's "actually build, don't assume" mandate.

### 1. `npm ci` fails ERESOLVE without `--legacy-peer-deps` (blocking)

```
$ docker build --target deps .          # plain `npm ci`, no flag
...
npm error ERESOLVE could not resolve
npm error While resolving: @vitejs/plugin-react-swc@3.7.1
npm error Found: vite@8.3.6 ... dev vite@"^8.3.6" from the root project
npm error Could not resolve dependency: peer vite@"^4 || ^5" from @vitejs/plugin-react-swc@3.7.1
npm error Conflicting peer dependency: vite@5.4.21
exit code: 1
```

Root cause: `package.json`/`package-lock.json` (both committed, the lockfile
with 40+ real commits of history) pin `vite@8.3.6`, but
`@vitejs/plugin-react-swc@3.7.1` (resolved from the declared `^3.5.0` range)
declares `peerDependencies: {"vite": "^4 || ^5"}` - verified against the npm
registry. **These two already-committed version pins are mutually
incompatible for a strict `npm ci`.** The committed lockfile could only have
been produced with some lenient resolution mode (`--legacy-peer-deps`/
`--force`, or an older/different npm's default behavior) - never audited via
a from-scratch clean install until now.

**Workaround used (not a fix):** `npm ci --legacy-peer-deps` in the `deps`
stage. This only relaxes npm's peer-dependency validation; it changes no
package version and doesn't touch `package.json`/`package-lock.json`. Fully
documented in the Dockerfile.

**Real fix, owned by Phase 6:** bump `@vitejs/plugin-react-swc` to latest
`4.3.3` (registry-confirmed `peerDependencies: {"vite": "^4 || ^5 || ^6 || ^7 || ^8"}`
- supports vite 8). This is outside Phase 5's scope (R1: one phase, one
agent) and is a dependency-version change (standing decision 3/R1), so it is
flagged here, not performed here. **Recommend Phase 6 prioritize this one
early** - see finding #2 below, which is also downstream of it.

### 2. `npm run lint` crashes (not a lint finding - a tool crash)

```
$ docker build --target test .          # with `RUN npm run lint` in the Dockerfile
...
> eslint .
Oops! Something went wrong! :(
ESLint: 9.39.5
TypeError: Error while loading rule '@typescript-eslint/no-unused-expressions':
Cannot read properties of undefined (reading 'allowShortCircuit')
Occurred while linting /app/src/App.tsx
    at Object.create (/app/node_modules/eslint/lib/rules/no-unused-expressions.js:85:5)
    at create (/app/node_modules/@typescript-eslint/eslint-plugin/dist/rules/no-unused-expressions.js:28:32)
exit code: 2
```

Root cause: a version-matrix incompatibility between `eslint@9.39.5`
(resolved from `^9.9.0`) and `@typescript-eslint/eslint-plugin@8.11.0`
(resolved from `typescript-eslint@^8.0.1`) in the `no-unused-expressions`
rule (part of `tseslint.configs.recommended`, see `eslint.config.js`). This
is **not a finding about `App.tsx`'s content** - the crash is identical
regardless of what the file contains (confirmed: it's the rule's `create()`
that throws, before any AST-specific linting happens).

**Decision:** `npm run lint` is deliberately **not** included in the
Docker `test` gate right now (see the Dockerfile's `test` stage comment).
Including a command that unconditionally crashes, for a tooling reason
unrelated to any source change, would make every future `docker build .`
permanently fail - defeating the purpose of a behavior-contract gate. The
`test` stage instead gates on `npx tsc -b` (both `tsconfig.app.json` and
`tsconfig.node.json` already set `noEmit: true`, so this is a real
type-check, not a build artifact). The disabled `npm run lint` line is left
commented in the Dockerfile with a pointer back here, to re-enable the
moment Phase 6 resolves the eslint/typescript-eslint version matrix.
**Owned by Phase 6** - already on its list as "`eslint-plugin-react-hooks`
pinned to a prerelease RC" (`docs/TECHNICAL_DEBT.md` #6); this finding shows
the problem is broader than that one package and should be checked first.

### 3. `npm audit fix` cannot even run without `--legacy-peer-deps`

Tried (read-only, inspected the container's own copy of the lockfile,
never touched the real working-tree files) to see if the "dev-only,
non-breaking" `minimatch` fix mentioned in this phase's brief was reachable
without a flag:

```
$ docker run --rm rengarenk-dizayn-cicekleri:deps npm audit fix
npm error ERESOLVE could not resolve
... (identical error to finding #1)
exit code: 1
```

It fails on the exact same `@vitejs/plugin-react-swc`/`vite` conflict before
it can even attempt the `minimatch` bump - npm re-resolves the whole tree for
`audit fix`, same as `ci`/`install`. **Decision:** did not force this through
with `--legacy-peer-deps` (which would also work) because stacking a
dependency-version mutation on top of a peer-dependency override is exactly
the kind of compounding, unreviewed change standing decision 1/3 reserves for
Phase 6's one-step-at-a-time, Docker-verified process - not attempted here.
Current `npm audit` (unchanged, matches Phase 2/3's prior record exactly):

```
3 vulnerabilities (2 moderate, 1 high)
- minimatch 7.0.0-11.0.0 (high, ReDoS) - dev-only, via @typescript-eslint/typescript-estree
- postcss-selector-parser <=6.1.4 (moderate x2, DoS) - via @tailwindcss/typography
  (npm audit fix --force would downgrade @tailwindcss/typography to 0.5.4 - a breaking change)
```

## Image hardening (`docker scout cves`, before/after)

Base image unmodified (`nginxinc/nginx-unprivileged:1.31.7-alpine`, pinned by
digest): **43 vulnerabilities** (9 Critical, 24 High, 5 Medium, 5 Low) across
6 packages. The large majority (7 of 9 Critical, 17 of 24 High) came from
`curl`/`libcurl` and their own transitive deps (`libpsl`, `nghttp2-libs`,
`c-ares`, `libidn2`, `libunistring`) - a tool this image never uses (the
container `HEALTHCHECK` uses busybox `wget`, already present in the base
image).

Added to the `runtime` stage (as `root`, momentarily, before dropping back
to the base image's own non-root `uid 101`):
```dockerfile
RUN apk update && apk upgrade --no-cache && apk del curl libcurl
```

Result, same image, same digest-pinned base:

| Stage | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Base image, unmodified | 9 | 24 | 5 | 5 | 43 |
| + `apk del curl libcurl` only | 2 | 7 | 5 | 5 | 19 |
| + `apk upgrade` (final) | **1** | **2** | **5** | **5** | **13** |

Remaining 13, all OS packages with **no newer fix yet published in Alpine
3.24's own repo** (`apk upgrade` already pulled everything currently
available) except noted:

- `zlib 1.3.2-r1` - 1 Critical (`CVE-2026-4738`, fix is `1.4-r0`, not yet in
  the 3.24 repo), 0 High (the other zlib High, `CVE-2026-85091`, was already
  fixed by this phase's `apk upgrade`, from `1.3.2-r0`→`1.3.2-r1`).
- `libxml2 2.13.9-r2` - 1 High + 5 Medium + 5 Low, all explicitly
  "Fixed version: not fixed" per `docker scout`.
- `musl 1.2.6-r3` - 1 High (`CVE-2026-107891`, fix is `1.2.6-r6`, not yet in
  the 3.24 repo; `apk upgrade` already moved it from `r2`→`r3`).

None of these are fixable by anything available to this phase today (no
newer Alpine-3.24-based tag exists for `nginx-unprivileged`, and the distro
hasn't shipped the fixing package versions yet). Recommend: Phase 10's CI
image-scan job re-runs `docker scout cves` on a schedule so a future `apk
upgrade` picks up these fixes automatically once Alpine publishes them,
without anyone having to remember to re-check by hand.

## Verification evidence (commands + exit codes)

| # | Command | Result |
|---|---|---|
| 1 | `docker build --target deps .` (plain `npm ci`, no flag) | **exit 1** - ERESOLVE, see finding #1 |
| 2 | `docker build --target deps .` (with `--legacy-peer-deps`) | exit 0 - 563 packages, 16s |
| 3 | `docker build --target build .` | exit 0 - Vite build, 2597 modules, `dist/assets/index-*.js` 1,519.90 kB (413.41 kB gzip), `.css` 74.10 kB (12.95 kB gzip) |
| 4 | `docker build --target test .` (with `npm run lint` in the gate) | **exit 2** - ESLint crash, see finding #2 |
| 5 | `docker build --target test .` (final: `tsc -b` only) | exit 0 - 7.9s |
| 6 | `docker build .` (default target = `runtime`) | exit 0 |
| 7 | Sabotage: type error in `src/lib/utils.ts`, `docker build --no-cache .` | **exit 1** - confirms the test gate is real, not cosmetic |
| 8 | Restore sabotaged file, `git diff --stat` | clean, byte-identical |
| 9 | `docker build --no-cache .` (post-restore) | exit 0 - 34.1s wall-clock, no cache |
| 10 | `make verify` (= `make test` + `make build`) | exit 0 |
| 11 | `make up` | exit 0 - container `rengarenk-dizayn-cicekleri-p5-app-1` started, host port 20070 (reserved block 20070-20079) |
| 12 | `docker compose ps` | `Up ... (healthy)` |
| 13 | `curl http://localhost:20070/` | HTTP 200, serves `index.html` |
| 14 | `curl http://localhost:20070/healthz` | `ok`, HTTP 200 |
| 15 | `curl http://localhost:20070/admin` (client-side route, no matching static file) | HTTP 200 - SPA fallback (`try_files ... /index.html`) confirmed working |
| 16 | `make shell` → `whoami` | `nginx` (uid 101) - confirmed non-root |
| 17 | `make shell` → `ls /usr/share/nginx/html` | only `index.html`, `assets/`, `favicon.ico`, `placeholder.svg`, `robots.txt`, `50x.html` - no source, no `node_modules`, no `package.json`, no dev tooling |
| 18 | `docker run --rm <image> which curl` | exit 1, not found - confirmed removed |
| 19 | `docker run --rm <image> which wget` | `/usr/bin/wget` - confirmed present (healthcheck dependency) |
| 20 | `make down` | exit 0 - container, network removed |
| 21 | `make clean CONFIRM=1` | exit 0 - `test`/`deps`/`build` tag images removed, `runtime` preserved, no volumes existed to lose (Supabase is hosted, not self-run) |
| 22 | `docker scout cves <image>:runtime` (final) | 13 vulnerabilities (1 Critical, 2 High, 5 Medium, 5 Low) - see hardening table above |
| 23 | `npm audit` (inside `test` image) | 3 vulnerabilities (1 high `minimatch`, 2 moderate `postcss-selector-parser`) - unchanged from Phase 2/3's record |
| 24 | `docker run --rm <deps image> npm audit fix` | **exit 1** - same ERESOLVE as finding #1, see finding #3 |

## Image size

- `docker images rengarenk-dizayn-cicekleri:runtime` (on-disk, uncompressed layers): **106 MB**
- `docker scout` analyzed/exported size: **31 MB**
- Both recorded; the gap is normal (compressed vs. uncompressed layer
  accounting, same pattern documented in other repos' Phase 5 baselines).

## Baseline test results (the behavior contract)

**No unit/integration/component test suite exists** - zero test files, no
test runner in any dependency, no test script in `package.json` (confirmed
by Phase 2/3, reconfirmed here by `find . -iname "*.test.*" -o -iname
"*.spec.*"` excluding `node_modules`/`.git` → zero results). The Docker
`test` stage currently gates on the one real signal available without
adding a new dependency: `npx tsc -b` (TypeScript project-reference
type-check across `tsconfig.app.json` + `tsconfig.node.json`).

**No characterization tests were added in this phase.** This repo has a
real, documented P0 auth/RBAC surface (`docs/TECHNICAL_DEBT.md` P0 #1/#2) and
the only two genuinely backend-wired screens are `SuperAdminPage.tsx` and
`ProductPermissionsManagement.tsx` - the remaining six "admin CRUD" pages are
non-functional mock-data shells (`docs/REPOSITORY_AUDIT.md`). Given zero
existing tests and zero test infrastructure, writing meaningful
characterization tests here would mean standing up a test framework
(vitest, React Testing Library, Supabase-client mocking) from scratch and
making non-trivial coverage decisions around files this phase does not own
(the hard scope boundary explicitly excludes `RegisterForm.tsx` and any
mock/demo admin page) - that is Phase 11's (`tester`) job, not a "minimal"
addition. This gap is flagged here explicitly, not hidden behind a
fabricated pass:

**Phase 11 priority list** (handed off, not acted on here): (1) a
regression test proving the registration flow cannot grant `admin` after
Phase 9's fix, (2) `ProtectedRoute`/`AdminLayout` authorization tests (no
`DEV`-flag bypass reachable from a production build), (3) a smoke test for
the two genuinely backend-wired screens, (4) a build-smoke test
(`vite build` producing a non-empty `dist/index.html`) as the simplest
possible characterization of "the SPA still compiles," which could even be
added as a real Docker `test`-stage assertion once a runner exists.

## `.env.example`

New file (none existed before). Contains placeholders only (per `CLAUDE.md`:
`.env.example` always placeholders, never real values, even for a
client-safe key) for `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, plus the
Docker-only, non-secret `HOST_PORT` (default `20070`). These two
`VITE_SUPABASE_*` names are **not yet wired into application code** -
`src/integrations/supabase/client.ts` still hardcodes the real project URL
and anon/publishable key directly. See the judgment-call note below for why
that migration was deliberately left to Phase 9.

### Judgment call: `.env.example` added, `client.ts` left untouched

This phase's brief raised, as an optional judgment call, migrating
`client.ts` to read from `import.meta.env.VITE_SUPABASE_URL`/
`VITE_SUPABASE_ANON_KEY` with the current values as defaults. **Decision:
did not make that edit.** Both this repo's already-approved Phase 3 plan
(`projects/info/analysis/rengarenk-dizayn-cicekleri-plan.md`, Phase 5
section: "Add `.env.example` with `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`
placeholders, **anticipating Phase 9's env-var migration of `client.ts`**")
and `docs/TECHNICAL_DEBT.md` item 5 ("Owner: Phase 5 (`.env.example`) /
**Phase 9** (migrate `client.ts`)") explicitly assign the `client.ts` edit to
Phase 9, not Phase 5. Per R1 (one agent, one phase) and the agent roster
(`container-engineer`: "Docker/Make only"), this phase adds the `.env.example`
contract Phase 9 will wire into, and stops there - it does not touch
`src/integrations/supabase/client.ts`. Re-confirmed, not contradicted, this
phase: the hardcoded key's JWT payload decodes to `{"role":"anon", ...}`
(not `service_role`) - consistent with Phase 2/3/4's existing classification
as a client-safe, non-rotation-worthy key (RLS-gated by Supabase's own
design). No fresh Gate 1 triggered.

## Out-of-scope findings (for later phases, not fixed here)

- **`npm ci` ERESOLVE conflict** (finding #1 above) - Phase 6, recommend
  prioritizing the `@vitejs/plugin-react-swc` bump early since it also
  blocks `npm audit fix` (finding #3).
- **ESLint crash** (finding #2 above) - Phase 6, eslint/typescript-eslint
  version matrix.
- **`npm audit`: 1 high (dev-only `minimatch`) + 2 moderate
  (`postcss-selector-parser`)** - unchanged from Phase 2/3's record, not
  fixed here (see finding #3 for why `npm audit fix` wasn't forced through).
- **Residual OS-level CVEs with no upstream fix yet** (1 Critical `zlib`, 1
  High `musl`, 1 High + 5 Medium + 5 Low `libxml2`) - nothing actionable
  today; recommend a scheduled re-scan (Phase 10 CI) rather than a one-time
  check.
- **1.5 MB main JS bundle** (413 kB gzip) - Vite's own build warning flags
  chunks over 500 kB; code-splitting is a Phase 7/8 concern, not addressed
  here.
- **`client.ts` env-var migration** - explicitly Phase 9's, see judgment-call
  note above.
- Everything already on record from Phase 2/3/4 (`date-fns` unused,
  `bun.lockb` dead, major-version gaps, the P0 auth/RBAC findings, the
  untracked Supabase schema) - unchanged, not re-litigated here, not this
  phase's job.
