import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  showLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.showLogin = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.showLogin = false;
    },
    showLoginForm: (state) => {
      state.showLogin = true;
    },
    hideLoginForm: (state) => {
      state.showLogin = false;
    },
  },
});

export const { login, logout, showLoginForm, hideLoginForm } = authSlice.actions;
export default authSlice.reducer;