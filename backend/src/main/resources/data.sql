-- Seed data for Student Feedback System
-- Password for all users is: password123 (BCrypt encoded)

-- Users
INSERT INTO users (username, email, password_hash, role, created_at, updated_at) VALUES
('admin', 'admin@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher1', 'teacher1@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher2', 'teacher2@school.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Subjects
INSERT INTO subjects (name, code, department, semester) VALUES
('Data Structures', 'CS201', 'Computer Science', 3),
('Operating Systems', 'CS301', 'Computer Science', 5),
('Database Management', 'CS202', 'Computer Science', 3),
('Digital Electronics', 'EC201', 'Electronics', 3),
('Mathematics III', 'MA301', 'Mathematics', 3);

-- Students
INSERT INTO students (first_name, last_name, roll_number, department, semester, created_at, updated_at) VALUES
('Rahul', 'Sharma', 'CS2024001', 'Computer Science', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Priya', 'Patel', 'CS2024002', 'Computer Science', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Amit', 'Kumar', 'CS2024003', 'Computer Science', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sneha', 'Gupta', 'EC2024001', 'Electronics', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vikram', 'Singh', 'CS2024004', 'Computer Science', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ananya', 'Reddy', 'CS2024005', 'Computer Science', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rohan', 'Mehta', 'EC2024002', 'Electronics', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kavya', 'Nair', 'CS2024006', 'Computer Science', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Feedback
INSERT INTO feedback (student_id, subject_id, submitted_by, rating, comment, category, created_at) VALUES
(1, 1, 2, 5, 'Excellent understanding of data structures. Always participates in class.', 'ACADEMIC', CURRENT_TIMESTAMP),
(1, 1, 3, 4, 'Good performance in lab assignments.', 'ACADEMIC', CURRENT_TIMESTAMP),
(2, 1, 2, 4, 'Shows consistent improvement in coding skills.', 'ACADEMIC', CURRENT_TIMESTAMP),
(2, 3, 3, 5, 'Outstanding database design project.', 'ACADEMIC', CURRENT_TIMESTAMP),
(3, 2, 2, 3, 'Needs to improve attendance and punctuality.', 'BEHAVIOR', CURRENT_TIMESTAMP),
(3, 2, 3, 4, 'Good understanding of OS concepts.', 'ACADEMIC', CURRENT_TIMESTAMP),
(4, 4, 2, 5, 'Excellent circuit design skills.', 'ACADEMIC', CURRENT_TIMESTAMP),
(5, 1, 2, 4, 'Active participation in group discussions.', 'PARTICIPATION', CURRENT_TIMESTAMP),
(5, 3, 3, 3, 'Average performance, needs more practice.', 'ACADEMIC', CURRENT_TIMESTAMP),
(6, 2, 2, 5, 'Top performer in the class. Very dedicated.', 'ACADEMIC', CURRENT_TIMESTAMP),
(6, 2, 3, 4, 'Shows leadership qualities in group projects.', 'PARTICIPATION', CURRENT_TIMESTAMP),
(7, 4, 2, 4, 'Good practical skills in electronics lab.', 'ACADEMIC', CURRENT_TIMESTAMP),
(8, 1, 2, 3, 'Needs to be more active in class.', 'PARTICIPATION', CURRENT_TIMESTAMP),
(8, 5, 3, 4, 'Good mathematical aptitude.', 'ACADEMIC', CURRENT_TIMESTAMP),
(1, 3, 2, 4, 'Well-structured SQL queries in assignments.', 'ACADEMIC', CURRENT_TIMESTAMP);
