import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionDetails, ConnectionFormData } from './types';
import { ConnectionService } from './services/connection.service';

interface ConnectionState {
  items: ConnectionDetails[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: keyof ConnectionDetails;
  sortOrder: 'asc' | 'desc';
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  initialized: boolean;
}

const initialState: ConnectionState = {
  items: [],
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'connection_name',
  sortOrder: 'asc',
  status: 'idle',
  error: null,
  initialized: false
};

export const fetchConnections = createAsyncThunk(
  'connections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('connectionSlice: Fetching connections');
      const connections = await ConnectionService.getAll();
      console.log('connectionSlice: Fetch successful', connections);
      return connections;
    } catch (error) {
      console.error('connectionSlice: Fetch failed', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch connections';
      return rejectWithValue(message);
    }
  }
);

export const createConnection = createAsyncThunk(
  'connections/create',
  async (data: ConnectionFormData, { rejectWithValue }) => {
    try {
      console.log('connectionSlice: Creating connection', data);
      const connection = await ConnectionService.create(data);
      console.log('connectionSlice: Create successful', connection);
      return connection;
    } catch (error) {
      console.error('connectionSlice: Create failed', error);
      const message = error instanceof Error ? error.message : 'Failed to create connection';
      return rejectWithValue(message);
    }
  }
);

export const updateConnection = createAsyncThunk(
  'connections/update',
  async ({ id, data }: { id: string; data: Partial<ConnectionFormData> }, { rejectWithValue }) => {
    try {
      console.log('connectionSlice: Updating connection', { id, data });
      const connection = await ConnectionService.update(id, data);
      console.log('connectionSlice: Update successful', connection);
      return connection;
    } catch (error) {
      console.error('connectionSlice: Update failed', error);
      const message = error instanceof Error ? error.message : 'Failed to update connection';
      return rejectWithValue(message);
    }
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<keyof ConnectionDetails>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.initialized = true;
      })
      .addCase(createConnection.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(updateConnection.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = state.items.map(item => 
            item.id === action.payload.id ? action.payload : item
          );
        }
      });
  },
});

export const { 
  setViewMode, 
  setSearchQuery, 
  setSortBy, 
  setSortOrder 
} = connectionSlice.actions;

export default connectionSlice.reducer;