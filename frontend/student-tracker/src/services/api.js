import axios from "axios";

/**
 * Global axios instance for backend API calls.
 * Change baseURL when deploying.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080",
  headers: { "Content-Type": "application/json" }
});

// -------- Student API --------
export const getStudents = () => api.get("/students");
export const addStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// -------- Assignment API --------
export const getAssignments = () => api.get("/assignments");
export const addAssignment = (data) => api.post("/assignments", data);

// -------- Grade API --------
export const addGrade = (data) => api.post("/grades", data);
export const getGradesByStudent = (id) => api.get(`/grades/student/${id}`);

// -------- AI API --------
export const getAiPrediction = (id) => api.get(`/ai/predict/${id}`);
