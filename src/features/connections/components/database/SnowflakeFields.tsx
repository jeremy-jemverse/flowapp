import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConnectionFormData } from '../../types';

interface SnowflakeFieldsProps {
  form: UseFormReturn<ConnectionFormData>;
}

export function SnowflakeFields({ form }: SnowflakeFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Account</Label>
          <Input
            {...form.register('account')}
            placeholder="your-account.snowflakecomputing.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Warehouse</Label>
          <Input
            {...form.register('warehouse')}
            placeholder="COMPUTE_WH"
          />
        </div>

        <div className="space-y-2">
          <Label>Database</Label>
          <Input
            {...form.register('database_name')}
            placeholder="database"
          />
        </div>

        <div className="space-y-2">
          <Label>Schema</Label>
          <Input
            {...form.register('schema')}
            placeholder="public"
          />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            {...form.register('role')}
            placeholder="ACCOUNTADMIN"
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
    </div>
  );
}