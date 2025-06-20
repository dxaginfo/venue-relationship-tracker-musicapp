import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSnackbar } from './uiSlice';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  bandId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  bandId?: string;
}

interface AuthResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>('/api/v1/auth/login', credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      
      dispatch(setSnackbar({
        message: 'Login successful!',
        severity: 'success',
        open: true,
      }));
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to log in';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post<{ status: string; data: User }>('/api/v1/auth/register', registerData);
      
      dispatch(setSnackbar({
        message: 'Registration successful! Please log in.',
        severity: 'success',
        open: true,
      }));
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    dispatch(setSnackbar({
      message: 'Logged out successfully',
      severity: 'success',
      open: true,
    }));
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      return rejectWithValue('No token found');
    }
    
    try {
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Make a request to get current user
      const response = await axios.get<{ status: string; data: User }>('/api/v1/users/me');
      
      return {
        user: response.data.data,
        accessToken,
        refreshToken: localStorage.getItem('refreshToken'),
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed';
      
      // If token is invalid, clear storage
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      return rejectWithValue(message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    });
    
    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload as string;
      state.accessToken = null;
      state.refreshToken = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;