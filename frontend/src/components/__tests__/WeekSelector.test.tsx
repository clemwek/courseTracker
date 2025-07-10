import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockCourseItem } from '../../test/utils';
import WeekSelector from '../WeekSelector';

describe('WeekSelector', () => {
  const preloadedState = {
    course: {
      courses: [],
      selectedCourse: null,
      weeks: [
        { weekNumber: 1, title: 'Week 1', items: [mockCourseItem] },
        { weekNumber: 2, title: 'Week 2', items: [] },
        ...Array.from({ length: 14 }, (_, i) => ({
          weekNumber: i + 3,
          title: `Week ${i + 3}`,
          items: [],
        })),
      ],
      currentWeek: 1,
    },
  };

  it('renders week selector with all weeks', () => {
    renderWithProviders(<WeekSelector />, { preloadedState });
    
    expect(screen.getByText('Course Timeline')).toBeInTheDocument();
    expect(screen.getByText('Week 1 of 16')).toBeInTheDocument();
    
    // Should show all 16 weeks
    for (let i = 1; i <= 16; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('highlights current week', () => {
    renderWithProviders(<WeekSelector />, { preloadedState });
    
    const currentWeekButton = screen.getByText('1').closest('button');
    expect(currentWeekButton).toHaveClass('from-blue-600');
  });

  it('handles week selection', () => {
    const { store } = renderWithProviders(<WeekSelector />, { preloadedState });
    
    const week5Button = screen.getByText('5').closest('button');
    fireEvent.click(week5Button!);
    
    expect(store.getState().course.currentWeek).toBe(5);
  });

  it('handles previous week navigation', () => {
    const stateWithWeek5 = {
      ...preloadedState,
      course: {
        ...preloadedState.course,
        currentWeek: 5,
      },
    };
    
    const { store } = renderWithProviders(<WeekSelector />, { preloadedState: stateWithWeek5 });
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    
    expect(store.getState().course.currentWeek).toBe(4);
  });

  it('handles next week navigation', () => {
    const { store } = renderWithProviders(<WeekSelector />, { preloadedState });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    expect(store.getState().course.currentWeek).toBe(2);
  });

  it('disables previous button on week 1', () => {
    renderWithProviders(<WeekSelector />, { preloadedState });
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on week 16', () => {
    const stateWithWeek16 = {
      ...preloadedState,
      course: {
        ...preloadedState.course,
        currentWeek: 16,
      },
    };
    
    renderWithProviders(<WeekSelector />, { preloadedState: stateWithWeek16 });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('shows progress bar for weeks with items', () => {
    renderWithProviders(<WeekSelector />, { preloadedState });
    
    // Week 1 has 1 item, so it should show some progress
    const week1Button = screen.getByText('1').closest('button');
    const progressBar = week1Button?.querySelector('.bg-white.rounded-full.h-1');
    expect(progressBar).toBeInTheDocument();
  });

  it('displays overall progress', () => {
    renderWithProviders(<WeekSelector />, { preloadedState });
    
    expect(screen.getByText(/Overall Progress:/)).toBeInTheDocument();
  });
});