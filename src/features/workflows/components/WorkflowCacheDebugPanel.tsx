import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { workflowCache, workflowCacheUpdateEmitter, WORKFLOW_CACHE_UPDATE_EVENT } from '../utils/workflowCache';

export function WorkflowCacheDebugPanel() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [cacheEntries, setCacheEntries] = useState<[string, any][]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update cache entries whenever there's a cache update
  useEffect(() => {
    const updateCache = () => {
      const entries: [string, any][] = Array.from(workflowCache.entries()).map(([key, value]) => {
        // Enforce the order as per WorkflowCache interface
        const orderedValue = {
          workflowId: value.workflowId,
          tenantId: value.tenantId,
          name: value.name,
          version: value.version,
          flowType: value.flowType,
          flowStatus: value.flowStatus,
          description: value.description,
          metadata: value.metadata,
          nodes: value.nodes,
          edges: value.edges,
          execution: value.execution
        };
        return [key, orderedValue] as [string, any];
      });
      setCacheEntries(entries);
      setLastUpdate(new Date());
    };

    // Initial update
    updateCache();

    // Listen for cache updates
    workflowCacheUpdateEmitter.on(WORKFLOW_CACHE_UPDATE_EVENT, updateCache);

    return () => {
      workflowCacheUpdateEmitter.off(WORKFLOW_CACHE_UPDATE_EVENT, updateCache);
    };
  }, []);

  const getNodeCount = (entry: any) => {
    return Object.keys(entry?.nodes || {}).length;
  };

  const getEdgeCount = (entry: any) => {
    return Object.keys(entry?.edges || {}).length;
  };

  return (
    <Card className="mt-4" data-testid="workflow-cache-debug-panel">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Workflow Cache</h3>
          <Badge variant="outline">Last Update: {lastUpdate.toLocaleTimeString()}</Badge>
        </div>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nodes</TableHead>
                <TableHead>Edges</TableHead>
                <TableHead>Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cacheEntries.map(([id, entry]) => (
                <TableRow
                  key={id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedWorkflowId(id)}
                >
                  <TableCell className="font-mono text-xs">{id}</TableCell>
                  <TableCell>{entry?.name || 'Untitled'}</TableCell>
                  <TableCell>
                    <Badge variant={entry.flowStatus === 'active' ? 'default' : 'secondary'}>
                      {entry.flowStatus || 'draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getNodeCount(entry)}</TableCell>
                  <TableCell>{getEdgeCount(entry)}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(entry.metadata?.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedWorkflowId} onOpenChange={() => setSelectedWorkflowId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Cache Details</DialogTitle>
            <DialogDescription>
              Detailed view of the workflow cache entry
            </DialogDescription>
          </DialogHeader>
          {selectedWorkflowId && (
            <div className="mt-4">
              <pre className="p-4 rounded bg-muted text-xs overflow-auto">
                {JSON.stringify(workflowCache.get(selectedWorkflowId), null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
