import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchConnections } from '../connectionSlice';
import { MigrationService } from '../services/migration.service';

export function useConnectionData() {
  const dispatch = useDispatch();
  const { status, error, initialized } = useSelector((state: RootState) => state.connections);

  useEffect(() => {
    const loadData = async () => {
      if (!initialized && status === 'idle') {
        try {
          console.log('useConnectionData: Running migrations...');
          await MigrationService.addDatabaseTypeColumn();
          
          console.log('useConnectionData: Initial data fetch');
          await dispatch(fetchConnections());
        } catch (error) {
          console.error('useConnectionData: Error during initialization:', error);
        }
      }
    };

    loadData();
  }, [dispatch, initialized, status]);

  return {
    status,
    error,
    isLoading: status === 'loading',
    refresh: () => dispatch(fetchConnections())
  };
}