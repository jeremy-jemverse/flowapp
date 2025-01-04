import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatabaseConfig, testDatabaseConnection, DEFAULT_DB_CONFIG } from '@/lib/api/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';

export function DatabaseConnectionForm() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<DatabaseConfig>({
    defaultValues: DEFAULT_DB_CONFIG
  });

  const onSubmit = async (data: DatabaseConfig) => {
    setTesting(true);
    setTestResult(null);
    
    try {
      await testDatabaseConnection(data);
      setTestResult({ success: true, message: 'Successfully connected to database!' });
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to connect to database. Please check your credentials.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Database Connection</h3>
          <p className="text-sm text-muted-foreground">Configure your PostgreSQL database connection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              {...register('host', { required: 'Host is required' })}
              error={errors.host?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              {...register('port', { required: 'Port is required' })}
              error={errors.port?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input
              id="database"
              {...register('database', { required: 'Database name is required' })}
              error={errors.database?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Username</Label>
            <Input
              id="user"
              {...register('user', { required: 'Username is required' })}
              error={errors.user?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
          </div>
        </div>

        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'error'}>
            {testResult.message}
          </Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={testing}>
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
          <Button type="button" variant="outline">
            Save Configuration
          </Button>
        </div>
      </form>
    </Card>
  );
}