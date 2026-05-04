# how to start the application

Install Docker first!

then execute: 

	sudo systemctl start docker (only, if docker is not started yet)
	sudo docker compose up --build -d

# utilities:

	docker ps (check if containers are running)

# URLs

	http://localhost:80 - frontend
	http://localhost:8080 - backend
	localhost:5432 - db

# Tests

register user:

	curl -X POST http://localhost:8080/api/auth/register \   ✔  17s  
     -H "Content-Type: application/json" \
     -d '{
           "email": "test_user@example.com",
           "password": "secure_password_123"
         }'          


connect to db container -> db -> execute the command:

	docker exec -it matchme-db psql -U admin -d matchme_db -c "SELECT * FROM users;"


