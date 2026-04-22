# 🎓 Student Feedback & Rating System

A full-stack web application for collecting, managing, and analyzing student feedback and ratings. Built with **React** (frontend) and **Spring Boot** (backend).

## Features

- 🔐 JWT-based authentication with role-based access (Admin, Teacher)
- 👩‍🎓 Student profile management (CRUD)
- ⭐ Star-rating feedback with text comments and categories
- 📊 Interactive dashboard with charts and aggregate stats
- 📱 Responsive dark-themed UI with glassmorphism design
- 🐳 Docker Compose deployment

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios, Recharts |
| Backend    | Spring Boot 3, Spring Security, Spring Data JPA |
| Database   | MySQL 8                                     |
| Auth       | JWT (JSON Web Tokens)                       |
| Deployment | Docker, Docker Compose                      |

## Project Structure

```
FS-MINI-PROJECT/
├── backend/          # Spring Boot API
├── frontend/         # React SPA (Vite)
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8 (or use Docker)

### Backend
Use Maven from the `backend/` directory. This is a Spring Boot project, so do not compile `FeedbackApplication.java` with raw `javac`.

Windows PowerShell:
```powershell
cd backend
.\mvnw.cmd -version
.\mvnw.cmd spring-boot:run
```

macOS / Linux:
```bash
cd backend
chmod +x mvnw
./mvnw -version
./mvnw spring-boot:run
```

Notes:
- `FeedbackApplication` is in package `com.feedback`, so `java FeedbackApplication` is not a valid startup command.
- The backend targets Java 21+, and the wrapper prefers a standard installed JDK in the 21-25 range before falling back to the shell's `java`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (Full Stack)
```bash
docker-compose up --build
```

## API Documentation

Once the backend is running, visit: `http://localhost:8080/swagger-ui.html`

## License

MIT

## To run backend use 
cd backend
.\mvnw.cmd spring-boot:run
