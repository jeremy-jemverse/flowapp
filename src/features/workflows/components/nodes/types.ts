import { Node, Connection } from 'reactflow';
import { WorkflowNode, BaseNodeConfig } from '../../types/workflow';

// Base configuration interface that all node configs must extend
export interface NodeBaseConfig {
  category: string;
  label: string;
  [key: string]: any;
}

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

export interface NodeConnection extends Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
}

// Base workflow node type that all nodes extend
export interface NodeData<TConfig extends NodeBaseConfig = NodeBaseConfig> {
  label: string;
  nodeType: string;
  category: string;
  config: TConfig;
  metadata: NodeMetadata;
  connections?: {
    inputs: NodeConnection[];
    outputs: NodeConnection[];
  };
  inputs: NodeConnection[];
  outputs: NodeConnection[];
  getConfigComponent?: () => React.ComponentType<{
    node: Node<Partial<NodeData>> & Partial<NodeProperties> & WorkflowNode<BaseNodeConfig>;
    onChange: (data: Partial<NodeData>) => void;
  }>;
  onConfigure?: () => void;
}

// React Flow specific properties
export interface NodeProperties {
  // Required dimensions since they always have default values
  width: number;  // Will default to a standard width if not provided
  height: number; // Will default to a standard height if not provided

  // State properties
  selected: boolean;
  dragging: boolean;
  
  // Optional style properties
  dragHandle?: string;
  style?: React.CSSProperties;
  className?: string;
  
  // Connection points
  sourcePosition?: 'left' | 'right' | 'top' | 'bottom';
  targetPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  // Visibility and interaction
  hidden?: boolean;
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
  deletable: boolean;
  focusable: boolean;
  
  // Position and layout
  positionAbsolute?: { x: number; y: number };
  zIndex: number;
  
  // Drag constraints
  dragLock?: boolean;
  dragLockX?: boolean;
  dragLockY?: boolean;
  dragLockZ?: boolean;
}

// Helper function to create a new workflow node
export function createWorkflowNode<TConfig extends NodeBaseConfig = NodeBaseConfig>(
  type: string,
  partial: Partial<WorkflowNode<TConfig>> = {}
): WorkflowNode<TConfig> {
  const defaultProperties: NodeProperties = {
    width: 200,  // Default width
    height: 100, // Default height
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
    category: '',
    label: '',
    data: {
      nodeType: type,
      category: '',
      label: '',
      config: {} as TConfig,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0.0',
        isValid: true,
        errors: []
      },
      connections: {
        inputs: [],
        outputs: []
      },
      inputs: [],
      outputs: []
    },
    properties: {
      ...defaultProperties,
      ...partial.properties
    },
    position: { x: 0, y: 0 },
    x: 0,
    y: 0,
    ...partial
  };
}