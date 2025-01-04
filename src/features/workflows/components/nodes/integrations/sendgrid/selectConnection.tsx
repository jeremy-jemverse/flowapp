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

export interface ConnectionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConnectionSelector({ value, onChange }: ConnectionSelectorProps) {
  const [connections, setConnections] = useState<ConnectionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await connectionsApi.getSendGridConnections();
        setConnections(data);
      } catch (err) {
        setError('Failed to load SendGrid connections');
        console.error('Failed to load SendGrid connections:', err);
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
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Loading connections...' : 'Select a SendGrid connection'} />
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