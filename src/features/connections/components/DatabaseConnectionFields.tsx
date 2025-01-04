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
import { Database, Loader2 } from 'lucide-react';
import { ConnectionFormData, DatabaseType, databaseTypes } from '../types';
import { PostgresFields } from './database/PostgresFields';
import { SnowflakeFields } from './database/SnowflakeFields';

interface DatabaseConnectionFieldsProps {
  form: UseFormReturn<ConnectionFormData>;
  onTest: (data: any) => Promise<void>;
  isTesting: boolean;
}

export function DatabaseConnectionFields({ form, onTest, isTesting }: DatabaseConnectionFieldsProps) {
  const dbType = form.watch('db_type') as DatabaseType;

  const handleTest = async () => {
    const data = form.getValues();
    await onTest(data);
  };

  const handleDbTypeChange = (value: DatabaseType) => {
    form.setValue('db_type', value);
    // Reset database-specific fields when changing type
    form.setValue('host_name', '');
    form.setValue('port', undefined);
    form.setValue('database_name', '');
    form.setValue('conn_user', '');
    form.setValue('conn_password', '');
    form.setValue('ssl', true);
    // Reset Snowflake specific fields
    form.setValue('account', '');
    form.setValue('warehouse', '');
    form.setValue('role', '');
    form.setValue('schema', '');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Database Connection</h3>
          <p className="text-sm text-muted-foreground">Configure your database connection details</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Database Type</Label>
          <Select
            value={dbType}
            onValueChange={handleDbTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select database type" />
            </SelectTrigger>
            <SelectContent>
              {databaseTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {dbType === 'postgres' && (
          <PostgresFields form={form} />
        )}

        {dbType === 'snowflake' && (
          <SnowflakeFields form={form} />
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleTest}
            disabled={isTesting || !dbType}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </div>
      </div>
    </Card>
  );
}