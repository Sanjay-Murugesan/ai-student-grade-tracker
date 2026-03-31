import axiosInstance from "../api/axios";

export const loginUser = (email, password) =>
  axiosInstance.post("/api/auth/login", { email, password });

export const registerUser = (payload) =>
  axiosInstance.post("/api/auth/register", payload);

export const getStudentDashboard = () => axiosInstance.get("/api/students/dashboard");
export const getMyStudentProfile = () => axiosInstance.get("/api/students/me");
export const getStudentRoster = () => axiosInstance.get("/api/students/roster");
export const getTeacherDashboard = () => axiosInstance.get("/api/teacher/dashboard");

export const getMyGrades = () => axiosInstance.get("/api/grades/my");
export const getAllGrades = () => axiosInstance.get("/api/grades");
export const bulkSaveGrades = (payload) => axiosInstance.post("/api/grades/bulk", payload);

export const getAssignments = () => axiosInstance.get("/api/assignments");
export const getMyAssignments = () => axiosInstance.get("/api/assignments/my");
export const createAssignment = (payload) => axiosInstance.post("/api/assignments", payload);
export const publishAssignment = (id) => axiosInstance.patch(`/api/assignments/${id}/publish`);

export const getMySubmissions = () => axiosInstance.get("/api/submissions/my");
export const getAllSubmissions = () => axiosInstance.get("/api/submissions");
export const getUngradedSubmissions = () => axiosInstance.get("/api/submissions/ungraded");
export const gradeSubmission = (id, payload) =>
  axiosInstance.patch(`/api/submissions/${id}/grade`, payload);

export const getCourses = () => axiosInstance.get("/api/v1/courses");

export default axiosInstance;
