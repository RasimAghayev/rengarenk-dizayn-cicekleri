# Dependency Decisions

## 2026-11-14 — Phase 11 test runner: vitest + jsdom + @testing-library/react

### Decision

Add `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/dom` as devDependencies for the Phase 11 test suite, and wire them into `package.json` (`test` and `test:coverage` scripts), `Dockerfile` (`test` stage runs `npm run test && npx tsc -b`), `Makefile` (`make test` → `docker build --target test`), and `.github/workflows/ci.yml` (test job builds the `test` stage; build job depends on it).

### Packages

| Package | Selected version | Latest stable (at decision) | License | Maintenance | Weekly downloads | Size (unpacked, approx.) |
|---|---|---|---|---|---|---|
| vitest | ^5.1.0 | 5.1.0 | MIT | Sustainable | ~180M | ~12 MB |
| @vitest/coverage-v8 | ^5.1.0 | 5.1.0 | MIT | Sustainable (vitest org) | bundled with vitest | ~2 MB |
| jsdom | ^31.0.1 | 31.0.1 | MIT | Active | ~154M | ~8 MB |
| @testing-library/react | ^16.3.3 | 16.3.3 | MIT | Active | ~92M | ~1 MB |
| @testing-library/dom | ^10.4.2 | 10.4.2 | MIT | Active | bundled with RTL | ~0.5 MB |

### What already covers this

Nothing in the repo prior to Phase 11. `docs/BASELINE.md` stated "no test suite exists" (zero test files, no test runner configured). The only test-adjacent gate was `npx tsc -b` (TypeScript project-reference type-check) in the Docker `test` stage, which covers static types, not runtime behavior.

### Why these packages

- **vitest 5.1.0**: Vite-native test runner matching the app's build tool (Vite 8.3.7), zero config migration from the app's `vite.config.ts` patterns, built-in coverage via `@vitest/coverage-v8`, JSX transform via `@vitejs/plugin-react-swc` (already a dependency).
- **jsdom 31.0.1**: DOM environment for component rendering; required by `@testing-library/react`; latest stable with zero known vulnerabilities.
- **@testing-library/react 16.3.3 + @testing-library/dom 10.4.2**: DOM Testing Library canonical React bindings; peer-compatible with React 19.3.1 and @types/react 19.3.0 already in the manifest.

### Alternatives considered

- **Jest**: heavier, slower startup, requires `babel`/`ts-jest` transform layer that duplicates Vite's existing SWC transform; not chosen.
- **Playwright/Cypress**: E2E tools, out of scope for Phase 11 (unit + component tests only).

### Verification

- `docker build --target test -t rengarenk-p11:test .`: exit 0 — `npm ci` resolves cleanly, `npm run test` = `vitest run --config tests/vitest.config.ts` → 8 files / 66 cases: 65 passed + 1 expected fail (`TC_CASH_STOCK_004`, documented R8 defect via `it.fails`), `npx tsc -b` exits 0.
- `COMPOSE_PROJECT_NAME=rengarenk-p11 docker compose build app`: exit 0.
- `npm run lint` remains non-blocking (75 pre-existing ESLint findings unchanged; not part of the hard gate).

### Standing decision 3 compliance

No new dependency was added without this decision entry. All five packages are MIT-licensed, actively maintained, and their selected versions equal the latest stable versions at decision time. No production dependency was introduced — all are `devDependencies` only.
