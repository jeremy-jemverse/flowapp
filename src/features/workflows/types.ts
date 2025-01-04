import { WorkflowNode } from './types/workflow';

// Update the WorkflowData interface to include flow_status
export interface EdgeConfig {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: object;
  data?: Record<string, any>;
}

export type { WorkflowData, ExecutionConfig, WorkflowNode, BaseNodeConfig } from './types/workflow';

export type WorkflowNodeType = WorkflowNode;