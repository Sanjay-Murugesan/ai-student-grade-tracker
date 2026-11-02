import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------- helpers --------
const get = (url) => api.get(url);
const post = (url, data) => api.post(url, data);
const put = (url, data) => api.put(url, data);
const remove = (url) => api.delete(url);

// -------- AUTH --------
export const signupUser = (data) => post("/api/v1/auth/signup", data);
export const loginUser = (identifier, password, role) => {
  const key = identifier?.includes("@") ? "email" : "username";
  return post("/api/v1/auth/login", { [key]: identifier, password, role });
};

// -------- USERS / PROFILE --------
export const getProfile = (id) => get(`/api/v1/users/${id}`);
export const updateProfile = (id, data) => put(`/api/v1/users/${id}`, data);
export const getUser = (id) => get(`/api/v1/users/${id}`);

// -------- STUDENTS --------
export const getStudents = () => get("/api/v1/students");
export const getStudent = (id) => get(`/api/v1/students/${id}`);
export const getStudentByUserId = (userId) => get(`/api/v1/students/user/${userId}`);
export const createStudent = (data) => post("/api/v1/students", data);
export const addStudent = createStudent;
export const updateStudent = (id, data) => put(`/api/v1/students/${id}`, data);
export const deleteStudent = (id) => remove(`/api/v1/students/${id}`);

// -------- INSTRUCTORS --------
export const getInstructors = () => get("/api/v1/instructors");
export const getInstructor = (id) => get(`/api/v1/instructors/${id}`);
export const getInstructorByUserId = (userId) => get(`/api/v1/instructors/user/${userId}`);
export const createInstructor = (data) => post("/api/v1/instructors", data);

// -------- COURSES --------
export const getCourses = () => get("/api/v1/courses");
export const getCoursesByInstructor = (instructorId) => get(`/api/v1/courses/instructor/${instructorId}`);
export const createCourse = (data) => post("/api/v1/courses", data);
export const updateCourse = (id, data) => put(`/api/v1/courses/${id}`, data);
export const deleteCourse = (id) => remove(`/api/v1/courses/${id}`);

// -------- ASSIGNMENTS --------
export const getAssignments = () => get("/api/v1/assignments");
export const getAssignmentById = (id) => get(`/api/v1/assignments/${id}`);
export const createAssignment = (data) => post("/api/v1/assignments", data);
export const addAssignment = createAssignment;
export const updateAssignment = (id, data) => put(`/api/v1/assignments/${id}`, data);
export const deleteAssignment = (id) => remove(`/api/v1/assignments/${id}`);

// -------- SUBMISSIONS --------
export const getSubmissions = () => get("/api/v1/submissions");
export const getSubmissionsByStudent = (studentId) => get(`/api/v1/submissions/student/${studentId}`);
export const getSubmissionsByAssignment = (assignmentId) => get(`/api/v1/submissions/assignment/${assignmentId}`);
export const createSubmission = (data) => post("/api/v1/submissions", data);
export const submitAssignment = createSubmission;
export const updateSubmission = (id, data) => put(`/api/v1/submissions/${id}`, data);
export const deleteSubmission = (id) => remove(`/api/v1/submissions/${id}`);

// -------- GRADES --------
export const getGrades = () => get("/api/v1/grades");
export const getGradesByStudent = (studentId) => get(`/api/v1/grades/student/${studentId}`);
export const getGpaSummary = (studentId) => get(`/api/v1/grades/student/${studentId}/summary`);
export const createGrade = (data) => post("/api/v1/grades", data);
export const addGrade = createGrade;
export const updateGrade = (id, data) => put(`/api/v1/grades/${id}`, data);
export const deleteGrade = (id) => remove(`/api/v1/grades/${id}`);

// -------- ATTENDANCE --------
export const getAttendance = () => get("/api/v1/attendance");
export const getAttendanceByStudent = (studentId) => get(`/api/v1/attendance/student/${studentId}`);
export const markAttendance = (data) => post("/api/v1/attendance", data);
export const updateAttendance = (id, data) => put(`/api/v1/attendance/${id}`, data);
export const deleteAttendance = (id) => remove(`/api/v1/attendance/${id}`);

// -------- AI --------
export const predictPerformance = (data) => post("/api/v1/ai/predict", data);
export const getAiPrediction = (studentId) => get(`/api/v1/ai/predict/${studentId}`);
export const getPredictionHistory = (studentId) => get(`/api/v1/ai/prediction/${studentId}`);
export const getAiInsights = (studentId) => get(`/api/v1/ai/insights/${studentId}`);

// -------- NOTIFICATIONS --------
export const getNotifications = () => get("/api/v1/notifications");
export const getNotificationsByStudent = (studentId) => get(`/api/v1/notifications/student/${studentId}`);
export const createNotification = (data) => post("/api/v1/notifications", data);

export default api;
