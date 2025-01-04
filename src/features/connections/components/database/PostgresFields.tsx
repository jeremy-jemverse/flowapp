import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ConnectionFormData } from '../../types';

interface PostgresFieldsProps {
  form: UseFormReturn<ConnectionFormData>;
}

export function PostgresFields({ form }: PostgresFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Host</Label>
          <Input
            {...form.register('host_name')}
            placeholder="localhost"
          />
        </div>

        <div className="space-y-2">
          <Label>Port</Label>
          <Input
            type="number"
            {...form.register('port')}
            placeholder="5432"
          />
        </div>

        <div className="space-y-2">
          <Label>Database Name</Label>
          <Input
            {...form.register('database_name')}
            placeholder="database"
          />
        </div>

        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            {...form.register('conn_user')}
            placeholder="username"
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            {...form.register('conn_password')}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={form.watch('ssl')}
          onCheckedChange={(checked) => form.setValue('ssl', checked)}
        />
        <Label>Enable SSL</Label>
      </div>
    </div>
  );
}