SHELL := /bin/bash
.DEFAULT_GOAL := help

IMAGE  ?= rengarenk-dizayn-cicekleri
export COMPOSE_PROJECT_NAME := rengarenk-p11
export HOST_PORT ?= 20070
COMPOSE := docker compose

.PHONY: help build test verify up run down logs shell lint security clean

help:
	@echo "make build    - build the runtime image (nginx + static bundle; requires the test stage to pass)"
	@echo "make test     - run the test stage: vitest suite (65 pass + 1 expected fail) + TypeScript project build/typecheck"
	@echo "make verify   - test + build: the behavior-contract gate"
	@echo "make up       - verify, then start the stack (docker compose up -d)"
	@echo "make run      - up, then follow logs"
	@echo "make down     - stop and remove the stack"
	@echo "make logs     - follow the app container's logs"
	@echo "make shell    - open a shell in the built runtime image"
	@echo "make lint     - npm run lint (via the test-stage image, no host node_modules needed)"
	@echo "make security - docker scout cves against the built runtime image"
	@echo "make clean    - remove local build output; pass CONFIRM=1 to also remove this repo's containers/images"

test:
	DOCKER_BUILDKIT=1 docker build --target test -t $(IMAGE):test .

build:
	DOCKER_BUILDKIT=1 $(COMPOSE) build app

verify: test build
	@echo "verify: test stage + runtime build both succeeded"

up: verify
	$(COMPOSE) up -d
	@echo "app: http://localhost:$(HOST_PORT)/"

run: up
	$(COMPOSE) logs -f app

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f app

shell:
	$(COMPOSE) run --rm --entrypoint sh app

lint: test
	docker run --rm --entrypoint npm $(IMAGE):test run lint

security:
	docker scout cves $(IMAGE):runtime

# Never deletes containers/images/volumes without an explicit confirm flag.
# This repo has no database/volume of its own (Supabase is hosted, not
# self-run) - "data" here means only the locally built Vite bundle and this
# repo's own Docker artifacts.
clean:
	rm -rf dist dist-ssr
ifeq ($(CONFIRM),1)
	$(COMPOSE) down --rmi local --remove-orphans
	-docker image rm $(IMAGE):test $(IMAGE):deps $(IMAGE):build 2>/dev/null
else
	@echo "Local build output removed. Containers/images were NOT removed - re-run as 'make clean CONFIRM=1' to also remove those."
endif
