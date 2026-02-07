import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from './DashboardPage';

describe('ProtectedRoute', () => {
    test('renders protected page when user is authenticated', () => {
        const mockAuthValue = {
            isAuthenticated: true,
            user: { id: 1, username: 'testuser', role: 'STUDENT' },
            token: 'fake-token',
        };

        render(
            <Router>
                <AuthContext.Provider value={mockAuthValue}>
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                </AuthContext.Provider>
            </Router>
        );

        // Should render DashboardPage content when authenticated
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    test('shows loading spinner while checking authentication', () => {
        const mockAuthValue = {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: true,
        };

        render(
            <Router>
                <AuthContext.Provider value={mockAuthValue}>
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                </AuthContext.Provider>
            </Router>
        );

        // Should show some loading indicator
        expect(screen.queryByText(/loading/i)).toBeInTheDocument();
    });

    test('redirects to login when user is not authenticated', () => {
        const mockAuthValue = {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
        };

        render(
            <Router>
                <AuthContext.Provider value={mockAuthValue}>
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                </AuthContext.Provider>
            </Router>
        );

        // Should redirect to login (URL change)
        expect(window.location.pathname).toBe('/');
    });
});
