# Student Feedback & Rating System Developer Guide

## Overview

This repository is a full-stack student feedback platform with:

- A Spring Boot backend API in `backend/`
- A React + Vite frontend in `frontend/`
- Optional Docker Compose orchestration for MySQL, backend, and frontend

Primary use cases:

- User registration and login with JWT authentication
- Role-based access for `ADMIN` and `TEACHER`
- Student CRUD management
- Subject CRUD management
- Feedback submission, listing, filtering, and deletion
- Dashboard statistics and top-student summaries

## Tech Stack

### Backend

- Java 21+ target
- Spring Boot 3.4.5
- Spring Security
- Spring Data JPA
- H2 for local development
- MySQL 8 for Docker/deployment flow
- Swagger / OpenAPI via Springdoc

### Frontend

- React 19
- Vite
- React Router
- Axios
- Recharts
- Framer Motion

### Deployment

- Docker
- Docker Compose
- Nginx for frontend serving and API proxying

## Project Structure

```text
FS-MINI-PROJECT/
├── backend/                 Spring Boot API
│   ├── src/main/java/com/feedback
│   ├── src/main/resources
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend/                React SPA
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml
├── README.md
└── DEVELOPER_GUIDE.md
```

## Ports

### Local development

- Backend API: `8080`
  Source: `backend/src/main/resources/application.yml`
- H2 console: `8080/h2-console`
  Source: `spring.h2.console.path`
- Swagger UI: `8080/swagger-ui.html`
  Source: `springdoc.swagger-ui.path`
- OpenAPI docs: `8080/api-docs`
  Source: `springdoc.api-docs.path`
- Frontend Vite dev server: default Vite port, typically `5173`
  Inference: `frontend/vite.config.js` does not override the dev server port.

### Docker Compose

- MySQL: `3306`
- Backend: `8080`
- Frontend / Nginx: `80`

### Important port note

If the backend fails to start and says `Port 8080 was already in use`, stop the existing process on `8080` or run the backend on another port.

## How To Run

### Backend only

From the repo root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

If you are already inside `backend/`, use:

```powershell
.\mvnw.cmd spring-boot:run
```

Important:

- Do not run `javac FeedbackApplication.java`
- Do not run `java FeedbackApplication`
- `FeedbackApplication` is in package `com.feedback`, and this backend depends on Maven-managed Spring Boot libraries

### Frontend only

```powershell
cd frontend
npm install
npm run dev
```

### Full stack with Docker

```powershell
docker-compose up --build
```

## Environment and Runtime Notes

### Backend JVM

- The backend `pom.xml` targets Java `21`
- The repo includes `backend/mvnw.cmd` and `backend/mvnw`
- The wrapper prefers an installed JDK in the `21-25` range and falls back to the shell `java` if needed
- A local Maven repository is configured at `backend/.mvn/repository`

### Backend data source behavior

For local development, the backend uses:

- H2 in-memory database
- URL: `jdbc:h2:mem:feedbackdb`

For Docker, the backend uses:

- MySQL service `db`
- URL pattern: `jdbc:mysql://db:3306/feedbackdb`

## Backend Functionality

## Authentication and authorization

JWT-based authentication is implemented in the backend and attached from the frontend through Axios interceptors.

Public backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- Swagger and API docs
- H2 console

Protected backend routes:

- All other `/api/**` routes require authentication

Role restrictions from `SecurityConfig`:

- `POST /api/students/**` requires `ADMIN`
- `PUT /api/students/**` requires `ADMIN`
- `DELETE /api/students/**` requires `ADMIN`
- `DELETE /api/feedback/**` requires `ADMIN`

Functional implication:

- Teachers can log in and submit/view feedback
- Admins can additionally manage student records and delete feedback

## Main API modules

### Auth

Base path: `/api/auth`

Endpoints:

- `POST /register`
- `POST /login`
- `GET /me`

Purpose:

- Register a user
- Authenticate and return a JWT plus user info
- Fetch current authenticated user details

### Students

Base path: `/api/students`

Endpoints:

- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`

Supported list query parameters:

- `department`
- `semester`
- `search`
- `page`
- `size`
- `sortBy`
- `sortDir`

Purpose:

- Manage student records
- Support filtered and paginated listing

### Subjects

Base path: `/api/subjects`

Endpoints:

- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`

Purpose:

- Manage academic subjects used for feedback

### Feedback

Base path: `/api/feedback`

Endpoints:

- `POST /`
- `GET /`
- `GET /{id}`
- `DELETE /{id}`

Supported list query parameters:

- `studentId`
- `subjectId`
- `category`
- `page`
- `size`

Purpose:

- Submit feedback about students for subjects
- Filter feedback records
- Remove feedback entries

### Dashboard

Base path: `/api/dashboard`

Endpoints:

- `GET /stats`

Supported query parameters:

- `topStudentsLimit`

Purpose:

- Return summary stats and top student data for the dashboard UI

## Backend domain model

Main entities:

- `User`
- `Student`
- `Subject`
- `Feedback`
- `RatingSummary`
- `AuditLog`

Enums:

- `Role`: `ADMIN`, `TEACHER`
- `FeedbackCategory`: `ACADEMIC`, `BEHAVIOR`, `PARTICIPATION`, `OTHER`

### High-level relationships

- A `User` can submit feedback
- Feedback belongs to a `Student`
- Feedback belongs to a `Subject`
- `RatingSummary` aggregates rating totals and averages per student and subject
- `AuditLog` tracks entity actions by user

## Seed Data

Seed data is loaded from `backend/src/main/resources/data.sql`.

Included sample data:

- 1 admin user
- 2 teacher users
- 5 subjects
- 8 students
- 15 feedback records

Default seeded credentials:

- Username: `admin`
- Username: `teacher1`
- Username: `teacher2`
- Password for all seeded users: `password123`

## Frontend Functionality

### Routes

Public routes:

- `/login`
- `/register`

Protected routes:

- `/dashboard`
- `/students`
- `/feedback`

Fallback routes:

- `/` redirects to `/dashboard`
- Unknown routes render the not-found page

### Frontend auth behavior

The frontend:

- Stores JWT token in `localStorage`
- Stores user info in `localStorage`
- Attaches `Authorization: Bearer <token>` automatically via Axios
- Clears auth state and redirects to `/login` on `401`

### Frontend API base URL

The frontend uses:

- `http://localhost:8080/api`

This is defined in `frontend/src/utils/constants.js`.

### Main pages

- `LoginPage`: authenticate existing users
- `RegisterPage`: create a new account
- `DashboardPage`: display summary metrics and charts
- `StudentsPage`: list, create, update, and delete students
- `FeedbackPage`: submit feedback and browse existing feedback

## Docker Behavior

### Services

`docker-compose.yml` defines:

- `db`: MySQL 8
- `backend`: Spring Boot API
- `frontend`: Nginx serving the built React app

### Container names

- `feedback-db`
- `feedback-backend`
- `feedback-frontend`

### Nginx proxy behavior

The frontend container:

- Serves the SPA on port `80`
- Proxies `/api/` to `http://backend:8080/api/`
- Proxies `/swagger-ui/` to the backend
- Proxies `/api-docs` to the backend

## Security Summary

- JWT token is expected in the `Authorization` header
- Token prefix is `Bearer `
- Header name is `Authorization`
- JWT expiration is `86400000` ms, which is 24 hours

### Current security-related debug settings

The backend currently logs:

- `com.feedback: DEBUG`
- `org.springframework.security: DEBUG`

This is useful during development but may be too noisy for production.

## Useful Developer URLs

Local backend URLs:

- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI docs: `http://localhost:8080/api-docs`
- H2 console: `http://localhost:8080/h2-console`

Docker frontend URL:

- `http://localhost/`

Docker backend URL:

- `http://localhost:8080/`

Docker MySQL port:

- `localhost:3306`

## Common Commands

### Backend

```powershell
cd backend
.\mvnw.cmd -version
.\mvnw.cmd -q -DskipTests compile
.\mvnw.cmd spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
npm run build
```

### Docker

```powershell
docker-compose up --build
docker-compose down
```

## Common Issues

### `backend\\backend` path error

Cause:

- Running `cd backend` while already inside the `backend/` directory

Fix:

- Run `.\mvnw.cmd spring-boot:run` directly

### `package org.springframework.boot does not exist`

Cause:

- Attempting to compile Spring Boot code with raw `javac`

Fix:

- Use Maven through `.\mvnw.cmd`

### `release version 21 not supported`

Cause:

- Maven is using a JDK older than the project target

Fix:

- Run the backend through the repo wrapper instead of plain Maven

### Port `8080` already in use

Cause:

- Another process is already listening on `8080`

Fix:

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

Or run on another port:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

## Developer Notes

- `SubjectController` currently accepts the entity type directly in create/update requests instead of a dedicated DTO
- Local development uses H2, while Docker uses MySQL, so SQL behavior can differ slightly between the two modes
- The frontend hardcodes the backend API base URL to `http://localhost:8080/api` for local development
- Swagger is enabled and is the fastest way to inspect and test backend endpoints during development

## Recommended First Steps For A New Developer

1. Start the backend with `backend\\mvnw.cmd spring-boot:run`
2. Open Swagger at `http://localhost:8080/swagger-ui.html`
3. Log in with a seeded account from `data.sql`
4. Start the frontend with `npm run dev`
5. Verify login, student listing, feedback submission, and dashboard stats
