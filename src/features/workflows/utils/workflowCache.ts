import { BrowserEventEmitter } from './browserEventEmitter';
import { WorkflowData } from '../types/workflow';

// Main workflow cache
export const workflowCacheUpdateEmitter = new BrowserEventEmitter();

// Main workflow cache
export const WORKFLOW_CACHE_UPDATE_EVENT = 'workflowCacheUpdate';
export const workflowCache = new Map<string, WorkflowData>();

// Node cache is now integrated into the workflow cache
// Key format: `${workflowId}:node:${nodeId}`
const getNodeCacheKey = (workflowId: string, nodeId: string) => `${workflowId}:node:${nodeId}`;

export function initializeWorkflowCache(workflowId: string) {
  console.log('[workflowCache] Initializing workflow cache', workflowId, workflowCache.has(workflowId));
  if (!workflowCache.has(workflowId)) {
    const now = new Date().toISOString();
    const defaultData: WorkflowData = {
      workflowId,
      tenantId: '',
      name: 'New Workflow',
      version: '1.0.0',
      flowType: 'workflow',
      flowStatus: 'draft',
      description: '',
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
    console.log('[workflowCache] Setting default data', defaultData);
    workflowCache.set(workflowId, defaultData);
    workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT);
  }
  return workflowCache.get(workflowId);
}

export function getWorkflowFromCache(workflowId: string): WorkflowData | undefined {
  return workflowCache.get(workflowId);
}

// Node-specific cache operations
export function getNodeFromCache(workflowId: string, nodeId: string): any {
  const workflow = workflowCache.get(workflowId);
  if (!workflow) return undefined;
  
  const nodeKey = getNodeCacheKey(workflowId, nodeId);
  const nodeData = (workflow as any)[nodeKey];
  return nodeData;
}

export function updateNodeCache(workflowId: string, nodeId: string, data: any): void {
  const workflow = workflowCache.get(workflowId);
  if (!workflow) return;

  const nodeKey = getNodeCacheKey(workflowId, nodeId);
  const updatedWorkflow = {
    ...workflow,
    [nodeKey]: data,
    metadata: {
      ...workflow.metadata,
      updatedAt: new Date().toISOString()
    }
  };
  
  workflowCache.set(workflowId, updatedWorkflow);
  workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { 
    workflowId, 
    nodeId,
    data: updatedWorkflow 
  });
}

// Normalize node data to ensure correct structure and types
function normalizeNodeData(node: any): any {
  if (!node) return node;

  // Handle nested data structure
  if (node.data?.data) {
    const innerData = node.data.data;
    node = {
      ...node,
      data: {
        ...node.data,
        ...innerData,
        nodeType: node.type || innerData.type || '', // Ensure nodeType matches the node type
      }
    };
    delete node.data.data; // Remove nested data
  }

  // Ensure nodeType is set correctly for known node types
  if (node.type === 'sendgrid' && (!node.data.nodeType || node.data.nodeType === '')) {
    node.data.nodeType = 'sendgrid';
  }

  return node;
}

export function updateWorkflowCache(
  workflowId: string,
  updates: Partial<WorkflowData>
) {
  const existingWorkflow = workflowCache.get(workflowId);
  if (existingWorkflow) {
    const now = new Date().toISOString();
    
    // Normalize nodes if present in updates
    let normalizedNodes = updates.nodes;
    if (updates.nodes) {
      if (Array.isArray(updates.nodes)) {
        normalizedNodes = updates.nodes.map(node => normalizeNodeData(node));
      } else if (typeof updates.nodes === 'object') {
        normalizedNodes = Object.values(updates.nodes).map(node => normalizeNodeData(node));
      }
    }

    const updatedWorkflow = {
      workflowId: updates.workflowId || existingWorkflow.workflowId,
      tenantId: updates.tenantId || existingWorkflow.tenantId,
      name: updates.name || existingWorkflow.name,
      version: updates.version || existingWorkflow.version,
      flowType: updates.flowType || existingWorkflow.flowType,
      flowStatus: updates.flowStatus || existingWorkflow.flowStatus,
      description: updates.description || existingWorkflow.description,
      metadata: {
        ...(existingWorkflow.metadata || {}),
        ...(updates.metadata || {}),
        updatedAt: now
      },
      nodes: normalizedNodes || existingWorkflow.nodes,
      edges: updates.edges || existingWorkflow.edges,
      execution: updates.execution || existingWorkflow.execution
    };

    workflowCache.set(workflowId, updatedWorkflow);
    workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { workflowId, data: updatedWorkflow });
  }
}

export function clearWorkflowCache(workflowId: string, nodeId?: string) {
  if (nodeId) {
    const workflow = workflowCache.get(workflowId);
    if (workflow) {
      const nodeKey = getNodeCacheKey(workflowId, nodeId);
      const { [nodeKey]: _, ...rest } = workflow as any;
      workflowCache.set(workflowId, rest as WorkflowData);
      workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { 
        workflowId, 
        nodeId,
        data: null 
      });
    }
  } else {
    workflowCache.delete(workflowId);
    workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { 
      workflowId, 
      data: null 
    });
  }
}
