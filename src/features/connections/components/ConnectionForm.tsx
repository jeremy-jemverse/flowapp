import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ConnectionFormData, FormMode } from '../types';
import { DatabaseConnectionFields } from './DatabaseConnectionFields';
import { ApiConnectionFields } from './ApiConnectionFields';
import { ConnectionTestService } from '../services/connection-test.service';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  connection_name: z.string().min(1, 'Connection name is required'),
  connection_category: z.enum(['database', 'api']),
  connection_type: z.string().min(1, 'Connection type is required'),
  // Database fields
  db_type: z.enum(['postgres', 'snowflake']).optional(),
  host_name: z.string().optional(),
  port: z.number().optional(),
  database_name: z.string().optional(),
  conn_user: z.string().optional(),
  conn_password: z.string().optional(),
  ssl: z.boolean().optional(),
  // Snowflake specific
  account: z.string().optional(),
  warehouse: z.string().optional(),
  role: z.string().optional(),
  schema: z.string().optional(),
  // API fields
  base_url: z.string().url().optional(),
  auth_type: z.enum(['bearer', 'basic', 'apiKey']).optional(),
  api_key: z.string().optional(),
  api_secret: z.string().optional(),
});

interface ConnectionFormProps {
  mode?: FormMode;
  initialData?: Partial<ConnectionFormData>;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ConnectionForm({ 
  mode = 'insert', 
  initialData, 
  onSubmit,
  isLoading 
}: ConnectionFormProps) {
  const { toast } = useToast();
  const [testingConnection, setTestingConnection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ConnectionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      connection_name: '',
      connection_category: 'database',
      connection_type: 'host',
      ssl: true,
      ...initialData
    }
  });

  const connectionCategory = form.watch('connection_category');

  const handleTestConnection = async (data: ConnectionFormData) => {
    try {
      setTestingConnection(true);
      setError(null);
      
      console.log('ConnectionForm.handleTestConnection: Starting with data:', {
        ...data,
        conn_password: '***' // Hide sensitive data in logs
      });
      
      const result = await ConnectionTestService.testConnection(data);
      
      if (result.success) {
        toast({
          title: 'Connection Test Successful',
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
      toast({
        title: 'Connection Test Failed',
        description: 'Failed to test connection. Please check your settings.',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (data: ConnectionFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('ConnectionForm.handleSubmit: Error:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save connection',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Connection Name</Label>
            <Input
              {...form.register('connection_name')}
              placeholder="Enter connection name"
              error={form.formState.errors.connection_name?.message}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Connection Category</Label>
              <Select
                value={form.watch('connection_category')}
                onValueChange={(value: 'database' | 'api') => {
                  form.setValue('connection_category', value);
                  // Reset category-specific fields
                  if (value === 'database') {
                    form.setValue('base_url', undefined);
                    form.setValue('auth_type', undefined);
                    form.setValue('api_key', undefined);
                    form.setValue('api_secret', undefined);
                  } else {
                    form.setValue('host_name', undefined);
                    form.setValue('port', undefined);
                    form.setValue('database_name', undefined);
                    form.setValue('conn_user', undefined);
                    form.setValue('conn_password', undefined);
                    form.setValue('ssl', undefined);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connection Type</Label>
              <Select
                value={form.watch('connection_type')}
                onValueChange={(value) => form.setValue('connection_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {connectionCategory === 'database' ? (
                    <>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="rest">REST</SelectItem>
                      <SelectItem value="graphql">GraphQL</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {connectionCategory === 'database' ? (
        <DatabaseConnectionFields
          form={form}
          onTest={handleTestConnection}
          isTesting={testingConnection}
        />
      ) : (
        <ApiConnectionFields
          form={form}
          onTest={handleTestConnection}
          isTesting={testingConnection}
        />
      )}

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'insert' ? 'Create Connection' : 'Update Connection'}
        </Button>
      </div>
    </form>
  );
}