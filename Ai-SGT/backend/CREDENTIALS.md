# Test Credentials for AI Student Grade Tracker

## Overview
The application comes with pre-seeded test users to enable quick local testing. Use the credentials below to log in to the application.

---

## 👨‍🏫 Teacher Accounts

### Teacher 1
- **Email:** `teacher1@demo.com`
- **Password:** `teacher@123`
- **Name:** Ava Sharma
- **Department:** Computer Science

### Teacher 2
- **Email:** `teacher2@demo.com`
- **Password:** `teacher@123`
- **Name:** Daniel Reed
- **Department:** Mathematics

---

## 👨‍🎓 Student Accounts

### Student 1
- **Email:** `student1@demo.com`
- **Password:** `student@123`
- **Name:** Priya Nair
- **Department:** Computer Science
- **Year:** 2
- **GPA:** 3.7

### Student 2
- **Email:** `student2@demo.com`
- **Password:** `student@123`
- **Name:** Rahul Sen
- **Department:** Computer Science
- **Year:** 3
- **GPA:** 3.1

### Student 3
- **Email:** `student3@demo.com`
- **Password:** `student@123`
- **Name:** Maya Patel
- **Department:** Mathematics
- **Year:** 1
- **GPA:** 2.8

### Student 4
- **Email:** `student4@demo.com`
- **Password:** `student@123`
- **Name:** Ishaan Gupta
- **Department:** Mathematics
- **Year:** 4
- **GPA:** 2.2

### Student 5
- **Email:** `student5@demo.com`
- **Password:** `student@123`
- **Name:** Sara Khan
- **Department:** Data Science
- **Year:** 2
- **GPA:** 1.9

---

## 🔑 Login Instructions

1. Open the application at `http://localhost:3000`
2. Click on "Login" 
3. Enter an email from the list above
4. Enter the corresponding password
5. Click "Login"

---

## 📝 Notes

- **Hash Algorithm:** BCrypt (10 rounds)
- **Password Encoding:** All passwords are encoded using BCrypt for security
- **Database:** Test data is automatically seeded on startup (see `data.sql`)
- **Classroom:** Data includes sample courses, assignments, grades, and submissions for testing the full workflow

---

## 🔓 Resetting Credentials

If you need to update test credentials:

1. Edit the plaintext password in this file
2. Generate a new BCrypt hash using an online tool or running:
   ```bash
   echo -n "your_password" | htpasswd -B -C 10 -i
   ```
3. Update the hash in `src/main/resources/data.sql`
4. Restart the backend service

---

## ⚠️ Production Warning

**IMPORTANT:** These test credentials are only for development. Never use these credentials or patterns in production environments.
