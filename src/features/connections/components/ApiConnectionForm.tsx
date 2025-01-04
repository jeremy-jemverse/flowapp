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
import { Globe, Loader2 } from 'lucide-react';
import { ConnectionFormData } from '../types';

const apiSchema = z.object({
  base_url: z.string().url('Please enter a valid URL'),
  auth_type: z.enum(['bearer', 'basic', 'apiKey']),
  api_key: z.string().optional(),
  api_secret: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

interface ApiConnectionFormProps {
  defaultValues?: Partial<ConnectionFormData>;
  onTest: (data: any) => Promise<void>;
  isTesting: boolean;
}

export function ApiConnectionForm({ defaultValues, onTest, isTesting }: ApiConnectionFormProps) {
  const form = useForm({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      auth_type: 'bearer',
      ...defaultValues,
    },
  });

  const authType = form.watch('auth_type');

  const handleTest = async () => {
    const data = form.getValues();
    await onTest(data);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">API Connection</h3>
          <p className="text-sm text-muted-foreground">Configure your API connection details</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input 
              {...form.register('base_url')} 
              placeholder="https://api.example.com"
              error={form.formState.errors.base_url?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>Authentication Type</Label>
            <Select
              value={form.watch('auth_type')}
              onValueChange={(value: 'bearer' | 'basic' | 'apiKey') =>
                form.setValue('auth_type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {authType === 'bearer' && (
          <div className="space-y-2">
            <Label>Bearer Token</Label>
            <Input 
              {...form.register('api_key')} 
              type="password"
              error={form.formState.errors.api_key?.message}
            />
          </div>
        )}

        {authType === 'basic' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                {...form.register('username')}
                error={form.formState.errors.username?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                {...form.register('password')}
                error={form.formState.errors.password?.message}
              />
            </div>
          </div>
        )}

        {authType === 'apiKey' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input 
                {...form.register('api_key')}
                error={form.formState.errors.api_key?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>API Secret</Label>
              <Input 
                type="password" 
                {...form.register('api_secret')}
                error={form.formState.errors.api_secret?.message}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </div>
      </div>
    </Card>
  );
}