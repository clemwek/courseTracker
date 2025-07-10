import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockCourseItem, mockUser } from '../../test/utils';
import CourseItemCard from '../CourseItemCard';

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));

describe('CourseItemCard', () => {
  const defaultProps = {
    item: mockCourseItem,
    weekNumber: 1,
  };

  it('renders course item information', () => {
    renderWithProviders(<CourseItemCard {...defaultProps} />);
    
    expect(screen.getByText(mockCourseItem.title)).toBeInTheDocument();
    expect(screen.getByText(mockCourseItem.description)).toBeInTheDocument();
    expect(screen.getByText(mockCourseItem.type)).toBeInTheDocument();
  });

  it('displays due date when present', () => {
    renderWithProviders(<CourseItemCard {...defaultProps} />);
    
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('handles completion toggle', () => {
    const { store } = renderWithProviders(<CourseItemCard {...defaultProps} />);
    
    const completeButton = screen.getByTitle('Mark as complete');
    fireEvent.click(completeButton);
    
    // Check if the item was marked as completed in the store
    const week = store.getState().course.weeks.find(w => w.weekNumber === 1);
    expect(week?.items[0]?.completed).toBe(true);
  });

  it('shows edit and delete buttons for admin', () => {
    const adminState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    renderWithProviders(<CourseItemCard {...defaultProps} />, { preloadedState: adminState });
    
    expect(screen.getByTitle('Edit item')).toBeInTheDocument();
    expect(screen.getByTitle('Delete item')).toBeInTheDocument();
  });

  it('does not show edit and delete buttons for non-admin', () => {
    renderWithProviders(<CourseItemCard {...defaultProps} />);
    
    expect(screen.queryByTitle('Edit item')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete item')).not.toBeInTheDocument();
  });

  it('handles delete action', () => {
    const adminState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
      course: {
        courses: [],
        selectedCourse: null,
        weeks: [{ weekNumber: 1, title: 'Week 1', items: [mockCourseItem] }],
        currentWeek: 1,
      },
    };
    
    const { store } = renderWithProviders(<CourseItemCard {...defaultProps} />, { preloadedState: adminState });
    
    const deleteButton = screen.getByTitle('Delete item');
    fireEvent.click(deleteButton);
    
    // Check if the item was removed from the store
    const week = store.getState().course.weeks.find(w => w.weekNumber === 1);
    expect(week?.items).toHaveLength(0);
  });

  it('enters edit mode when edit button clicked', () => {
    const adminState = {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        showLogin: false,
      },
    };
    
    renderWithProviders(<CourseItemCard {...defaultProps} />, { preloadedState: adminState });
    
    const editButton = screen.getByTitle('Edit item');
    fireEvent.click(editButton);
    
    // Should show edit form
    expect(screen.getByDisplayValue(mockCourseItem.title)).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});