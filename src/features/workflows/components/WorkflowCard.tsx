import { WorkflowListItem } from '../services/workflow-list.service';
import { CardComponent as Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Workflow as WorkflowIcon, 
  Clock, 
  Tag, 
  ListChecks 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WorkflowCardProps {
  workflow: WorkflowListItem;
  onEdit: (workflow: WorkflowListItem) => void;
}

export function WorkflowCard({ workflow, onEdit }: WorkflowCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/15 text-emerald-500';
      case 'draft':
        return 'bg-amber-500/15 text-amber-500';
      default:
        return 'bg-neutral-500/15 text-neutral-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <WorkflowIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {workflow.flowType}
                </p>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor(workflow.flowStatus)}
          >
            {workflow.flowStatus}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {workflow.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(workflow.metadata.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            <span>{workflow.metadata.nodeCount} nodes</span>
          </div>
        </div>

        {workflow.metadata.tags?.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {workflow.metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(workflow)}
          >
            Configure
          </Button>
        </div>
      </div>
    </Card>
  );
}