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

    test('renders login form with username and password fields', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
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

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    test('displays error message on failed login', async () => {
        api.login.mockRejectedValue(new Error('Invalid credentials'));

        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), {
            target: { value: 'testuser' }
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

        expect(screen.getByText(/are you an instructor/i)).toBeInTheDocument();
    });

    test('has link to signup page', () => {
        render(
            <Router>
                <AuthProvider>
                    <StudentLoginPage />
                </AuthProvider>
            </Router>
        );

        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });
});
