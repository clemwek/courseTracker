import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginForm />);
    
    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await user.click(screen.getByText('Sign In'));
    
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.email).toBe('test@example.com');
  });

  it('handles quick admin login', () => {
    const { store } = renderWithProviders(<LoginForm />);
    
    fireEvent.click(screen.getByText('Admin Demo'));
    
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.role).toBe('admin');
  });

  it('handles quick student login', () => {
    const { store } = renderWithProviders(<LoginForm />);
    
    fireEvent.click(screen.getByText('Student Demo'));
    
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.role).toBe('user');
  });

  // it('handles close button', () => {
  //   const { store } = renderWithProviders(<LoginForm />);
    
  //   fireEvent.click(screen.getByTitle('Close'));
    
  //   expect(store.getState().auth.showLogin).toBe(false);
  // });

  it('changes role selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const roleSelect = screen.getByDisplayValue('Administrator');
    await user.selectOptions(roleSelect, 'user');
    
    expect(screen.getByDisplayValue('Student')).toBeInTheDocument();
  });
});