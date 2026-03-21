import axios from "axios";

/**
 * Shared Axios client for all backend API requests.
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach auth token (when present) to outgoing requests.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Endpoint base paths
const PATHS = {
  auth: "/api/v1/auth",
  users: "/api/v1/users",
  students: "/api/v1/students",
  instructors: "/api/v1/instructors",
  courses: "/api/v1/courses",
  assignments: "/api/v1/assignments",
  submissions: "/api/v1/submissions",
  grades: "/api/v1/grades",
  ai: "/ai",
};

// HTTP helpers to keep API methods concise.
const get = (url) => api.get(url);
const post = (url, data) => api.post(url, data);
const put = (url, data) => api.put(url, data);
const remove = (url) => api.delete(url);

// -------- Authentication API --------
export const loginUser = (username, password, role) =>
  post(`${PATHS.auth}/login`, { username, password, role });

export const signupUser = (userData) =>
  post(`${PATHS.auth}/signup`, userData);

// -------- User API --------
export const getProfile = (id) => get(`${PATHS.users}/${id}`);
export const updateProfile = (id, data) => put(`${PATHS.users}/${id}`, data);
export const getUser = (id) => get(`${PATHS.users}/${id}`);

// -------- Student API --------
export const getStudents = () => get(PATHS.students);
export const getStudentByUserId = (userId) => get(`${PATHS.students}/user/${userId}`);
export const addStudent = (data) => post(PATHS.students, data);
export const updateStudent = (id, data) => put(`${PATHS.students}/${id}`, data);
export const deleteStudent = (id) => remove(`${PATHS.students}/${id}`);

// -------- Instructor API --------
export const getInstructors = () => get(PATHS.instructors);
export const getInstructor = (id) => get(`${PATHS.instructors}/${id}`);
export const getInstructorByUserId = (userId) => get(`${PATHS.instructors}/user/${userId}`);

// -------- Course API --------
export const getCourses = () => get(PATHS.courses);
export const getCoursesByInstructor = (instructorId) =>
  get(`${PATHS.courses}/instructor/${instructorId}`);
export const createCourse = (data) => post(PATHS.courses, data);
export const updateCourse = (id, data) => put(`${PATHS.courses}/${id}`, data);
export const deleteCourse = (id) => remove(`${PATHS.courses}/${id}`);

// -------- Assignment API --------
export const getAssignments = () => get(PATHS.assignments);
export const getAssignmentById = (id) => get(`${PATHS.assignments}/${id}`);
export const createAssignment = (data) => post(PATHS.assignments, data);
export const updateAssignment = (id, data) => put(`${PATHS.assignments}/${id}`, data);
export const deleteAssignment = (id) => remove(`${PATHS.assignments}/${id}`);
// Backward-compatible alias used in pages.
export const addAssignment = createAssignment;

// -------- Submission API --------
export const getSubmissions = () => get(PATHS.submissions);
export const getSubmissionsByStudent = (studentId) =>
  get(`${PATHS.submissions}/student/${studentId}`);
export const getSubmissionsByAssignment = (assignmentId) =>
  get(`${PATHS.submissions}/assignment/${assignmentId}`);
export const createSubmission = (data) => post(PATHS.submissions, data);
export const updateSubmission = (id, data) => put(`${PATHS.submissions}/${id}`, data);
export const deleteSubmission = (id) => remove(`${PATHS.submissions}/${id}`);

// -------- Grade API --------
export const getGrades = () => get(PATHS.grades);
export const getGradesByStudent = (id) => get(`${PATHS.grades}/student/${id}`);
export const addGrade = (data) => post(PATHS.grades, data);
export const updateGrade = (id, data) => put(`${PATHS.grades}/${id}`, data);
export const deleteGrade = (id) => remove(`${PATHS.grades}/${id}`);

// -------- AI Prediction API --------
export const getAiPrediction = (id) => get(`${PATHS.ai}/predict/${id}`);
export const getPredictionHistory = (studentId) => get(`${PATHS.ai}/prediction/${studentId}`);

export default api;
