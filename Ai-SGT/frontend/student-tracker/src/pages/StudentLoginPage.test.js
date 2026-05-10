import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import StudentLoginPage from './StudentLoginPage';
import * as api from '../services/api';

jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('StudentLoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form with email and password fields', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('updates input fields on user input', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'student@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('student@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('displays error message on failed login', async () => {
        api.loginUser.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: 'student@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrongpassword' }
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    test('has link to instructor login', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        expect(screen.getByText(/instructor login/i)).toBeInTheDocument();
    });

    test('has link to signup page', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });
});
