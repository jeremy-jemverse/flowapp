import { useState, useEffect } from 'react';
import { connectionsApi } from '@/features/connections/api';
import { PostgresConnection } from '../types';

export function usePostgresConnections() {
  const [connections, setConnections] = useState<PostgresConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await connectionsApi.getPostgresConnections();
      // Transform and filter the connections, ensuring all required fields are present
      const postgresConnections = data
        .filter(conn => conn.connection_category === 'database' && conn.host_name)
        .map(conn => ({
          id: conn.id,
          connection_name: conn.connection_name,
          host_name: conn.host_name!,
          port: conn.port || 5432,
          database_name: conn.database_name || '',
          conn_user: conn.conn_user || '',
          conn_password: conn.conn_password || '',
          ssl: conn.ssl || false
        }));
      setConnections(postgresConnections);
    } catch (err) {
      setError('Failed to load connections');
      console.error('Failed to load connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const refreshConnections = () => {
    setIsLoading(true);
    fetchConnections();
  };

  return {
    connections,
    isLoading,
    error,
    refreshConnections
  };
}