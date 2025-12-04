import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenResponse } from '@/lib/types/auth';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state from localStorage if token exists
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  return {
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<TokenResponse>) => {
      const token = action.payload.access_token;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout actions
    logoutSuccess: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Remove token from localStorage
      localStorage.removeItem('token');
    },

    // Set token (for persistent state)
    setToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.token = action.payload;
        state.isAuthenticated = true;
        // Store token in localStorage
        localStorage.setItem('token', action.payload);
      } else {
        state.token = null;
        state.isAuthenticated = false;
        // Remove token from localStorage
        localStorage.removeItem('token');
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  setToken,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
