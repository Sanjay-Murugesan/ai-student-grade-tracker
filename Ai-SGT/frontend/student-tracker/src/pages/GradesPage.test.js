import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import GradesPage from './GradesPage';
import * as api from '../services/api';

jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('GradesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders grades table on load', async () => {
        const mockGrades = [
            {
                gradeId: 1,
                studentId: 1,
                assignmentId: 1,
                score: 85,
                feedback: 'Good work!',
            },
        ];

        api.getGrades.mockResolvedValue(mockGrades);

        render(
            <Router>
                <AuthProvider>
                    <GradesPage />
                </AuthProvider>
            </Router>
        );

        await waitFor(() => {
            expect(api.getGrades).toHaveBeenCalled();
        });
    });

    test('displays grades with assignment details', async () => {
        const mockGrades = [
            {
                gradeId: 1,
                assignmentId: 1,
                score: 85,
                feedback: 'Good work!',
                assignment: { title: 'Assignment 1' },
            },
        ];

        api.getGrades.mockResolvedValue(mockGrades);

        render(
            <Router>
                <AuthProvider>
                    <GradesPage />
                </AuthProvider>
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('85')).toBeInTheDocument();
            expect(screen.getByText('Good work!')).toBeInTheDocument();
        });
    });

    test('shows empty state when no grades exist', async () => {
        api.getGrades.mockResolvedValue([]);

        render(
            <Router>
                <AuthProvider>
                    <GradesPage />
                </AuthProvider>
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/no grades found/i)).toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        api.getGrades.mockRejectedValue(new Error('Failed to fetch grades'));

        render(
            <Router>
                <AuthProvider>
                    <GradesPage />
                </AuthProvider>
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/error loading grades/i)).toBeInTheDocument();
        });
    });
});
