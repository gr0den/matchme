# Social Academy - a place to find like minded and growth oriented people.

A full-stack web application built with **Spring Boot** and **React** that helps users to connect with like minded people based on shared interests.

### Prerequisites

- Docker & Docker Compose installed
- Make (cli program to execute docker commands with shortcuts)
- Git

### Installation

```bash

git clone <https://gitea.kood.tech/glebvorontsov/web.git>
cd matchme

```

### Start the application

- make dev

The application will be available at:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

### Add new users

- localhost:3000/api/data/users/generate/{userAmount}

### Restart application

- make down
- make dev

### wipe DB and restart application

- make clean
- make rebuild

### Shutdown

```bash
make down
```

## Tech Stack

**Backend:** Java 21, Spring Boot, PostgreSQL, Redis, Flyway  

**Frontend:** React 19, TypeScript, Vite  

**Infrastructure:** Docker, Docker Compose  


## Make Commands

```bash
make dev        # Start development environment
make prod       # Start production environment
make down       # Stop all containers
make clean      # Stop and delete all data
make rebuild    # Rebuild without cache
```

### Usage Guide

UI User Flow:

    - Create a new account on the landing page.

    - Fill out the profile.

    - Navigate to the Match page to connect with someone

    - send connection request to recommended users

    - have a chat!

