import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from '@/features/workflows/workflowSlice';
import connectionReducer from '@/features/connections/connectionSlice';

export const store = configureStore({
  reducer: {
    workflows: workflowReducer,
    connections: connectionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;