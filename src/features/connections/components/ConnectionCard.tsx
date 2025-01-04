import { ConnectionDetails } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, Settings2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ConnectionCardProps {
  connection: ConnectionDetails;
  onEdit: (connection: ConnectionDetails) => void;
}

export function ConnectionCard({ connection, onEdit }: ConnectionCardProps) {
  console.log('ConnectionCard: Rendering', connection);
  
  const Icon = getConnectionIcon(connection.connection_category);
  const status = getConnectionStatus(connection);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{connection.connection_name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {connection.connection_category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status}
            </Badge>
            {connection.last_used && (
              <span className="text-xs text-muted-foreground">
                Last used: {formatDate(connection.last_used)}
              </span>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit(connection)}
        >
          Configure
        </Button>
      </div>
    </Card>
  );
}

function getConnectionIcon(type: ConnectionDetails['connection_category']) {
  switch (type) {
    case 'api':
      return RefreshCw;
    case 'database':
      return Database;
    default:
      return Settings2;
  }
}

function getConnectionStatus(connection: ConnectionDetails) {
  // You can implement more sophisticated status logic here
  return 'connected';
}

function getStatusColor(status: string) {
  switch (status) {
    case 'connected':
      return 'bg-emerald-500/15 text-emerald-500';
    case 'disconnected':
      return 'bg-neutral-500/15 text-neutral-500';
    case 'error':
      return 'bg-red-500/15 text-red-500';
    default:
      return 'bg-neutral-500/15 text-neutral-500';
  }
}