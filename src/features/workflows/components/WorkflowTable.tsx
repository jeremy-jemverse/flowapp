import { WorkflowListItem } from '../services/workflow-list.service';
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
import { formatDate } from '@/lib/utils';

interface WorkflowTableProps {
  items: WorkflowListItem[];
  onEdit: (workflow: WorkflowListItem) => void;
}

export function WorkflowTable({ items, onEdit }: WorkflowTableProps) {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Nodes</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((workflow) => (
          <TableRow key={workflow.workflowId}>
            <TableCell>
              <div>
                <div className="font-medium">{workflow.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {workflow.description}
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize">{workflow.flowType}</TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={getStatusColor(workflow.flowStatus)}
              >
                {workflow.flowStatus}
              </Badge>
            </TableCell>
            <TableCell>{workflow.metadata.nodeCount || 0}</TableCell>
            <TableCell>{formatDate(workflow.metadata.createdAt)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {workflow.metadata.tags?.map((tag) => (
                  <Badge key={`${workflow.workflowId}-${tag}`} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(workflow)}
              >
                Configure
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}