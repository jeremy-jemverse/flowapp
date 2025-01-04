import { ConnectionDetails } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, RefreshCw, Settings2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ConnectionTableProps {
  items: ConnectionDetails[];
  onEdit: (connection: ConnectionDetails) => void;
}

export function ConnectionTable({ items, onEdit }: ConnectionTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((connection) => (
            <ConnectionTableRow 
              key={connection.id} 
              connection={connection}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

interface ConnectionTableRowProps {
  connection: ConnectionDetails;
  onEdit: (connection: ConnectionDetails) => void;
}

function ConnectionTableRow({ connection, onEdit }: ConnectionTableRowProps) {
  const Icon = getConnectionIcon(connection.connection_category);
  const status = getConnectionStatus(connection);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{connection.connection_name}</div>
            <div className="text-sm text-muted-foreground">
              {connection.connection_category}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="capitalize">{connection.connection_category}</TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      </TableCell>
      <TableCell>
        {connection.last_used
          ? formatDate(connection.last_used)
          : '-'}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={() => onEdit(connection)}>Configure</Button>
      </TableCell>
    </TableRow>
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