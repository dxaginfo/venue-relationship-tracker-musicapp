import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSnackbar } from './uiSlice';

// Types
export interface VenueAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface VenueContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  notes?: string;
  venueId: string;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: VenueAddress;
  capacity: number;
  website?: string;
  email?: string;
  phone?: string;
  venueType: string;
  techSpecs?: string;
  greenRoom: boolean;
  loadIn?: string;
  loadOut?: string;
  parkingInfo?: string;
  foodOptions?: string;
  alcoholOptions?: string;
  merchandiseOptions?: string;
  accessibilityInfo?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  contacts?: VenueContact[];
}

interface VenueState {
  venues: Venue[];
  currentVenue: Venue | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  filter: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    venueType?: string;
    minCapacity?: number;
    maxCapacity?: number;
  };
}

interface GetVenuesParams {
  page?: number;
  limit?: number;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  venueType?: string;
  minCapacity?: number;
  maxCapacity?: number;
}

// Initial state
const initialState: VenueState = {
  venues: [],
  currentVenue: null,
  loading: false,
  error: null,
  totalCount: 0,
  page: 1,
  limit: 10,
  filter: {},
};

// Async thunks
export const getVenues = createAsyncThunk(
  'venues/getVenues',
  async (params: GetVenuesParams = {}, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/venues', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch venues';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const getVenueById = createAsyncThunk(
  'venues/getVenueById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/venues/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch venue details';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const createVenue = createAsyncThunk(
  'venues/createVenue',
  async (venueData: Partial<Venue>, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/venues', venueData);
      dispatch(setSnackbar({
        message: 'Venue created successfully!',
        severity: 'success',
        open: true,
      }));
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create venue';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const updateVenue = createAsyncThunk(
  'venues/updateVenue',
  async ({ id, venueData }: { id: string; venueData: Partial<Venue> }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/venues/${id}`, venueData);
      dispatch(setSnackbar({
        message: 'Venue updated successfully!',
        severity: 'success',
        open: true,
      }));
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update venue';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

export const deleteVenue = createAsyncThunk(
  'venues/deleteVenue',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/venues/${id}`);
      dispatch(setSnackbar({
        message: 'Venue deleted successfully!',
        severity: 'success',
        open: true,
      }));
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete venue';
      dispatch(setSnackbar({
        message,
        severity: 'error',
        open: true,
      }));
      return rejectWithValue(message);
    }
  }
);

// Slice
const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    clearVenueError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<VenueState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter: (state) => {
      state.filter = {};
    },
    clearCurrentVenue: (state) => {
      state.currentVenue = null;
    },
  },
  extraReducers: (builder) => {
    // Get Venues
    builder.addCase(getVenues.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVenues.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.venues = action.payload.data;
      state.totalCount = action.payload.totalCount || action.payload.data.length;
    });
    builder.addCase(getVenues.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Get Venue by ID
    builder.addCase(getVenueById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVenueById.fulfilled, (state, action: PayloadAction<Venue>) => {
      state.loading = false;
      state.currentVenue = action.payload;
    });
    builder.addCase(getVenueById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create Venue
    builder.addCase(createVenue.fulfilled, (state, action: PayloadAction<Venue>) => {
      state.venues.push(action.payload);
      state.totalCount += 1;
    });
    
    // Update Venue
    builder.addCase(updateVenue.fulfilled, (state, action: PayloadAction<Venue>) => {
      const index = state.venues.findIndex(venue => venue.id === action.payload.id);
      if (index !== -1) {
        state.venues[index] = action.payload;
      }
      if (state.currentVenue?.id === action.payload.id) {
        state.currentVenue = action.payload;
      }
    });
    
    // Delete Venue
    builder.addCase(deleteVenue.fulfilled, (state, action: PayloadAction<string>) => {
      state.venues = state.venues.filter(venue => venue.id !== action.payload);
      state.totalCount -= 1;
      if (state.currentVenue?.id === action.payload) {
        state.currentVenue = null;
      }
    });
  },
});

export const {
  clearVenueError,
  setPage,
  setLimit,
  setFilter,
  clearFilter,
  clearCurrentVenue,
} = venueSlice.actions;

export default venueSlice.reducer;