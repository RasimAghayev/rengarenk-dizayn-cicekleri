# Contributing

Thank you for considering contributing to this project!

## Report a Bug

Open an issue describing the expected vs. actual behavior, steps to reproduce,
and the environment (language version, platform, relevant dependencies).

## Request a Feature

Open an issue with the use case and why it belongs in this project. Discuss
before opening a pull request.

## Pull Request Workflow

1. Create a branch named `phase-<n>/<topic>` (for example `phase-1/docs-api`).
2. Make your change. Keep commits scoped to a single concern.
3. Commit with conventional commits (e.g. `docs: ...`, `feat: ...`, `fix: ...`).
4. Rebase onto `main` before merging (rebase-merge; avoid merge commits).
5. Delete the feature branch after it is merged.

## Coding Standards

- Follow the project's existing code style and patterns.
- Run static analysis/linting tools before pushing (if configured).
- Keep changes focused; avoid committing commented-out code or dead weight.
- Update documentation when changing user-facing behavior.

## Testing

- Run the test suite locally before submitting a PR.
- Add tests for new functionality.
- Ensure all existing tests pass.

## Verification (CI)

- `make verify` — the baseline behavior-contract gate: Docker `test` stage (`npx tsc -b`) + runtime image build. Runs in Docker only; a host run is not verification.
- `make lint` — `npm run lint` inside the test-stage image; non-blocking (pre-existing findings, see docs/TECHNICAL_DEBT.md item 23).
- Current baseline: `make verify` is RED due to a pre-existing dependency conflict (`typescript@^7.0.2` vs `typescript-eslint` peer `<6.1.0`, `npm ci` ERESOLVE). The Phase 10 CI pipeline is implemented in open PR #79 and cannot go green until Phase 6 re-pins `typescript` to `^6.0.x`. Docs-only changes do not affect this; `make verify`'s exit code matches the baseline recorded in docs/CI_BASELINE.md — confirm before assuming a regression was introduced by your change.
- No test suite exists yet (zero test files, no test runner — see docs/BASELINE.md); Phase 11 owns test creation.

## Commit Authorship

No AI attribution in commits. Do not add `Co-Authored-By` or `Claude-Session`
trailers.
