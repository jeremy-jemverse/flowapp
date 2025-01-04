import { useEffect, useState } from 'react';
import { WorkflowListItem, WorkflowListService } from '../services/workflow-list.service';
import { useToast } from '@/hooks/use-toast';

export function useWorkflowList() {
  const { toast } = useToast();
  const [items, setItems] = useState<WorkflowListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const workflows = await WorkflowListService.getAll();
      setItems(workflows);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch workflows';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return {
    items,
    isLoading,
    error,
    refresh: fetchWorkflows
  };
}