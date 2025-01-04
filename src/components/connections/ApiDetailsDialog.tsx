import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiDetailsDialog({ open, onOpenChange }: ApiDetailsDialogProps) {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const apiEndpoint = 'https://flownodes.onrender.com/api/nodes/postgres/execute-query';
  const connectionDetails = {
    host: "eca-data-dev-aurora.cluster-c3i2wiuyixpk.eu-central-1.rds.amazonaws.com",
    port: 5432,
    database: "workflow_dev",
    user: "expert",
    password: "expertdev",
    ssl: true
  };
  
  const query = `SELECT id, created_at, last_used, connection_name, connection_category, 
    connection_type, host_name, port, database_name, conn_user, conn_password, 
    ssl, url, api_key, api_secret, base_url, auth_type 
    FROM public.connection_details 
    ORDER BY created_at DESC;`;

  const requestPayload = {
    connectionDetails,
    query
  };

  const curlCommand = `curl -X POST '${apiEndpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(requestPayload, null, 2)}'`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} has been copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>API Details</DialogTitle>
          <DialogDescription>
            View the API endpoint, connection details, and test using curl
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 py-4">
            {/* API Endpoint */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">API Endpoint</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(apiEndpoint, 'API Endpoint')}
                >
                  {copiedField === 'API Endpoint' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <code className="text-sm">{apiEndpoint}</code>
                </div>
              </Card>
            </div>

            {/* Connection Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Connection Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(connectionDetails, null, 2), 'Connection Details')}
                >
                  {copiedField === 'Connection Details' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Card className="p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(connectionDetails, null, 2)}
                </pre>
              </Card>
            </div>

            {/* SQL Query */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">SQL Query</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(query, 'SQL Query')}
                >
                  {copiedField === 'SQL Query' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={query}
                readOnly
                className="font-mono text-sm h-[100px]"
              />
            </div>

            {/* Curl Command */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Curl Command</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(curlCommand, 'Curl Command')}
                >
                  {copiedField === 'Curl Command' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={curlCommand}
                readOnly
                className="font-mono text-sm h-[200px]"
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}