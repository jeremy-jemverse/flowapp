import { z } from 'zod';

export type DatabaseType = 'postgres' | 'snowflake';
export type ConnectionCategory = 'database' | 'api';
export type AuthType = 'bearer' | 'basic' | 'apiKey';

export interface ConnectionDetails {
  id: string;
  created_at: string;
  last_used: string | null;
  connection_name: string;
  connection_category: ConnectionCategory;
  connection_type: string;
  // Database fields
  db_type?: DatabaseType;
  host_name?: string;
  port?: number;
  database_name?: string;
  conn_user?: string;
  conn_password?: string;
  ssl?: boolean;
  // Snowflake specific
  account?: string;
  warehouse?: string;
  role?: string;
  schema?: string;
  // API fields
  url?: string;
  api_key?: string;
  api_secret?: string;
  base_url?: string;
  auth_type?: AuthType;
  conn_details?: Record<string, any>;
}

export type ConnectionFormData = Omit<ConnectionDetails, 'id' | 'created_at' | 'last_used'>;

export type FormMode = 'insert' | 'edit';

export interface ConnectionFormProps {
  mode?: FormMode;
  initialData?: Partial<ConnectionFormData>;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  isLoading?: boolean;
}

export const databaseTypes: { value: DatabaseType; label: string }[] = [
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'snowflake', label: 'Snowflake' }
];