import { z } from 'zod';

export const postgresConnectionSchema = z.object({
  connection_name: z.string().min(1, 'Connection name is required'),
  host_name: z.string().min(1, 'Host is required'),
  port: z.number().min(1).max(65535),
  database_name: z.string().min(1, 'Database name is required'),
  conn_user: z.string().min(1, 'Username is required'),
  conn_password: z.string().min(1, 'Password is required'),
  ssl: z.boolean().default(true)
});

export const postgresNodeSchema = z.object({
  label: z.string().min(1, 'Node label is required'),
  description: z.string().optional(),
  operation: z.enum(['execute_query', 'select_rows']),
  connectionId: z.string().min(1, 'Connection is required'),
  query: z.string().min(1, 'Query is required'),
  options: z.object({
    errorAction: z.enum(['fail', 'continue', 'retry']),
    maxRetries: z.number().optional(),
    parameters: z.record(z.any()).optional()
  })
});

export type PostgresConnectionFormData = z.infer<typeof postgresConnectionSchema>;
export type PostgresNodeFormData = z.infer<typeof postgresNodeSchema>;