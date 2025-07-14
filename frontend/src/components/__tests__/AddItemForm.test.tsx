import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import AddItemForm from '../AddItemForm';

describe('AddItemForm', () => {
  const defaultProps = {
    weekNumber: 1,
  };

  it('renders add item button initially', () => {
    renderWithProviders(<AddItemForm {...defaultProps} />);
    
    expect(screen.getByText('Add New Item')).toBeInTheDocument();
  });

  it('opens form when add button clicked', () => {
    renderWithProviders(<AddItemForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Add New Item'));
    
    expect(screen.getByPlaceholderText('Enter title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AddItemForm {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByText('Add New Item'));
    
    // Fill form
    await user.type(screen.getByPlaceholderText('Enter title'), 'New Test Item');
    await user.type(screen.getByPlaceholderText('Enter description'), 'Test description');
    await user.selectOptions(screen.getByDisplayValue('Coursework'), 'assignment');
    
    // Submit form
    await user.click(screen.getByText('Add Item'));
    
    // Check if item was added to store
    const week = store.getState().course.weeks.find(w => w.weekNumber === 1);
    expect(week?.items).toHaveLength(1);
    expect(week?.items[0].title).toBe('New Test Item');
    expect(week?.items[0].type).toBe('assignment');
  });

  it('handles form cancellation', () => {
    renderWithProviders(<AddItemForm {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByText('Add New Item'));
    
    // Cancel form
    fireEvent.click(screen.getByText('Cancel'));
    
    // Should return to button state
    expect(screen.getByText('Add New Item')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter title')).not.toBeInTheDocument();
  });

  // it('handles close button', () => {
  //   renderWithProviders(<AddItemForm {...defaultProps} />);
    
  //   // Open form
  //   fireEvent.click(screen.getByText('Add New Item'));
    
  //   // Close form
  //   fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
  //   // Should return to button state
  //   expect(screen.getByText('Add New Item')).toBeInTheDocument();
  // });

  it('validates required title field', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AddItemForm {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByText('Add New Item'));
    
    // Try to submit without title
    await user.click(screen.getByText('Add Item'));
    
    // Should not add item to store
    const week = store.getState().course.weeks.find(w => w.weekNumber === 1);
    expect(week?.items).toHaveLength(0);
  });

  it('handles type selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddItemForm {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByText('Add New Item'));
    
    const typeSelect = screen.getByDisplayValue('Coursework');
    await user.selectOptions(typeSelect, 'reading');
    
    expect(screen.getByDisplayValue('Reading Material')).toBeInTheDocument();
  });

  // it('handles due date input', async () => {
  //   const user = userEvent.setup();
  //   renderWithProviders(<AddItemForm {...defaultProps} />);
    
  //   // Open form
  //   fireEvent.click(screen.getByText('Add New Item'));
    
  //   const dueDateInput = screen.getByLabelText(/due date/i);
  //   await user.type(dueDateInput, '2024-02-01');
    
  //   expect(dueDateInput).toHaveValue('2024-02-01');
  // });
});