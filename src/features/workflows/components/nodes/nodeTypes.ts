import { BaseNodeConfig } from '../../types/workflow';
import { SendGridEmailConfiguration } from './integrations/sendgrid/types';

// SendGrid node configuration
export interface SendGridNodeConfig extends SendGridEmailConfiguration {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
}

// HTTP node configuration
export interface HttpNodeConfig extends BaseNodeConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: any;
}

// Database node configuration
export interface DatabaseNodeConfig extends BaseNodeConfig {
  connectionString: string;
  query: string;
  parameters: Record<string, any>;
}

// Function node configuration
export interface FunctionNodeConfig extends BaseNodeConfig {
  code: string;
  language: 'javascript' | 'python';
  timeout?: number;
}

// Transform node configuration
export interface TransformNodeConfig extends BaseNodeConfig {
  transformation: string;
  inputFormat: string;
  outputFormat: string;
}

// Condition node configuration
export interface ConditionNodeConfig extends BaseNodeConfig {
  condition: string;
  operator: string;
  value: any;
}

// Loop node configuration
export interface LoopNodeConfig extends BaseNodeConfig {
  iterationType: 'array' | 'range' | 'condition';
  iterationConfig: {
    start?: number;
    end?: number;
    step?: number;
    array?: string;
    condition?: string;
  };
}

// Delay node configuration
export interface DelayNodeConfig extends BaseNodeConfig {
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours';
}

// Event node configuration
export interface EventNodeConfig extends BaseNodeConfig {
  eventType: string;
  eventSource: string;
  filters: Record<string, any>;
}

// Registry of node types to their configurations
export const NODE_TYPE_CONFIG_MAP = {
  sendgrid: {} as SendGridNodeConfig,
  http: {} as HttpNodeConfig,
  database: {} as DatabaseNodeConfig,
  function: {} as FunctionNodeConfig,
  transform: {} as TransformNodeConfig,
  condition: {} as ConditionNodeConfig,
  loop: {} as LoopNodeConfig,
  delay: {} as DelayNodeConfig,
  event: {} as EventNodeConfig
} as const;

// Type helper to get config type from node type
export type NodeConfigType<T extends keyof typeof NODE_TYPE_CONFIG_MAP> = 
  typeof NODE_TYPE_CONFIG_MAP[T];
