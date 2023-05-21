ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
.DEFAULT_GOAL := help

.PHNEY: debug-vars
debug-vars:
	@echo "ROOT: ${ROOT}"

.PHNEY: dev
dev:
	cargo watch -x run

help: ## Show options
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
