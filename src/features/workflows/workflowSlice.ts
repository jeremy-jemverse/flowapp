import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowData as Workflow } from './types/workflow';

interface WorkflowState {
  items: Workflow[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: keyof Workflow | `metadata.${keyof Workflow['metadata']}`;
  sortOrder: 'asc' | 'desc';
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  initialized: boolean;
}

const initialState: WorkflowState = {
  items: [
    // Sample data for development
    {
      workflowId: 'wf-123',
      name: 'Content Approval Flow',
      description: 'Workflow for content approval process',
      flowType: 'approval',
      flowStatus: 'draft',
      metadata: {
        createdBy: 'Marketing Team',
        createdAt: '2024-03-12T11:20:00Z',
        updatedAt: '2024-03-12T11:20:00Z',
        tags: ['Content', 'Marketing', 'Compliance'],
        nodeCount: 4
      },
      nodes: [],
      edges: [],
      version: '1.0.0',
      execution: {
        mode: 'sequential'
      }
    }
  ],
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'metadata.createdAt',
  sortOrder: 'desc',
  status: 'idle',
  error: null,
  initialized: true
};

export const createWorkflow = createAsyncThunk(
  'workflows/create',
  async (data: Workflow) => {
    // TODO: Implement API call
    return null;
  }
);

export const updateWorkflow = createAsyncThunk(
  'workflows/update',
  async ({ id, data }: { id: string; data: Partial<Workflow> }) => {
    try {
      // TODO: Replace with actual API call
      const response = await Promise.resolve({ ...data, id });
      return response;
    } catch (error) {
      throw new Error('Failed to update workflow');
    }
  }
);

const workflowSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<keyof Workflow | `metadata.${keyof Workflow['metadata']}`>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorkflow.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        if (action.payload && action.payload.workflowId) {
          const updatedWorkflow = action.payload as Workflow;
          state.items = state.items.map((item) => 
            item.workflowId === updatedWorkflow.workflowId ? updatedWorkflow : item
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
} = workflowSlice.actions;

export default workflowSlice.reducer;