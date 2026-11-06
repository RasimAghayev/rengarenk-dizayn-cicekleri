# syntax=docker/dockerfile:1
#
# Multi-stage build: base -> deps -> build -> test -> runtime.
#
# This repo is a pure Vite/React SPA talking to a hosted (not self-run)
# Supabase backend - there is no server-side process of this repo's own to
# containerize beyond serving the static production bundle. `runtime` is an
# nginx (unprivileged, non-root by default) static-file server.
#
# `runtime` is reachable (via `COPY --from=test`) only after the `test`
# stage's RUN steps have exited 0, and `test` is reachable only after
# `build`'s `npm run build` succeeded, so a plain `docker build .` (no
# --target, i.e. the default final stage = `runtime`) always re-executes
# the test stage as part of the build graph. There is no way to produce a
# runtime image whose test stage didn't pass. Verified by sabotage - see
# docs/BASELINE.md.
#
# IMPORTANT: the `build` stage runs `npm run build` (the production Vite
# build), never `npm run build:dev`. `build:dev` compiles with
# `import.meta.env.DEV` truthy, which bakes in a dev-only auth bypass in
# `ProtectedRoute`/`AdminLayout` (see docs/TECHNICAL_DEBT.md P0 #2). No
# future edit to this Dockerfile should switch that script.
#
# No unit/integration test suite exists in this repo yet (zero test files,
# no test runner configured - see docs/BASELINE.md). The `test` stage below
# gates on a real, already-available static check (the TypeScript project-
# reference build/type-check) rather than a fabricated test-runner pass.
# This is documented as a real gap for Phase 11, not hidden.

############################################################
# base - pinned exact version + digest, shared by every stage
############################################################
FROM node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS base
WORKDIR /app

############################################################
# deps - full install (incl. devDependencies, needed to build/lint/typecheck)
# npm is the authoritative package manager for this repo (package-lock.json
# has 40+ real commits of history; bun.lockb is a dead, 1-commit scaffold
# artifact - see docs/TECHNICAL_DEBT.md #10). Only the npm lockfile is
# copied/used here so there is no ambiguity for Docker's own build.
############################################################
FROM base AS deps
COPY package.json package-lock.json ./
# Phase 6: real fix for the Phase 5 ERESOLVE workaround (see docs/BASELINE.md
# finding #1 and CHANGELOG.md). The lockfile used to pin
# @vitejs/plugin-react-swc@3.7.1 (peer "vite: ^4 || ^5") and
# lovable-tagger@1.1.7 (peer "vite: ^5.0.0") against vite@8.3.6 - both
# incompatible, masked by --legacy-peer-deps. Bumped to
# @vitejs/plugin-react-swc@4.3.3 (peer "^4||^5||^6||^7||^8") and
# lovable-tagger@1.3.5 (peer ">=5.0.0 <9.0.0"), both registry-confirmed to
# support vite 8. A plain `npm ci` now succeeds with no peer override.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

############################################################
# build - the production Vite bundle (npm run build, NOT build:dev - see
# header). Fails the whole build if the SPA doesn't compile.
############################################################
FROM deps AS build
COPY . .
RUN npm run build

############################################################
# test - the baseline behavior contract available today: the TypeScript
# project-reference build/typecheck (`tsc -b`; both tsconfig.app.json and
# tsconfig.node.json already set `noEmit: true`, so this only type-checks).
# A failure here fails the whole image build (see header note on the FROM
# chain). No business-logic test suite exists to run yet - documented, not
# faked - see docs/BASELINE.md.
#
# `npm run lint` is deliberately NOT in this gate right now: it crashes
# (TypeError, exit 2 - not a lint finding) on a verified, pre-existing
# ESLint 9.39.5 / @typescript-eslint 8.11.0 incompatibility in the
# `no-unused-expressions` rule, unrelated to any source file's content.
# Full repro + exact error: docs/BASELINE.md. Putting a currently-crashing
# command in this hard gate would make every future `docker build .`
# permanently fail for a tooling reason, not a behavior reason, which is
# not what this stage is for. Phase 6 owns fixing the eslint/typescript-
# eslint version matrix; re-add the line below once it's green:
#   RUN npm run lint
############################################################
FROM build AS test
RUN npx tsc -b

############################################################
# runtime - nginx (unprivileged image: already non-root uid 101, exec-form
# entrypoint, listens on 8080 by default), serving only the built static
# bundle from `test` (so reaching runtime structurally requires test to
# have passed). No Node, no compiler, no source, no dev tooling.
############################################################
FROM nginxinc/nginx-unprivileged:1.31.7-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e AS runtime

# Hardening (verified via `docker scout cves`, full before/after in
# docs/BASELINE.md):
# 1. `apk upgrade` pulls Alpine 3.24's latest already-released package
#    builds (musl, zlib, brotli-libs, expat, ca-certificates, ...) - closes
#    several CVEs the base image's own build predates, incl. one CISA KEV
#    (brotli CVE-2026-111497).
# 2. The base image also ships a full curl/libcurl (+ its own transitive
#    deps: libpsl, nghttp2-libs, c-ares, libidn2, libunistring) that this
#    image never uses - HEALTHCHECK below uses busybox `wget`, already
#    present, instead. curl alone accounted for 7 of 9 CRITICAL and 17 of
#    24 HIGH findings on the unmodified base image.
# Both need root momentarily; the image still ends on the base's own
# non-root user (101).
USER root
RUN apk update && apk upgrade --no-cache && apk del curl libcurl
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=test --chown=101:101 /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O- --spider http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
