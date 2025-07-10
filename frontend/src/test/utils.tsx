import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../store/slices/courseSlice';
import authReducer from '../store/slices/authSlice';

// Create a custom render function that includes Redux Provider
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      course: courseReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock course data for testing
export const mockCourse = {
  id: 'test-course-1',
  title: 'Test Course',
  description: 'A test course for unit testing',
  instructor: 'Test Instructor',
  duration: '16 weeks',
  startDate: '2024-01-01',
  endDate: '2024-05-01',
  totalWeeks: 16,
  imageUrl: 'https://example.com/test-image.jpg',
  category: 'Technology',
};

export const mockCourseItem = {
  id: 'test-item-1',
  title: 'Test Item',
  description: 'A test course item',
  completed: false,
  type: 'coursework' as const,
  dueDate: '2024-02-01',
};

export const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
};

export const mockWeek = {
  weekNumber: 1,
  title: 'Week 1',
  items: [mockCourseItem],
};