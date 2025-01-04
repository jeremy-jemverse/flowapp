import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { connectionsApi } from '@/features/connections/api';
import { Loader2 } from 'lucide-react';
import { postgresConnectionSchema, PostgresConnectionFormData } from './validation/schema';

interface CreateConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (connectionId: string) => void;
}

export function CreateConnectionDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: CreateConnectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PostgresConnectionFormData>({
    resolver: zodResolver(postgresConnectionSchema),
    defaultValues: {
      connection_name: '',
      host_name: '',
      port: 5432,
      database_name: '',
      conn_user: '',
      conn_password: '',
      ssl: true
    }
  });

  const onSubmit = async (data: PostgresConnectionFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create connection details JSON
      const connDetails = {
        host: data.host_name,
        port: data.port,
        database: data.database_name,
        user: data.conn_user,
        password: data.conn_password,
        ssl: data.ssl,
        type: 'postgres',
        options: {
          maxConnections: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000
        }
      };

      const result = await connectionsApi.create({
        ...data,
        connection_category: 'database',
        connection_type: 'host',
        db_type: 'postgres',
        conn_details: connDetails
      });
      
      onSuccess(result.id);
    } catch (error) {
      console.error('Failed to create connection:', error);
      // Handle error display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create PostgreSQL Connection</DialogTitle>
          <DialogDescription id="create-postgres-connection-description">
            Configure your PostgreSQL database connection settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Connection Name</Label>
            <Input {...form.register('connection_name')} />
            {form.formState.errors.connection_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.connection_name.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Host</Label>
              <Input {...form.register('host_name')} />
              {form.formState.errors.host_name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.host_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Port</Label>
              <Input 
                type="number" 
                {...form.register('port', { valueAsNumber: true })} 
              />
              {form.formState.errors.port && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.port.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Database Name</Label>
            <Input {...form.register('database_name')} />
            {form.formState.errors.database_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.database_name.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input {...form.register('conn_user')} />
              {form.formState.errors.conn_user && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.conn_user.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                {...form.register('conn_password')} 
              />
              {form.formState.errors.conn_password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.conn_password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch('ssl')}
              onCheckedChange={(checked) => form.setValue('ssl', checked)}
            />
            <Label>Enable SSL</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}