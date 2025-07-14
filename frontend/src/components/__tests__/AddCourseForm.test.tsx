import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import AddCourseForm from '../AddCourseForm';

describe('AddCourseForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders add course form', () => {
    renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Add New Course')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter course title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter instructor name')).toBeInTheDocument();
  });

  // it('handles form submission', async () => {
  //   const user = userEvent.setup();
  //   const { store } = renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
  //   await user.type(screen.getByPlaceholderText('Enter course title'), 'New Test Course');
  //   await user.type(screen.getByPlaceholderText('Enter instructor name'), 'Test Instructor');
  //   await user.type(screen.getByPlaceholderText('Enter course description'), 'Test description');
    
  //   const startDateInput = screen.getByLabelText(/start date/i);
  //   const endDateInput = screen.getByLabelText(/end date/i);
    
  //   await user.type(startDateInput, '2024-01-01');
  //   await user.type(endDateInput, '2024-05-01');
    
  //   await user.click(screen.getByText('Add Course'));
    
  //   expect(store.getState().course.courses).toHaveLength(5); // 4 initial + 1 new
  //   expect(mockOnClose).toHaveBeenCalled();
  // });

  // it('handles close button', () => {
  //   renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
  //   fireEvent.click(screen.getByTitle('Close'));
    
  //   expect(mockOnClose).toHaveBeenCalled();
  // });

  it('handles cancel button', () => {
    renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
    await user.click(screen.getByText('Add Course'));
    
    // Form should not submit without required fields
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles category selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddCourseForm onClose={mockOnClose} />);
    
    const categorySelect = screen.getByDisplayValue('Technology');
    await user.selectOptions(categorySelect, 'Marketing');
    
    expect(screen.getByDisplayValue('Marketing')).toBeInTheDocument();
  });
});