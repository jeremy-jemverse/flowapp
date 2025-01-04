import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { connectionsApi } from '@/features/connections/api';
import { ConnectionDetails } from '@/features/connections/types';
import { PostgresConnection } from './types';

interface PostgresConnectionSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PostgresConnectionSelect({ value, onChange, className }: PostgresConnectionSelectProps) {
  const [connections, setConnections] = useState<ConnectionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await connectionsApi.getPostgresConnections();
        // Filter out any connections that don't have required fields
        const validConnections = data.filter((conn): conn is ConnectionDetails => {
          return typeof conn.host_name === 'string' &&
                 typeof conn.connection_name === 'string' &&
                 typeof conn.id === 'string' &&
                 typeof conn.created_at === 'string' &&
                 typeof conn.connection_category === 'string' &&
                 typeof conn.connection_type === 'string';
        });
        setConnections(validConnections);
      } catch (err) {
        setError('Failed to load PostgreSQL connections');
        console.error('Failed to load PostgreSQL connections:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className} disabled={isLoading}>
        <SelectValue placeholder={isLoading ? 'Loading connections...' : 'Select a PostgreSQL connection'} />
      </SelectTrigger>
      <SelectContent>
        {connections.map((conn) => (
          <SelectItem key={conn.id} value={conn.id}>
            {conn.connection_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}