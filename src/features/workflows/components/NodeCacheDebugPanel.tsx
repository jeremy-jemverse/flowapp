import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardComponent as Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { workflowCache as nodeConfigCache } from "../utils/workflowCache";
import { cacheUpdateEmitter, CACHE_UPDATE_EVENT } from '../hooks/useWorkflowState';

export function NodeCacheDebugPanel() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [cacheEntries, setCacheEntries] = useState<[string, any][]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update cache entries whenever there's a cache update
  useEffect(() => {
    const updateCache = () => {
      const entries = Array.from(nodeConfigCache.entries());
      setCacheEntries(entries);
      setLastUpdate(new Date());
    };

    // Initial update
    updateCache();

    // Listen for cache updates
    cacheUpdateEmitter.on(CACHE_UPDATE_EVENT, updateCache);

    return () => {
      cacheUpdateEmitter.off(CACHE_UPDATE_EVENT, updateCache);
    };
  }, []);

  const getValidationStatus = (entry: any) => {
    if (!entry?.data?.metadata) {
      return <Badge variant="secondary">Unknown</Badge>;
    }
    if (entry.data.metadata.isValid) {
      return <Badge variant="default" className="bg-emerald-500/15 text-emerald-500">Valid</Badge>;
    }
    return <Badge variant="destructive">Invalid</Badge>;
  };

  return (
    <Card className="mt-4" data-testid="node-cache-debug-panel">
      <div className="p-4 border-b" data-testid="node-cache-debug-panel-header">
        <h3 className="text-lg font-semibold" data-testid="node-cache-debug-panel-title">Node Cache Debug Panel</h3>
        <p className="text-sm text-muted-foreground" data-testid="node-cache-debug-panel-last-updated">
          Last Updated: {lastUpdate.toLocaleString()}
        </p>
      </div>
      <ScrollArea className="h-[300px]" data-testid="node-cache-debug-panel-scroll-area">
        <Table data-testid="node-cache-debug-panel-table">
          <TableHeader>
            <TableRow key="header" data-testid="node-cache-debug-panel-table-header">
              <TableHead data-testid="node-cache-debug-panel-table-header-node-id">Node ID</TableHead>
              <TableHead data-testid="node-cache-debug-panel-table-header-type">Type</TableHead>
              <TableHead data-testid="node-cache-debug-panel-table-header-label">Label</TableHead>
              <TableHead data-testid="node-cache-debug-panel-table-header-status">Status</TableHead>
              <TableHead data-testid="node-cache-debug-panel-table-header-last-modified">Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-testid="node-cache-debug-panel-table-body">
            {cacheEntries.map(([id, entry]) => (
              <TableRow key={`row-${id}`} onClick={() => setSelectedNodeId(id)} className="cursor-pointer" data-testid={`node-cache-debug-panel-table-row-${id}`}>
                <TableCell className="font-mono" data-testid={`node-cache-debug-panel-table-cell-node-id-${id}`}>{id}</TableCell>
                <TableCell data-testid={`node-cache-debug-panel-table-cell-type-${id}`}>{entry.type}</TableCell>
                <TableCell data-testid={`node-cache-debug-panel-table-cell-label-${id}`}>{entry.data?.label || 'Untitled'}</TableCell>
                <TableCell data-testid={`node-cache-debug-panel-table-cell-status-${id}`}>
                  {getValidationStatus(entry)}
                </TableCell>
                <TableCell data-testid={`node-cache-debug-panel-table-cell-last-modified-${id}`}>
                  {entry.data?.metadata?.lastModified 
                    ? new Date(entry.data.metadata.lastModified).toLocaleString() 
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
            {cacheEntries.length === 0 && (
              <TableRow key="empty-state" data-testid="node-cache-debug-panel-table-empty-state">
                <TableCell colSpan={5} className="text-center text-muted-foreground" data-testid="node-cache-debug-panel-table-empty-state-cell">
                  No cached nodes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={!!selectedNodeId} onOpenChange={() => setSelectedNodeId(null)} data-testid="node-cache-debug-panel-dialog">
        <DialogContent className="max-w-3xl" data-testid="node-cache-debug-panel-dialog-content">
          <DialogHeader data-testid="node-cache-debug-panel-dialog-header">
            <DialogTitle data-testid="node-cache-debug-panel-dialog-title">
              Node Cache Schema - {selectedNodeId}
              {selectedNodeId && (
                <span key={`status-${selectedNodeId}`} data-testid={`node-cache-debug-panel-dialog-title-status-${selectedNodeId}`}>
                  {' '}
                  {getValidationStatus(nodeConfigCache.get(selectedNodeId))}
                </span>
              )}
            </DialogTitle>
            <DialogDescription id="node-cache-debug-description">
              View and debug the current state of the node cache.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]" data-testid="node-cache-debug-panel-dialog-scroll-area">
            {selectedNodeId && (
              <>
                {(() => {
                  const nodeData = nodeConfigCache.get(selectedNodeId);
                  // Safely access metadata and errors with a default empty array
                  const errors = (nodeData?.metadata as any)?.errors || [];
                  
                  return (
                    <>
                      {errors.length > 0 && (
                        <div className="mb-4 p-4 bg-destructive/10 rounded-md" data-testid={`node-cache-debug-panel-dialog-errors-${selectedNodeId}`}>
                          <h4 className="font-semibold text-destructive mb-2" data-testid={`node-cache-debug-panel-dialog-errors-title-${selectedNodeId}`}>Validation Errors:</h4>
                          <ul className="list-disc list-inside text-sm text-destructive" data-testid={`node-cache-debug-panel-dialog-errors-list-${selectedNodeId}`}>
                            {errors.map((error: string, index: number) => (
                              <li key={`error-${selectedNodeId}-${index}`} data-testid={`node-cache-debug-panel-dialog-error-${selectedNodeId}-${index}`}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <pre className="p-4 bg-muted rounded-md font-mono text-sm" data-testid={`node-cache-debug-panel-dialog-schema-${selectedNodeId}`}>
                        {JSON.stringify(nodeData, null, 2)}
                      </pre>
                    </>
                  );
                })()}
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
