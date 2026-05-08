# make dev (run dev configuration)
# make prod (run prod configuration)
# make down (stop containers)
# make clean (stop containers and erase all project data on your hard drive)

dev:
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
prod:
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build
down:
	docker compose down
clean:
	docker compose down -v