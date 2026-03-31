-- Test Users for Development
-- Teacher passwords: teacher@123 (bcrypt hash)
-- Student passwords: student@123 (bcrypt hash)
INSERT INTO users (id, username, password_hash, email, role, created_at) VALUES
(1, 'teacher1@demo.com', '$2a$10$SlAM5XQIqL57v0nlCvJEduZz9z7C8WtWEAjKvB/Ig0p7p5iP.0FYK', 'teacher1@demo.com', 'TEACHER', NOW()),
(2, 'teacher2@demo.com', '$2a$10$SlAM5XQIqL57v0nlCvJEduZz9z7C8WtWEAjKvB/Ig0p7p5iP.0FYK', 'teacher2@demo.com', 'TEACHER', NOW()),
(3, 'student1@demo.com', '$2a$10$m4jFu7Lnzwz8/I2L3T5A1ux4q6Qw2dZ9n5mqzLr9oJ8k2hBpIvd/C', 'student1@demo.com', 'STUDENT', NOW()),
(4, 'student2@demo.com', '$2a$10$m4jFu7Lnzwz8/I2L3T5A1ux4q6Qw2dZ9n5mqzLr9oJ8k2hBpIvd/C', 'student2@demo.com', 'STUDENT', NOW()),
(5, 'student3@demo.com', '$2a$10$m4jFu7Lnzwz8/I2L3T5A1ux4q6Qw2dZ9n5mqzLr9oJ8k2hBpIvd/C', 'student3@demo.com', 'STUDENT', NOW()),
(6, 'student4@demo.com', '$2a$10$m4jFu7Lnzwz8/I2L3T5A1ux4q6Qw2dZ9n5mqzLr9oJ8k2hBpIvd/C', 'student4@demo.com', 'STUDENT', NOW()),
(7, 'student5@demo.com', '$2a$10$m4jFu7Lnzwz8/I2L3T5A1ux4q6Qw2dZ9n5mqzLr9oJ8k2hBpIvd/C', 'student5@demo.com', 'STUDENT', NOW());

INSERT INTO instructor (instructor_id, user_id, name, email, department) VALUES
(1, 1, 'Ava Sharma', 'teacher1@demo.com', 'Computer Science'),
(2, 2, 'Daniel Reed', 'teacher2@demo.com', 'Mathematics');

INSERT INTO student (student_id, name, email, department, year, user_id, enrollment_date, gpa, attendance_percent) VALUES
(1, 'Priya Nair', 'student1@demo.com', 'Computer Science', 2, 3, NOW(), 3.7, 92.0),
(2, 'Rahul Sen', 'student2@demo.com', 'Computer Science', 3, 4, NOW(), 3.1, 84.0),
(3, 'Maya Patel', 'student3@demo.com', 'Mathematics', 1, 5, NOW(), 2.8, 79.0),
(4, 'Ishaan Gupta', 'student4@demo.com', 'Mathematics', 4, 6, NOW(), 2.2, 63.0),
(5, 'Sara Khan', 'student5@demo.com', 'Data Science', 2, 7, NOW(), 1.9, 58.0);

INSERT INTO course (course_id, course_name, instructor_id, description) VALUES
(1, 'Data Structures', 1, 'Core CS concepts and algorithmic problem solving.'),
(2, 'Database Systems', 1, 'Relational modeling, SQL, and transactions.'),
(3, 'Applied Statistics', 2, 'Probability and inference for analytics.');

INSERT INTO assignment (assignment_id, title, description, due_date, max_marks, priority, instructor_id, course_id, created_at, published, weightage) VALUES
(1, 'Linked List Lab', 'Implement linked list operations in Java.', DATE_ADD(NOW(), INTERVAL 4 DAY), 100, 'HIGH', 1, 1, NOW(), true, 15.0),
(2, 'SQL Optimization Report', 'Analyze a slow query and propose indexes.', DATE_ADD(NOW(), INTERVAL 6 DAY), 100, 'MEDIUM', 1, 2, NOW(), true, 20.0),
(3, 'Probability Quiz', 'Short answer quiz on distributions.', DATE_SUB(NOW(), INTERVAL 2 DAY), 50, 'LOW', 2, 3, NOW(), true, 10.0),
(4, 'ER Diagram Draft', 'Design a normalized schema for a booking app.', DATE_ADD(NOW(), INTERVAL 9 DAY), 100, 'HIGH', 1, 2, NOW(), false, 12.0);

INSERT INTO submission (submission_id, student_id, assignment_id, submission_date, file_path, status, feedback, submitted_at) VALUES
(1, 1, 1, NOW(), 'uploads/student1-linked-list.pdf', 'SUBMITTED', NULL, NOW()),
(2, 2, 1, NOW(), 'uploads/student2-linked-list.pdf', 'GRADED', 'Great work.', NOW()),
(3, 3, 2, NOW(), 'uploads/student3-sql-report.pdf', 'SUBMITTED', NULL, NOW()),
(4, 4, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), 'uploads/student4-probability.pdf', 'LATE', NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 5, 3, NOW(), 'uploads/student5-probability.pdf', 'PENDING', NULL, NOW());

INSERT INTO grade (grade_id, student_id, assignment_id, course_id, score, max_score, grade_type, feedback, graded_by, graded_at) VALUES
(1, 1, 1, 1, 91.0, 100.0, 'ASSIGNMENT', 'Strong implementation.', 1, NOW()),
(2, 2, 1, 1, 78.0, 100.0, 'ASSIGNMENT', 'Good effort.', 1, NOW()),
(3, 3, 2, 2, 69.0, 100.0, 'ASSIGNMENT', 'Needs deeper query analysis.', 1, NOW()),
(4, 4, 3, 3, 45.0, 50.0, 'QUIZ', 'Revise distributions.', 2, NOW()),
(5, 5, 3, 3, 21.0, 50.0, 'QUIZ', 'Needs support on fundamentals.', 2, NOW());

INSERT INTO ai_prediction (prediction_id, student_id, predicted_score, risk_level, suggestion, confidence_level, created_at) VALUES
(1, 1, 88.0, 'LOW', 'Keep current study rhythm.', 0.92, NOW()),
(2, 4, 54.0, 'MEDIUM', 'Focus on assignment turnaround.', 0.81, NOW()),
(3, 5, 41.0, 'HIGH', 'Schedule intervention and mentoring.', 0.88, NOW());
