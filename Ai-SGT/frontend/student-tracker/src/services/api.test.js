import axios from 'axios';
import * as api from '../services/api';

jest.mock('axios');

describe('API Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('login should call POST /api/v1/auth/login', async () => {
        const loginData = { username: 'testuser', password: 'password123' };
        const mockResponse = { data: { token: 'fake-token', user: {} } };

        axios.post.mockResolvedValue(mockResponse);

        // Note: This assumes your API has a login function
        // Adjust based on your actual api.js implementation
        const result = await api.login(loginData);

        expect(axios.post).toHaveBeenCalledWith('/api/v1/auth/login', loginData);
        expect(result).toEqual(mockResponse.data);
    });

    test('getUsers should call GET /api/v1/users', async () => {
        const mockResponse = { data: [{ id: 1, username: 'user1' }] };

        axios.get.mockResolvedValue(mockResponse);

        const result = await api.getUsers();

        expect(axios.get).toHaveBeenCalledWith('/api/v1/users');
        expect(result).toEqual(mockResponse.data);
    });

    test('createUser should call POST /api/v1/users', async () => {
        const userData = { username: 'newuser', email: 'new@example.com' };
        const mockResponse = { data: { id: 2, ...userData } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await api.createUser(userData);

        expect(axios.post).toHaveBeenCalledWith('/api/v1/users', userData);
        expect(result).toEqual(mockResponse.data);
    });

    test('getCourses should call GET /api/v1/courses', async () => {
        const mockResponse = { data: [{ courseId: 1, courseName: 'Java' }] };

        axios.get.mockResolvedValue(mockResponse);

        const result = await api.getCourses();

        expect(axios.get).toHaveBeenCalledWith('/api/v1/courses');
        expect(result).toEqual(mockResponse.data);
    });

    test('getAssignments should call GET /api/v1/assignments', async () => {
        const mockResponse = { data: [{ assignmentId: 1, title: 'Assignment 1' }] };

        axios.get.mockResolvedValue(mockResponse);

        const result = await api.getAssignments();

        expect(axios.get).toHaveBeenCalledWith('/api/v1/assignments');
        expect(result).toEqual(mockResponse.data);
    });

    test('getGrades should call GET /api/v1/grades', async () => {
        const mockResponse = { data: [{ gradeId: 1, score: 85 }] };

        axios.get.mockResolvedValue(mockResponse);

        const result = await api.getGrades();

        expect(axios.get).toHaveBeenCalledWith('/api/v1/grades');
        expect(result).toEqual(mockResponse.data);
    });

    test('updateGrade should call PUT /api/v1/grades/:id', async () => {
        const gradeData = { score: 90, feedback: 'Excellent' };
        const mockResponse = { data: { gradeId: 1, ...gradeData } };

        axios.put.mockResolvedValue(mockResponse);

        const result = await api.updateGrade(1, gradeData);

        expect(axios.put).toHaveBeenCalledWith('/api/v1/grades/1', gradeData);
        expect(result).toEqual(mockResponse.data);
    });

    test('getPredictions should call GET /ai/predict/:studentId', async () => {
        const mockResponse = { data: { studentId: 1, predictedScore: 85, riskLevel: 'LOW' } };

        axios.get.mockResolvedValue(mockResponse);

        const result = await api.getPredictions(1);

        expect(axios.get).toHaveBeenCalledWith('/ai/predict/1');
        expect(result).toEqual(mockResponse.data);
    });

    test('API should handle errors gracefully', async () => {
        const error = new Error('Network error');
        axios.get.mockRejectedValue(error);

        try {
            await api.getUsers();
        } catch (e) {
            expect(e.message).toBe('Network error');
        }
    });
});
