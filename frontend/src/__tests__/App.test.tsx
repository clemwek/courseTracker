import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockCourse, mockUser } from '../test/utils';
import App from '../App';

describe('App', () => {
  it('renders course list by default', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByText('Welcome to Course Tracker')).toBeInTheDocument();
    expect(screen.getByText('Available Courses')).toBeInTheDocument();
  });

  it('shows login form when showLogin is true', () => {
    const preloadedState = {
      auth: {
        user: null,
        isAuthenticated: false,
        showLogin: true,
      },
    };
    
    renderWithProviders(<App />, { preloadedState });
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('shows course content when course is selected', () => {
    const preloadedState = {
      course: {
        courses: [mockCourse],
        selectedCourse: mockCourse,
        weeks: Array.from({ length: 16 }, (_, i) => ({
          weekNumber: i + 1,
          title: `Week ${i + 1}`,
          items: [],
        })),
        currentWeek: 1,
      },
    };
    
    renderWithProviders(<App />, { preloadedState });
    
    expect(screen.getByText('Course Timeline')).toBeInTheDocument();
    expect(screen.getByText('Week 1')).toBeInTheDocument();
  });

  it('shows authenticated user interface', () => {
    const preloadedState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
      course: {
        courses: [mockCourse],
        selectedCourse: mockCourse,
        weeks: Array.from({ length: 16 }, (_, i) => ({
          weekNumber: i + 1,
          title: `Week ${i + 1}`,
          items: [],
        })),
        currentWeek: 1,
      },
    };
    
    renderWithProviders(<App />, { preloadedState });
    
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText('Admin Mode')).toBeInTheDocument();
  });
});