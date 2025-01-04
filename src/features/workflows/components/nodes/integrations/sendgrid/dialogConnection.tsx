import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { connectionsApi } from '@/features/connections/api';
import { ConnectionDetails } from '@/features/connections/types';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  connection_name: z.string().min(1, 'Connection name is required'),
  api_key: z.string().min(1, 'API key is required'),
  from_email: z.string().email('Valid from email is required')
});

export interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (connection: ConnectionDetails) => void;
}

export function ConnectionDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: ConnectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      connection_name: '',
      api_key: '',
      from_email: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const result = await connectionsApi.createSendGridConnection(data);
      onSuccess(result);
    } catch (error) {
      console.error('Failed to create connection:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create SendGrid Connection</DialogTitle>
          <DialogDescription id="create-sendgrid-connection-description">
            Configure your SendGrid API connection settings.
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

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input 
              type="password" 
              {...form.register('api_key')} 
            />
            {form.formState.errors.api_key && (
              <p className="text-sm text-destructive">
                {form.formState.errors.api_key.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Default From Email</Label>
            <Input 
              type="email" 
              {...form.register('from_email')} 
              placeholder="sender@yourdomain.com"
            />
            {form.formState.errors.from_email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.from_email.message}
              </p>
            )}
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