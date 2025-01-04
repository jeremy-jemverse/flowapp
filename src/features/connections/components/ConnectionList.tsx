import { ConnectionDetails } from '../types';
import { ConnectionCard } from './ConnectionCard';
import { ConnectionTable } from './ConnectionTable';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ConnectionListProps {
  items: ConnectionDetails[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  searchQuery: string;
  onEdit: (connection: ConnectionDetails) => void;
}

export function ConnectionList({ 
  items, 
  viewMode, 
  isLoading, 
  searchQuery,
  onEdit 
}: ConnectionListProps) {
  console.log('ConnectionList: Rendering with', { 
    itemsCount: items?.length,
    viewMode,
    isLoading,
    searchQuery
  });

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-64" 
        role="status" 
        aria-label="Loading connections"
      >
        <Loader2 
          className="h-8 w-8 animate-spin text-primary" 
          data-testid="loading-spinner"
        />
        <span className="sr-only">Loading connections...</span>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          {searchQuery 
            ? 'No connections found matching your search'
            : 'No connections available. Create your first connection to get started.'}
        </p>
      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div role="grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <ConnectionTable items={items} onEdit={onEdit} />
  );
}