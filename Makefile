setup:
	npm_config_yes=true npx shx cp -u infra/.env.example infra/.env
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
	yarn setup
up:
	docker-compose -f infra/docker-compose.yml up -d
stop:
	docker-compose -f infra/docker-compose.yml stop
down:
	docker-compose -f infra/docker-compose.yml down --remove-orphans
restart:
	@make down
	@make up
destroy:
	@make down
	docker volume rm infra_frourio_demo_db
