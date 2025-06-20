import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface DrawerState {
  open: boolean;
  mobileOpen: boolean;
}

interface UiState {
  snackbar: SnackbarState;
  drawer: DrawerState;
  theme: 'light' | 'dark';
  pageTitle: string;
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
}

// Initial state
const initialState: UiState = {
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
    duration: 5000, // Default duration in milliseconds
  },
  drawer: {
    open: true,
    mobileOpen: false,
  },
  theme: 'light',
  pageTitle: 'Venue Relationship Tracker',
  loading: {
    global: false,
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSnackbar: (state, action: PayloadAction<Partial<SnackbarState>>) => {
      state.snackbar = { ...state.snackbar, ...action.payload };
    },
    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
    toggleDrawer: (state) => {
      state.drawer.open = !state.drawer.open;
    },
    toggleMobileDrawer: (state) => {
      state.drawer.mobileOpen = !state.drawer.mobileOpen;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawer.open = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
  },
});

export const {
  setSnackbar,
  closeSnackbar,
  toggleDrawer,
  toggleMobileDrawer,
  setDrawerOpen,
  toggleTheme,
  setTheme,
  setPageTitle,
  setLoading,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;