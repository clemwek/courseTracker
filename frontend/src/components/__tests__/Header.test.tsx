import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockUser, mockCourse } from '../../test/utils';
import Header from '../Header';

describe('Header', () => {
  it('renders course tracker title when no course selected', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Course Tracker')).toBeInTheDocument();
    expect(screen.getByText('16-Week Programs')).toBeInTheDocument();
  });

  it('renders selected course title', () => {
    const preloadedState = {
      course: {
        courses: [mockCourse],
        selectedCourse: mockCourse,
        weeks: [],
        currentWeek: 1,
      },
    };
    
    renderWithProviders(<Header />, { preloadedState });
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText('16 weeks Program')).toBeInTheDocument();
  });

  it('shows back button when course is selected', () => {
    const preloadedState = {
      course: {
        courses: [mockCourse],
        selectedCourse: mockCourse,
        weeks: [],
        currentWeek: 1,
      },
    };
    
    renderWithProviders(<Header />, { preloadedState });
    
    expect(screen.getByText('Back to Courses')).toBeInTheDocument();
  });

  it('shows admin button when not authenticated', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows user info and logout when authenticated', () => {
    const preloadedState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    renderWithProviders(<Header />, { preloadedState });
    
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout click', () => {
    const preloadedState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    const { store } = renderWithProviders(<Header />, { preloadedState });
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('handles admin login click', () => {
    const { store } = renderWithProviders(<Header />);
    
    fireEvent.click(screen.getByText('Admin'));
    
    expect(store.getState().auth.showLogin).toBe(true);
  });
});