import { UseFormReturn } from 'react-hook-form';
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

interface ApiConnectionFieldsProps {
  form: UseFormReturn<ConnectionFormData>;
  onTest: (data: any) => Promise<void>;
  isTesting: boolean;
}

export function ApiConnectionFields({ form, onTest, isTesting }: ApiConnectionFieldsProps) {
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
              placeholder="Enter your bearer token"
            />
          </div>
        )}

        {authType === 'basic' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                {...form.register('username')}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                {...form.register('password')}
                placeholder="Enter password"
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
                placeholder="Enter API key"
              />
            </div>
            <div className="space-y-2">
              <Label>API Secret</Label>
              <Input 
                type="password" 
                {...form.register('api_secret')}
                placeholder="Enter API secret"
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