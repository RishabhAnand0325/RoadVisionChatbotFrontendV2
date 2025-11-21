import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenResponse } from '@/lib/types/auth';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Load token from localStorage if available
const loadTokenFromStorage = (): string | null => {
  try {
    const token = localStorage.getItem('ceigall-auth-token');
    return token;
  } catch (error) {
    console.error('Failed to load token from localStorage:', error);
    return null;
  }
};

const savedToken = loadTokenFromStorage();

const initialState: AuthState = {
  token: savedToken,
  isAuthenticated: !!savedToken,
  isLoading: false,
  error: null,
};

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
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      // Save token to localStorage for persistence
      try {
        localStorage.setItem('ceigall-auth-token', action.payload.access_token);
      } catch (error) {
        console.error('Failed to save token to localStorage:', error);
      }
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
      // Clear token from localStorage
      try {
        localStorage.removeItem('ceigall-auth-token');
      } catch (error) {
        console.error('Failed to remove token from localStorage:', error);
      }
    },

    // Set token (for persistent state)
    setToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.token = action.payload;
        state.isAuthenticated = true;
        // Save to localStorage
        try {
          localStorage.setItem('ceigall-auth-token', action.payload);
        } catch (error) {
          console.error('Failed to save token to localStorage:', error);
        }
      } else {
        state.token = null;
        state.isAuthenticated = false;
        // Clear from localStorage
        try {
          localStorage.removeItem('ceigall-auth-token');
        } catch (error) {
          console.error('Failed to remove token from localStorage:', error);
        }
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
