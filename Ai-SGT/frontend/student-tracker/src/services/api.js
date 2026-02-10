import axios from "axios";

/**
 * Global axios instance for backend API calls.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080",
  headers: { "Content-Type": "application/json" }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Authentication API --------
export const loginUser = (username, password, role) =>
  api.post(`/api/v1/auth/login`, { username, password, role });


export const signupUser = (userData) =>
  api.post(`/api/v1/auth/signup`, userData);

// -------- User API --------
export const getProfile = () => api.get("/api/v1/users/profile");
export const updateProfile = (data) => api.put("/api/v1/users/profile", data);
export const getUser = (id) => api.get(`/api/v1/users/${id}`);

// -------- Student API --------
export const getStudents = () => api.get("/api/v1/students");
export const getStudentByUserId = (userId) => api.get(`/api/v1/students/user/${userId}`);
export const addStudent = (data) => api.post("/api/v1/students", data);
export const updateStudent = (id, data) => api.put(`/api/v1/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/api/v1/students/${id}`);

// -------- Instructor API --------
export const getInstructors = () => api.get("/api/v1/instructors");
export const getInstructor = (id) => api.get(`/api/v1/instructors/${id}`);
export const getInstructorByUserId = (userId) => api.get(`/api/v1/instructors/user/${userId}`);

// -------- Course API --------
export const getCourses = () => api.get("/api/v1/courses");
export const getCoursesByInstructor = (instructorId) =>
  api.get(`/api/v1/courses/instructor/${instructorId}`);
export const createCourse = (data) => api.post("/api/v1/courses", data);
export const updateCourse = (id, data) => api.put(`/api/v1/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/api/v1/courses/${id}`);

// -------- Assignment API --------
export const getAssignments = () => api.get("/api/v1/assignments");
export const getAssignmentById = (id) => api.get(`/api/v1/assignments/${id}`);
export const createAssignment = (data) => api.post("/api/v1/assignments", data);
export const updateAssignment = (id, data) => api.put(`/api/v1/assignments/${id}`, data);
export const deleteAssignment = (id) => api.delete(`/api/v1/assignments/${id}`);
export const addAssignment = (data) => api.post("/api/v1/assignments", data);

// -------- Submission API --------
export const getSubmissions = () => api.get("/api/v1/submissions");
export const getSubmissionsByStudent = (studentId) =>
  api.get(`/api/v1/submissions/student/${studentId}`);
export const getSubmissionsByAssignment = (assignmentId) =>
  api.get(`/api/v1/submissions/assignment/${assignmentId}`);
export const createSubmission = (data) => api.post("/api/v1/submissions", data);
export const updateSubmission = (id, data) => api.put(`/api/v1/submissions/${id}`, data);
export const deleteSubmission = (id) => api.delete(`/api/v1/submissions/${id}`);

// -------- Grade API --------
export const getGrades = () => api.get("/api/v1/grades");
export const getGradesByStudent = (id) => api.get(`/api/v1/grades/student/${id}`);
export const addGrade = (data) => api.post("/api/v1/grades", data);
export const updateGrade = (id, data) => api.put(`/api/v1/grades/${id}`, data);
export const deleteGrade = (id) => api.delete(`/api/v1/grades/${id}`);

// -------- AI Prediction API --------
export const getAiPrediction = (id) => api.get(`/ai/predict/${id}`);
export const getPredictionHistory = (studentId) => api.get(`/api/prediction/${studentId}`);

export default api;
