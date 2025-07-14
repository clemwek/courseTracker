import { describe, it, expect } from 'vitest';
import authReducer, {
  login,
  logout,
  showLoginForm,
  hideLoginForm,
} from '../authSlice';
import { mockUser } from '../../../test/utils';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    showLogin: false,
  };

  it('should handle login', () => {
    const action = login(mockUser);
    const state = authReducer(initialState, action);
    
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.showLogin).toBe(false);
  });

  it('should handle logout', () => {
    const authenticatedState = {
      user: mockUser,
      isAuthenticated: true,
      showLogin: false,
    };
    
    const action = logout();
    const state = authReducer(authenticatedState, action);
    
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.showLogin).toBe(false);
  });

  it('should show login form', () => {
    const action = showLoginForm();
    const state = authReducer(initialState, action);
    
    expect(state.showLogin).toBe(true);
  });

  it('should hide login form', () => {
    const stateWithLogin = { ...initialState, showLogin: true };
    
    const action = hideLoginForm();
    const state = authReducer(stateWithLogin, action);
    
    expect(state.showLogin).toBe(false);
  });
});