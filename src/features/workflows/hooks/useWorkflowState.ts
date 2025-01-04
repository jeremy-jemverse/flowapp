import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { Node, Edge, useNodesState, useEdgesState, Connection, addEdge, NodeChange } from 'reactflow';
import { BaseNodeConfig, NodeProperties, NodeData, NodeMetadata } from '../types/workflow';
import { WorkflowNode, WorkflowData, CachedEdge, ExecutionConfig, createWorkflowNode } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { 
  workflowCache, 
  WORKFLOW_CACHE_UPDATE_EVENT, 
  workflowCacheUpdateEmitter,
} from '../utils/workflowCache';
import { BrowserEventEmitter } from '../utils/browserEventEmitter';
import { nodeDefinitions } from '../components/nodes';

export const cacheUpdateEmitter = new BrowserEventEmitter();
export const CACHE_UPDATE_EVENT = 'cacheUpdate';

export interface BaseWorkflowNode extends Node {
  type: string;
  category: string;
  data: {
    category: string;
    config: Record<string, any>;
    metadata: NodeMetadata;
    inputs: any[];
    outputs: any[];
  };
}

export function useWorkflowState(initialWorkflowId?: string) {
  const workflowId = useRef(initialWorkflowId || uuidv4()).current;
  const [nodes, setNodes, onNodesChange] = useNodesState<BaseWorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<BaseWorkflowNode | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Cache synchronization
  const syncToCache = useCallback(() => {
    console.log('[useWorkflowState][CACHE] Starting cache sync');
    
    const cached = workflowCache.get(workflowId);
    if (!cached) {
      console.log('[useWorkflowState][CACHE] No cached workflow found for:', workflowId);
      return;
    }

    console.log('[useWorkflowState][CACHE] Current cache state:', {
      workflowId,
      cached,
      nodeCount: Object.keys(cached.nodes || {}).length
    });

    // Convert nodes to cache format while maintaining WorkflowNode structure
    const cachedNodes = nodes.reduce((acc, node) => {
      const cachedNode = {
        id: node.id,
        type: node.type,
        category: node.category,
        position: node.position,
        data: {
          label: node.data.label,
          nodeType: node.data.nodeType,
          category: node.data.category,
          description: node.data.description,
          icon: node.data.icon,
          config: node.data.config,
          metadata: node.data.metadata,
          inputs: node.data.inputs,
          outputs: node.data.outputs
        },
        properties: {
          width: node.properties?.width || 200,
          height: node.properties?.height || 86,
          selected: node.properties?.selected || false,
          dragging: node.properties?.dragging || false,
          draggable: true,
          selectable: true,
          connectable: true,
          deletable: true,
          focusable: true,
          zIndex: node.properties?.zIndex || 1
        },
        x: node.position.x,
        y: node.position.y
      } as WorkflowNode<BaseNodeConfig>;

      console.log('[useWorkflowState][CACHE] Caching node:', {
        nodeId: node.id,
        original: node,
        cached: cachedNode,
        diff: {
          data: {
            previous: node.data,
            updated: cachedNode.data
          }
        }
      });

      acc[node.id] = cachedNode;
      return acc;
    }, {} as Record<string, WorkflowNode<BaseNodeConfig>>);

    const updatedCache = {
      ...cached,
      nodes: cachedNodes,
      edges,
      metadata: {
        ...cached.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    console.log('[useWorkflowState][CACHE] Setting updated cache:', {
      previous: cached,
      updated: updatedCache,
      diff: {
        nodeCount: {
          previous: Object.keys(cached.nodes || {}).length,
          updated: Object.keys(cachedNodes).length
        },
        updatedAt: {
          previous: cached.metadata?.updatedAt,
          updated: updatedCache.metadata.updatedAt
        }
      }
    });

    workflowCache.set(workflowId, updatedCache);
    workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT);
  }, [workflowId, nodes, edges]);

  // Generic node operations
  const createNode = useCallback((
    type: string,
    position: { x: number; y: number },
    initialData: Partial<BaseWorkflowNode['data']> = {}
  ): WorkflowNode<BaseNodeConfig> => {
    console.log('Creating new node:', { type, position, initialData });
    
    const now = new Date().toISOString();
    
    // Get the node definition for this type
    const nodeDefinition = nodeDefinitions[type as keyof typeof nodeDefinitions];
    if (!nodeDefinition) {
      console.error(`No node definition found for type: ${type}`);
    }
    
    // Construct the node object according to WorkflowNode interface
    const newNode: WorkflowNode<BaseNodeConfig> = {
      id: `${type}-${uuidv4()}`,
      type,
      category: type,
      position,
      data: {
        label: nodeDefinition?.label || type,
        nodeType: type,
        category: type,
        description: nodeDefinition?.description,
        icon: nodeDefinition?.icon,
        config: {
          ...nodeDefinition?.defaultData?.config,
          ...initialData.config,
        },
        metadata: {
          created: now,
          lastModified: now,
          version: '1.0.0',
          isValid: true,
          errors: [],
          ...initialData.metadata
        },
        inputs: initialData.inputs || [],
        outputs: initialData.outputs || []
      },
      properties: {
        width: 200,
        height: 86,
        selected: false,
        dragging: false,
        draggable: true,
        selectable: true,
        connectable: true,
        deletable: true,
        focusable: true,
        zIndex: 1
      },
      x: position.x,
      y: position.y
    };

    console.log('Created node structure:', newNode);
    console.log('Node data property:', newNode.data);
    
    // Validate the node structure matches BaseWorkflowNode interface
    if (!newNode.data.category) {
      console.error('Missing required category in node.data');
    }
    
    // Transform the node to match the expected Node type
    const transformedNode = {
      id: newNode.id,
      type: newNode.type,
      category: newNode.category,
      position: newNode.position,
      data: {
        label: newNode.data.label,
        nodeType: newNode.type,
        category: newNode.category,
        description: newNode.data.description,
        icon: newNode.data.icon,
        config: newNode.data.config,
        metadata: newNode.data.metadata,
        inputs: newNode.data.inputs || [],
        outputs: newNode.data.outputs || []
      },
      properties: {
        width: 200,
        height: 86,
        selected: true,
        dragging: false,
        positionAbsolute: newNode.position,
        draggable: true,
        selectable: true,
        connectable: true,
        deletable: true,
        focusable: true,
        zIndex: 1
      },
      x: newNode.position.x,
      y: newNode.position.y
    };
    
    setNodes(nds => [...nds, transformedNode as Node<BaseWorkflowNode, string | undefined>]);
    
    // Update workflow cache
    const cachedWorkflow = workflowCache.get(workflowId);
    if (cachedWorkflow) {
      if (!Array.isArray(cachedWorkflow.nodes)) {
        cachedWorkflow.nodes[newNode.id.toString()] = newNode;
      } else {
        cachedWorkflow.nodes.push(newNode);
      }
      workflowCache.set(workflowId, cachedWorkflow);
      workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { workflowId });
    }

    setHasUnsavedChanges(true);
    return newNode;
  }, [workflowId, setNodes, setHasUnsavedChanges]);

  // Add node
  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode = createNode(type, position);
    console.log('Added node:', newNode);
    setHasUnsavedChanges(true);
    syncToCache();
  }, [createNode, setNodes]);

  // Update node
  const updateNode = useCallback((
    nodeId: string,
    data: Partial<NodeData<BaseNodeConfig>>
  ) => {
    console.log('[useWorkflowState][UPDATE] Node update requested:', {
      nodeId,
      updateData: data,
      timestamp: new Date().toISOString()
    });
    
    setNodes((nodes) => {
      const oldNode = nodes.find(n => n.id === nodeId);
      console.log('[useWorkflowState][UPDATE] Found existing node:', {
        nodeId,
        oldNode,
        oldNodeData: oldNode?.data
      });

      return nodes.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
              metadata: {
                ...node.data.metadata,
                ...data.metadata,
                lastModified: new Date().toISOString()
              }
            }
          } as WorkflowNode<BaseNodeConfig>;

          console.log('[useWorkflowState][UPDATE] Node will update to:', {
            previous: node,
            updated: updatedNode,
            diff: {
              data: {
                previous: node.data,
                updated: updatedNode.data,
                changes: Object.keys(data).reduce((acc, key) => {
                  acc[key] = {
                    from: node.data[key],
                    to: data[key]
                  };
                  return acc;
                }, {} as Record<string, { from: any; to: any }>)
              }
            }
          });

          return updatedNode;
        }
        return node;
      });
    });

    setHasUnsavedChanges(true);
    
    console.log('[useWorkflowState][CACHE] Syncing to cache...');
    syncToCache();
  }, [syncToCache]);

  // Update node config
  const updateNodeConfig = useCallback((
    nodeId: string,
    config: Record<string, any>
  ) => {
    console.log('Updating node config:', nodeId, config);
    updateNode(nodeId, {
      config
    });
  }, [updateNode]);

  // Delete node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    setEdges(edges => edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    ));
    console.log('Deleted node:', nodeId);
    setHasUnsavedChanges(true);
    syncToCache();
  }, [setNodes, setEdges]);

  // Edge operations
  const onConnect = useCallback((connection: Connection) => {
    setEdges(edges => addEdge(connection, edges));
    setHasUnsavedChanges(true);
    syncToCache();
  }, [setEdges]);

  // Handle node changes including position and size
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Sync changes to cache after a small delay to batch updates
    const timeoutId = setTimeout(() => {
      syncToCache();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [onNodesChange, syncToCache]);

  // Load workflow
  const loadWorkflow = useCallback(async (workflowData: WorkflowData) => {
    const nodes = Array.isArray(workflowData.nodes) 
      ? workflowData.nodes 
      : Object.values(workflowData.nodes);
      
    const reactFlowNodes = nodes.map((node: WorkflowNode<BaseNodeConfig>) => ({
      id: node.id,
      type: node.type,
      category: node.data.category, // Add category at root level
      position: node.position,
      data: {
        type: node.type,
        category: node.data.category,
        config: node.data.config,
        metadata: node.data.metadata,
        inputs: node.data.inputs || [],
        outputs: node.data.outputs || [],
        data: node.data
      }
    }));
    setNodes(reactFlowNodes);
    // Transform CachedEdge[] to Edge[]
    const reactFlowEdges = workflowData.edges.map(edge => ({
      id: edge.id || String(Math.random()),
      source: edge.source || '',
      target: edge.target || '',
      type: edge.type,
      data: {
        metadata: edge.metadata
      }
    }));
    setEdges(reactFlowEdges);
    workflowCache.set(workflowId, workflowData);
    workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT);
    setHasUnsavedChanges(false);
  }, [setNodes, setEdges, workflowId]);

  // Initialize workflow
  const initializeWorkflow = useCallback(async () => {
    const now = new Date().toISOString();
    const initialData: WorkflowData = {
      workflowId,
      name: 'New Workflow',
      description: '',
      version: '1.0.0',
      flowType: 'workflow',
      flowStatus: 'draft',
      tenantId: '',
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        tags: [],
        nodeCount: 0
      },
      nodes: [],
      edges: [],
      execution: { 
        mode: 'sequential',
        enabled: true,
        retryPolicy: {
          maxAttempts: 3,
          initialInterval: '1s'
        }
      }
    };

    await loadWorkflow(initialData);
  }, [workflowId, loadWorkflow]);

  // Update workflow metadata
  const updateWorkflowMetadata = useCallback((updates: Partial<WorkflowData>) => {
    const cachedWorkflow = workflowCache.get(workflowId);
    if (cachedWorkflow) {
      const updatedWorkflow = {
        ...cachedWorkflow,
        ...updates,
        metadata: {
          createdAt: cachedWorkflow.metadata.createdAt,
          updatedAt: new Date().toISOString(),
          createdBy: cachedWorkflow.metadata.createdBy,
          tags: cachedWorkflow.metadata.tags,
          nodeCount: cachedWorkflow.metadata.nodeCount
        }
      };
      workflowCache.set(workflowId, updatedWorkflow);
      workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { workflowId });
      setHasUnsavedChanges(true);
    }
  }, [workflowId]);

  return {
    workflowId,
    nodes,
    edges,
    selectedNode,
    hasUnsavedChanges,
    setNodes,
    setEdges,
    setSelectedNode,
    setHasUnsavedChanges,
    onNodesChange: handleNodesChange,
    onEdgesChange,
    onConnect,
    createNode,
    addNode,
    updateNode,
    updateWorkflowMetadata,
    loadWorkflow,
    initializeWorkflow,
    syncToCache
  };
}

interface WorkflowCache {
  workflowId: string;
  name: string;
  description: string;
  version: string;
  tenantId: string;
  metadata: WorkflowData['metadata'];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  nodeCount?: number;
  nodes: { [key: string]: any };
  edges: { [key: string]: CachedEdge };
  flowType: string;
  flowStatus: "draft" | "active";
  execution: ExecutionConfig;
}