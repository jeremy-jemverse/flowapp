import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { WorkflowData } from '../types';
import { WorkflowService } from '@/lib/services/workflow.service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PublishWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowData: WorkflowData;
}

export function PublishWorkflowDialog({
  open,
  onOpenChange,
  workflowData,
}: PublishWorkflowDialogProps) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{
    success?: boolean;
    message?: string;
    response?: any;
  }>({});

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setPublishStatus({});

      console.log('Publishing workflow:', {
        workflowId: workflowData.workflowId,
        name: workflowData.name,
        nodeCount: workflowData.nodes.length
      });

      const result = await WorkflowService.publishWorkflow(workflowData);
      
      setPublishStatus({
        success: result.success,
        message: result.message,
        response: result
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Workflow published successfully',
        });
        // Keep dialog open to show success state
        setTimeout(() => onOpenChange(false), 2000);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to publish workflow:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish workflow';
      
      setPublishStatus({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col" aria-describedby="publish-workflow-description">
        <DialogHeader>
          <DialogTitle>Publish Workflow</DialogTitle>
          <DialogDescription id="publish-workflow-description">
            Review and publish your workflow. Once published, it will be available for execution.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4">
          {/* Status Message */}
          {publishStatus.message && (
            <Alert 
              variant={publishStatus.success ? 'success' : 'destructive'}
              className="mb-4"
            >
              <div className="flex items-center gap-2">
                {publishStatus.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span>{publishStatus.message}</span>
                {publishStatus.success && (
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-500">
                    Published
                  </Badge>
                )}
              </div>
            </Alert>
          )}

          {/* API Response Details */}
          {publishStatus.response && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">API Response:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(publishStatus.response, null, 2)}
              </pre>
            </div>
          )}

          <Alert className="mb-4">
            This will publish your workflow and make it available for execution.
            Please review the configuration carefully.
          </Alert>

          {/* Workflow Configuration */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Workflow Configuration:</h4>
              <div className="font-mono text-sm">
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(workflowData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing || publishStatus.success}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : publishStatus.success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Published
              </>
            ) : (
              'Confirm & Publish'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}