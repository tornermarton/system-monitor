# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

build: ## Build image.
	@docker buildx build --platform linux/arm64,linux/amd64 ./backend -t tornermarton/system-monitor-backend:latest --push
	@docker buildx build --platform linux/arm64,linux/amd64 ./frontend -t tornermarton/system-monitor-frontend:latest --push
