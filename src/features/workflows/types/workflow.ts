import { Node, Edge, Connection } from 'reactflow';

// Edge configuration types
export interface EdgeMetadata {
  created: string;
  lastModified: string;
  version: string;
  isValid: boolean;
  errors: string[];
  lastValidated?: string;
  lastTested?: string;
  testStatus?: 'success' | 'failure';
}

export interface EdgeConfig {
  label?: string;
  type?: 'default' | 'step' | 'success' | 'failure' | 'custom';
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  };
  metadata?: EdgeMetadata;
  condition?: {
    type: 'expression' | 'script';
    value: string;
  };
  transform?: {
    type: 'map' | 'filter' | 'custom';
    script?: string;
    mapping?: Record<string, string>;
  };
}

export interface WorkflowEdge extends Edge {
  label?: string;
  config?: EdgeConfig;
  metadata?: EdgeMetadata;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  };
}

// Base configuration interface that all node configs must extend
export interface BaseNodeConfig {
  category: string;
  label: string;
  [key: string]: any;
}

// Node input/output types
export interface NodeInput {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  default?: any;
}

export interface NodeOutput {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

// Node metadata
export interface NodeMetadata {
  created: string;
  lastModified: string;
  version: string;
  isValid: boolean;
  errors: string[];
  lastValidated?: string;
  lastTested?: string;
  testStatus?: 'success' | 'failure';
}

// Node connection type
export interface NodeConnection extends Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
}

// Node properties (React Flow specific)
export interface NodeProperties {
  width?: number;
  height: number;
  selected: boolean;
  dragging: boolean;
  dragHandle?: string;
  style?: React.CSSProperties;
  className?: string;
  sourcePosition?: 'left' | 'right' | 'top' | 'bottom';
  targetPosition?: 'left' | 'right' | 'top' | 'bottom';
  hidden?: boolean;
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
  deletable: boolean;
  focusable: boolean;
  positionAbsolute?: { x: number; y: number };
  zIndex: number;
  dragLock?: boolean;
  dragLockX?: boolean;
  dragLockY?: boolean;
  dragLockZ?: boolean;
}

// Base node data type
export interface NodeData<TConfig = any> {
  label: string;
  nodeType: string;
  category: string;
  description?: string;
  icon?: any;  // ElementType from React
  config: TConfig;
  metadata: NodeMetadata;
  connections?: {
    inputs: NodeConnection[];
    outputs: NodeConnection[];
  };
  inputs: NodeConnection[];
  outputs: NodeConnection[];
  onConfigure?: () => void;
}

// Workflow node type that extends React Flow Node
export interface WorkflowNode<TConfig = BaseNodeConfig> extends Node {
  id: string;
  category: string;
  type: string;
  description?: string;
  icon?: string;
  position: { x: number; y: number };
  data: NodeData<TConfig>;
  properties: NodeProperties;
  x: number;  // Required for React Flow positioning
  y: number;  // Required for React Flow positioning
}

// Edge type with modification tracking
export interface CachedEdge {
  id?: string;
  source?: string;
  target?: string;
  type?: string;
  lastModified: string;
  metadata?: EdgeMetadata;
}

// Execution configuration
export interface ExecutionConfig {
  mode?: 'sequential' | 'parallel';
  schedule?: string;
  timeout?: number;
  concurrency?: number;
  environment?: Record<string, string>;
  enabled?: boolean;
  retryPolicy?: {
    maxAttempts: number;
    initialInterval: string;
  };
}

// Complete workflow data type
export interface WorkflowData {
  workflowId: string;
  tenantId?: string;
  name: string;
  version: string;
  flowType: string;
  flowStatus: 'draft' | 'active';
  description: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    nodeCount?: number;
  };
  nodes: WorkflowNode<BaseNodeConfig>[] | { [key: string]: WorkflowNode<BaseNodeConfig> };
  edges: CachedEdge[];
  execution: ExecutionConfig;
}

// Workflow list item type (for listing workflows)
export interface WorkflowListItem {
  workflowId: string;
  tenantId?: string;
  name: string;
  version: string;
  description: string;
  flowType?: string;
  flowStatus?: 'draft' | 'active';
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    nodeCount?: number;
  };
  schema?: string | object;
}

// Response type for saving workflows
export interface SaveWorkflowResponse {
  id: string;
  workflowId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Workflow cache type
export interface WorkflowCache {
  workflowId: string;
  tenantId?: string;
  name: string;
  version: string;
  flowType: string;
  flowStatus: 'draft' | 'active';
  description: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    nodeCount?: number;
  };
  nodes: {
    [key: string]: WorkflowNode
  };
  edges: { [key: string]: CachedEdge };
  execution: ExecutionConfig;
}

// Helper function to create a new workflow node with default values
export function createWorkflowNode<TConfig = any>(
  type: string,
  partial: Partial<WorkflowNode<TConfig>> = {}
): WorkflowNode<TConfig> {
  const defaultProperties: NodeProperties = {
    width: 200,
    height: 100,
    selected: false,
    dragging: false,
    draggable: true,
    selectable: true,
    connectable: true,
    deletable: true,
    focusable: true,
    zIndex: 1
  };

  return {
    id: crypto.randomUUID(),
    type,
    category: partial.category || '',
    description: partial.description,
    icon: partial.icon,
    position: partial.position || { x: 0, y: 0 },
    x: partial.x || 0,
    y: partial.y || 0,
    properties: {
      ...defaultProperties,
      ...partial.properties
    },
    data: {
      nodeType: type,
      category: partial.category || '',
      label: partial.data?.label || '',
      description: partial.description,
      icon: partial.icon,
      config: (partial.data?.config || {}) as TConfig,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0.0',
        isValid: true,
        errors: [],
        ...partial.data?.metadata
      },
      connections: {
        inputs: [],
        outputs: [],
        ...partial.data?.connections
      },
      inputs: partial.data?.inputs || [],
      outputs: partial.data?.outputs || [],
      onConfigure: partial.data?.onConfigure
    }
  };
}
