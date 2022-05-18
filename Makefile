setup: prepare install db-create db-migrate

prepare:
	cp -n .envExample .env || true

db-create:
	npx sequelize-cli db:create

db-migrate:
	npx sequelize-cli db:migrate

db-delete-migrate:
	npx sequelize-cli db:migrate:undo:all

start-server:
	npx nodemon server/bin/server.js

install:
	npm install

lint:
	npx eslint .
