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
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Database, Globe, Server, Key, Lock, Link2, Code, Loader2, Copy } from 'lucide-react';
import { ConnectionFormData } from '../types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ConnectionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ConnectionFormData;
  sqlQuery: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ConnectionConfirmationDialog({
  open,
  onOpenChange,
  data,
  sqlQuery,
  onConfirm,
  isLoading,
}: ConnectionConfirmationDialogProps) {
  const { toast } = useToast();
  const apiEndpoint = 'https://flownodes.onrender.com/api/nodes/postgres/execute-query';
  const requestPayload = {
    connectionDetails: {
      host: "eca-data-dev-aurora.cluster-c3i2wiuyixpk.eu-central-1.rds.amazonaws.com",
      port: 5432,
      database: "workflow_dev",
      user: "expert",
      password: "expertdev",
      ssl: true
    },
    query: sqlQuery
  };

  // Generate curl command
  const curlCommand = `curl -X POST '${apiEndpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(requestPayload, null, 2)}'`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} has been copied to clipboard`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Connection Details</DialogTitle>
          <DialogDescription>
            Please review the connection details, SQL query, and API configuration before saving
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 py-4">
            {/* Connection Overview */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              {data.type === 'database' ? (
                <Database className="h-8 w-8 text-primary" />
              ) : (
                <Globe className="h-8 w-8 text-primary" />
              )}
              <div>
                <h3 className="text-lg font-semibold">{data.connection_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {data.type}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {data.connection_type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">API Configuration</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(curlCommand, "Curl command")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy curl
                </Button>
              </div>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <span className="text-sm font-mono break-all">{apiEndpoint}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Curl Command:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(curlCommand, "Curl command")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={curlCommand}
                    readOnly
                    className="font-mono text-sm h-[100px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Request Payload:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(JSON.stringify(requestPayload, null, 2), "Request payload")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={JSON.stringify(requestPayload, null, 2)}
                    readOnly
                    className="font-mono text-sm h-[200px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SQL Query */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">SQL Query</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(sqlQuery, "SQL query")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={sqlQuery}
                readOnly
                className="font-mono text-sm h-[200px] resize-none"
              />
            </div>

            {/* Connection Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Connection Details</h4>
              </div>
              <div className="grid gap-4 p-4 border rounded-lg">
                {data.type === 'database' ? (
                  <>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Host:</span>
                      <span className="text-sm font-mono">{data.host_name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Port:</span>
                      <span className="text-sm font-mono">{data.port}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Database:</span>
                      <span className="text-sm font-mono">{data.database_name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Username:</span>
                      <span className="text-sm font-mono">{data.username}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">SSL Enabled:</span>
                      <span className="text-sm font-mono">{data.ssl ? 'Yes' : 'No'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Base URL:</span>
                      <span className="text-sm font-mono break-all">{data.base_url}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-sm font-medium">Auth Type:</span>
                      <span className="text-sm font-mono capitalize">{data.auth_type}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Alert>
              <p className="text-sm">
                Please verify all details before proceeding. This action will create a new connection
                in the database and the connection details will be securely stored.
              </p>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Back
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Confirm & Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}