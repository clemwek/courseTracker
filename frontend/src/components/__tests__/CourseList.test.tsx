import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockCourse, mockUser } from '../../test/utils';
import CourseList from '../CourseList';

describe('CourseList', () => {
  const preloadedState = {
    course: {
      courses: [mockCourse],
      selectedCourse: null,
      weeks: [],
      currentWeek: 1,
    },
  };

  it('renders welcome message and course list', () => {
    renderWithProviders(<CourseList />, { preloadedState });
    
    expect(screen.getByText('Welcome to Course Tracker')).toBeInTheDocument();
    expect(screen.getByText('Available Courses')).toBeInTheDocument();
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
  });

  it('displays course information correctly', () => {
    renderWithProviders(<CourseList />, { preloadedState });
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.instructor)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.category)).toBeInTheDocument();
  });

  it('selects course when clicked', () => {
    const { store } = renderWithProviders(<CourseList />, { preloadedState });
    
    fireEvent.click(screen.getByText(mockCourse.title));
    
    expect(store.getState().course.selectedCourse).toEqual(mockCourse);
  });

  it('shows add course button for admin', () => {
    const adminState = {
      ...preloadedState,
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    renderWithProviders(<CourseList />, { preloadedState: adminState });
    
    expect(screen.getByText('Add Course')).toBeInTheDocument();
  });

  it('does not show add course button for non-admin', () => {
    renderWithProviders(<CourseList />, { preloadedState });
    
    expect(screen.queryByText('Add Course')).not.toBeInTheDocument();
  });

  it('shows empty state when no courses', () => {
    const emptyCourseState = {
      ...preloadedState,
      course: {
        ...preloadedState.course,
        courses: [],
      },
    };
    
    renderWithProviders(<CourseList />, { preloadedState: emptyCourseState });
    
    expect(screen.getByText('No Courses Available')).toBeInTheDocument();
  });

  it('shows edit button for admin on course cards', () => {
    const adminState = {
      ...preloadedState,
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    renderWithProviders(<CourseList />, { preloadedState: adminState });
    
    expect(screen.getByTitle('Edit course')).toBeInTheDocument();
  });
});