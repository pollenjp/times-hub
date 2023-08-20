ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
PROJECT_NAME := $(shell basename "${ROOT}")
COMPOSE_FILE := docker/docker-compose.yml
COMPOSE_ARGS := -f "${COMPOSE_FILE}" -p "${PROJECT_NAME}"

.DEFAULT_GOAL := help

.PHNEY: debug-vars
debug-vars:
	@echo "ROOT: ${ROOT}"
	@echo "PROJECT_NAME: ${PROJECT_NAME}"
	@echo "COMPOSE_FILE: ${COMPOSE_FILE}"
	@echo "COMPOSE_ARGS: ${COMPOSE_ARGS}"


.PHNEY: dev
dev:
	sqlx db create
	sqlx migrate run
	RUST_LOG="debug" \
		TIMES_HUB_APP_HOST_IP="127.0.0.1" \
		TIMES_HUB_APP_HOST_PORT="3000" \
		cargo watch -x run

.PHNEY: test
test:
	cargo test

.PHNEY: db-build
db-build: ## Build docker compose
	docker compose ${COMPOSE_ARGS} build

.PHNEY: db-up
db-up: ## Run docker compose up in the background
	docker compose ${COMPOSE_ARGS} up -d

.PHONY: db-exec
db-exec:
	docker compose ${COMPOSE_ARGS} exec database bash -c \
	'PGPASSWORD='times-hub' psql --username times-hub --dbname workspaces'

PHNEY: db-down
db-down: ## Run docker compose down
	docker compose ${COMPOSE_ARGS} down

PHNEY: db-logs
db-logs: ## Tail docker compose logs
	docker compose ${COMPOSE_ARGS} logs -f

.PHNEY: clean
clean: ## stop containers and remove volumes
	${MAKE} db-down
	-docker volume rm "${PROJECT_NAME}_pgdata"

help: ## Show options
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
