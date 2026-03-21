import axios from "axios";

jest.mock("axios", () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  };

  return {
    create: jest.fn(() => mockApiClient),
  };
});

import * as api from "../services/api";

const mockApiClient = axios.create.mock.results[0].value;

describe("API service", () => {
  const requestInterceptor = mockApiClient.interceptors.request.use.mock.calls[0][0];

  beforeEach(() => {
    mockApiClient.get.mockReset();
    mockApiClient.post.mockReset();
    mockApiClient.put.mockReset();
    mockApiClient.delete.mockReset();
    localStorage.clear();
  });

  test("loginUser should call POST /api/v1/auth/login", async () => {
    const mockResponse = { data: { token: "fake-token" } };
    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await api.loginUser("testuser", "password123", "STUDENT");

    expect(mockApiClient.post).toHaveBeenCalledWith("/api/v1/auth/login", {
      username: "testuser",
      password: "password123",
      role: "STUDENT",
    });
    expect(result).toBe(mockResponse);
  });

  test("getCourses should call GET /api/v1/courses", async () => {
    const mockResponse = { data: [{ courseId: 1, courseName: "Java" }] };
    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await api.getCourses();

    expect(mockApiClient.get).toHaveBeenCalledWith("/api/v1/courses");
    expect(result).toBe(mockResponse);
  });

  test("addAssignment should call POST /api/v1/assignments", async () => {
    const payload = { title: "Assignment 1", maxMarks: 100 };
    const mockResponse = { data: { assignmentId: 1, ...payload } };
    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await api.addAssignment(payload);

    expect(mockApiClient.post).toHaveBeenCalledWith("/api/v1/assignments", payload);
    expect(result).toBe(mockResponse);
  });

  test("updateGrade should call PUT /api/v1/grades/:id", async () => {
    const payload = { score: 90, feedback: "Excellent" };
    const mockResponse = { data: { gradeId: 1, ...payload } };
    mockApiClient.put.mockResolvedValue(mockResponse);

    const result = await api.updateGrade(1, payload);

    expect(mockApiClient.put).toHaveBeenCalledWith("/api/v1/grades/1", payload);
    expect(result).toBe(mockResponse);
  });

  test("getPredictionHistory should call GET /ai/prediction/:studentId", async () => {
    const mockResponse = { data: { studentId: 1, predictedScore: 85 } };
    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await api.getPredictionHistory(1);

    expect(mockApiClient.get).toHaveBeenCalledWith("/ai/prediction/1");
    expect(result).toBe(mockResponse);
  });

  test("request interceptor should add Authorization header when token exists", () => {
    localStorage.setItem("token", "abc123");

    const result = requestInterceptor({ headers: {} });

    expect(result.headers.Authorization).toBe("Bearer abc123");
  });

  test("request interceptor should safely handle missing headers object", () => {
    localStorage.removeItem("token");

    const result = requestInterceptor({});

    expect(result.headers).toEqual({});
  });

  test("API calls should propagate errors", async () => {
    const error = new Error("Network error");
    mockApiClient.get.mockRejectedValue(error);

    await expect(api.getGrades()).rejects.toThrow("Network error");
  });
});
