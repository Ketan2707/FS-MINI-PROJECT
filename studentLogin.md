# Student Login Feature Prompt

## Context

This project is a full-stack Student Feedback & Rating System with:

- Backend: Spring Boot, Spring Security, Spring Data JPA, JWT
- Frontend: React, Vite, React Router, Axios

Current behavior:

- Only `ADMIN` and `TEACHER` can sign up and log in
- `Student` exists as a data entity, but students are not authenticated users
- Current feedback flow is teacher/admin focused and is used to submit feedback for students

I want to extend this application with a new student-facing authentication and feedback workflow.

## Goal

Implement:

1. Student signup
2. Student login
3. Student session/auth support in frontend and backend
4. A new student-facing feature where logged-in students can give feedback to teachers

## Important Product Requirements

- Keep the existing admin and teacher login flow working
- Do not break existing student management, subject management, dashboard, or current teacher-to-student feedback functionality
- Add a new student role and student auth flow cleanly
- Add teacher feedback as a separate feature from the existing student feedback flow
- Reuse the existing app structure and coding style where reasonable

## Current Repo Facts

- Backend auth routes exist at `/api/auth`
- Backend current roles are only `ADMIN` and `TEACHER`
- Backend current `Student` entity does not contain login credentials
- Frontend routes currently include:
  - `/login`
  - `/register`
  - `/dashboard`
  - `/students`
  - `/feedback`
- Frontend stores JWT token and user info in `localStorage`
- Backend uses JWT auth and Spring Security

## What To Build

### 1. Student authentication model

Add support for a `STUDENT` role.

Decide on a clean implementation that fits this codebase. Preferred direction:

- Keep `User` as the authenticated account table
- Link a student account to a `Student` record
- Avoid duplicating identity data unnecessarily

A good implementation would likely:

- Add `STUDENT` to the role enum
- Extend the `Student` model so a student can be associated with a `User`
- Ensure existing student CRUD still works
- Ensure student signup creates both the auth account and the linked student profile if needed

### 2. Student signup and login

Add backend and frontend support so students can:

- register/signup
- log in
- stay authenticated with JWT
- access student-only UI

Student signup should collect enough information to identify the student profile, such as:

- first name
- last name
- roll number
- department
- semester
- email
- username
- password

If a better structure is needed, implement it consistently across backend and frontend.

### 3. Teacher feedback from students

Add a new feature where logged-in students can submit feedback for teachers.

This should be separate from the current teacher/admin feedback-on-students feature.

Implement a proper backend model for teacher feedback, such as:

- a new entity for student-to-teacher feedback
- appropriate DTOs, repository, service, and controller
- a clear API namespace

Suggested capability:

- students can choose a teacher
- students can choose a category
- students can give a rating
- students can write a comment
- students can submit feedback
- optionally students can view their submitted teacher feedback history

### 4. Teacher data source

Since teachers are currently just `User` records with role `TEACHER`, use that as the teacher source unless a better minimal structure is required.

Students should be able to select from teacher users when submitting feedback.

### 5. Security and permissions

Update Spring Security so that:

- students can access student-specific routes
- existing admin/teacher behavior remains intact
- only students can submit teacher feedback through the new student feedback endpoint
- current admin restrictions for student management remain intact

### 6. Frontend changes

Add the necessary frontend pages and route protection.

Expected additions:

- student signup page or shared signup flow that supports student registration
- student login through existing auth flow or a shared auth page
- student-facing page for submitting feedback to teachers
- navigation changes in sidebar or routing based on role

Frontend should:

- show different navigation/options for students
- preserve existing admin and teacher UI
- use the existing Axios/JWT auth pattern

### 7. Dashboard and UX behavior

Do not overcomplicate the first version.

For v1:

- student users do not need admin dashboard powers
- students only need access to their relevant pages
- teacher feedback pages should be simple and functional

## Backend Expectations

Please implement:

- entity/model changes
- role enum changes
- DTOs for student auth and teacher feedback
- repository layer updates
- service layer updates
- controller endpoints
- Spring Security config updates
- seed data updates if needed
- Swagger compatibility for new endpoints

Suggested new endpoints can include things like:

- `POST /api/auth/student/register`
- `POST /api/auth/login` using role-aware login
- `GET /api/teachers`
- `POST /api/teacher-feedback`
- `GET /api/teacher-feedback/mine`

You may improve endpoint naming if you keep it consistent.

## Frontend Expectations

Please implement:

- role-aware auth handling
- student registration form
- student feedback submission page
- API client updates
- route protection updates
- conditional sidebar rendering based on role

Keep the current app style and structure.

## Data / Compatibility Constraints

- Keep existing admin and teacher login working
- Keep existing seeded admin and teacher users working
- Do not remove current student feedback functionality
- Do not repurpose existing feedback records in a way that breaks current APIs
- Prefer additive schema changes over destructive ones

## Testing Expectations

Please verify:

- admin login still works
- teacher login still works
- student signup works
- student login works
- JWT auth works for student sessions
- student can submit feedback to a teacher
- non-student users cannot call student-only teacher-feedback submission endpoints unless explicitly allowed
- existing student CRUD and feedback APIs still work

## Deliverables

Please:

1. implement the feature fully in code
2. update any needed backend/frontend docs
3. mention all files changed
4. explain the new routes and new role behavior
5. mention any assumptions made

## Ready-To-Paste Prompt

```text
You are working in an existing full-stack repository with:
- Spring Boot backend
- React + Vite frontend
- JWT authentication
- current roles: ADMIN and TEACHER
- students currently exist only as managed records, not authenticated users
- current feedback flow is for teachers/admins giving feedback to students

I want you to implement a new feature set:

1. add student signup
2. add student login
3. add a STUDENT role
4. allow logged-in students to give feedback to teachers

Important constraints:
- keep existing admin and teacher login working
- do not break current student CRUD, subjects, dashboard, or existing teacher-to-student feedback flow
- make teacher feedback from students a separate feature, not a replacement of the existing feedback system
- reuse the current architecture and code style
- prefer additive schema changes

Implementation expectations:
- backend:
  - add STUDENT role
  - create or adapt a clean auth model for students
  - link student accounts to student records
  - add endpoints for student registration and teacher feedback submission
  - add any needed entities, DTOs, repositories, services, controllers, and security rules
  - use teacher users from the existing users table where role = TEACHER
- frontend:
  - add student signup flow
  - support student login in the existing auth system
  - add a student-facing page for submitting feedback to teachers
  - update routing, auth context, sidebar/nav, and API clients
  - keep admin/teacher UI working

Suggested student signup fields:
- firstName
- lastName
- rollNumber
- department
- semester
- email
- username
- password

Suggested teacher feedback fields:
- teacherId
- rating
- category
- comment

Please:
- inspect the codebase first
- implement the feature end-to-end
- preserve existing functionality
- add/update tests where practical
- update documentation
- summarize changed files and new routes at the end
```
