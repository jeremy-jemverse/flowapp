import { Database } from 'lucide-react';
import { PostgresNode } from './PostgresNode';
import { PostgresNodeConfig } from './PostgresNodeConfig';

export type PostgresOperation = 'execute_query' | 'select_rows';
export type PostgresErrorAction = 'fail' | 'continue' | 'retry';

export interface PostgresNodeData {
  label: string;
  description?: string;
  operation: PostgresOperation;
  connectionId: string;
  query: string;
  options: {
    errorAction: PostgresErrorAction;
    maxRetries?: number;
    parameters?: Record<string, any>;
  };
  onConfigure?: () => void;
  nodeType: 'postgres';
  category: 'database';
  config?: Record<string, any>;
}

export interface PostgresConnection {
  id: string;
  connection_name: string;
  host_name: string;
  port: number;
  database_name: string;
  conn_user: string;
  conn_password: string;
  ssl: boolean;
}

export type PostgresNodeDefinition = {
  type: 'postgres';
  category: 'database';
  component: any;
  getConfigComponent: () => any;
  icon: any;
  label: string;
  description: string;
};

export const PostgresNodeDefinition: PostgresNodeDefinition = {
  type: 'postgres',
  category: 'database',
  component: PostgresNode,
  getConfigComponent: () => PostgresNodeConfig,
  icon: Database,
  label: 'PostgreSQL',
  description: 'Execute PostgreSQL queries and manage database operations',
};