import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import venueReducer from './slices/venueSlice';
import bookingReducer from './slices/bookingSlice';
import communicationReducer from './slices/communicationSlice';
import performanceReducer from './slices/performanceSlice';
import bandReducer from './slices/bandSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    venues: venueReducer,
    bookings: bookingReducer,
    communications: communicationReducer,
    performances: performanceReducer,
    bands: bandReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['auth/login/fulfilled', 'auth/checkAuth/fulfilled'],
        // Ignore these field paths in state for serialization check
        ignoredPaths: ['auth.user', 'ui.snackbar'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;