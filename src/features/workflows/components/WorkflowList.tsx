import { WorkflowListItem } from '../services/workflow-list.service';
import { WorkflowCard } from './WorkflowCard';
import { WorkflowTable } from './WorkflowTable';
import { CardComponent as Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface WorkflowListProps {
  items: WorkflowListItem[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  searchQuery: string;
  onEdit: (workflow: WorkflowListItem) => void;
}

export function WorkflowList({ 
  items, 
  viewMode, 
  isLoading, 
  searchQuery,
  onEdit 
}: WorkflowListProps) {
  console.log('WorkflowList: Rendering with', { 
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
        aria-label="Loading workflows"
      >
        <Loader2 
          className="h-8 w-8 animate-spin text-primary" 
          data-testid="loading-spinner"
        />
        <span className="sr-only">Loading workflows...</span>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          {searchQuery 
            ? 'No workflows found matching your search'
            : 'No workflows available. Create your first workflow to get started.'}
        </p>
      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="grid">
        {items.map((workflow) => (
          <WorkflowCard 
            key={workflow.workflowId} // Using the workflow's unique ID as key
            workflow={workflow}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <WorkflowTable 
      items={items} 
      onEdit={onEdit} 
    />
  );
}