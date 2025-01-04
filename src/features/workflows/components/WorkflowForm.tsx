import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
  BackgroundVariant,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Play, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { nodeTypes } from './nodes';
import { WorkflowNode } from '../types';
import { BaseNodeConfig } from '../types/workflow';
import { NodeLibrary } from './NodeLibrary';
import { NodeConfigPanel } from './NodeConfigPanel';
import { PublishWorkflowDialog } from './PublishWorkflowDialog';
import { WorkflowCacheDebugPanel } from './WorkflowCacheDebugPanel';
import { useWorkflowState, BaseWorkflowNode } from '../hooks/useWorkflowState';
import { workflowCache, workflowCacheUpdateEmitter, WORKFLOW_CACHE_UPDATE_EVENT, clearWorkflowCache, updateWorkflowCache } from '../utils/workflowCache';
import { cn } from '@/lib/utils';
import { WorkflowListItem } from '../types/workflow';
import { NodeData } from '../types/workflow';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowData } from '../types/workflow';

interface WorkflowFormProps {
  mode?: 'insert' | 'edit';
  initialData?: WorkflowListItem;
}

interface WorkflowSchema {
  nodes: Node[];
  edges: Edge[];
}

const WorkflowFormContent = ({ mode = 'insert', initialData }: WorkflowFormProps) => {
  const { toast } = useToast();
  const [showLibrary, setShowLibrary] = useState(true);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  // Generate workflowId once on mount - for new workflows only
  const workflowId = useRef<string>(
    mode === 'insert' ? crypto.randomUUID() : (initialData?.workflowId || '')
  ).current;

  // Validate workflowId
  useEffect(() => {
    if (mode === 'edit' && !workflowId) {
      console.error('No workflowId provided for edit mode');
      toast({
        title: "Error",
        description: "No workflow ID provided for editing",
        variant: "destructive"
      });
    }
  }, [mode, workflowId, toast]);

  const {
    nodes,
    edges,
    selectedNode,
    hasUnsavedChanges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    initializeWorkflow,
    addNode,
    loadWorkflow,
    updateWorkflowMetadata,
    setHasUnsavedChanges,
    setNodes
  } = useWorkflowState(workflowId);

  // Form state initialized with initial values
  const [workflowName, setWorkflowName] = useState(initialData?.name ?? '');
  const [workflowDescription, setWorkflowDescription] = useState(initialData?.description ?? '');
  const [flowType, setFlowType] = useState<string>(initialData?.flowType ?? 'workflow');
  const [flowStatus, setFlowStatus] = useState<'draft' | 'active'>(initialData?.flowStatus ?? 'draft');
  const [tags, setTags] = useState<string[]>(initialData?.metadata?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Single initialization effect
  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return;

      // Only clear cache if this is a new workflow
      if (mode === 'insert' && workflowId) {
        workflowCache.delete(workflowId);
      }

      if (mode === 'edit' && initialData) {
        const workflowData = typeof initialData.schema === 'string' 
          ? JSON.parse(initialData.schema)
          : initialData.schema;

        // Initialize with the existing workflow data
        workflowCache.set(workflowId, workflowData);
        await loadWorkflow(workflowData);
        setFormStateFromWorkflow(workflowData);
      } else {
        // Initialize a new workflow
        console.log('Initializing new workflow with ID:', workflowId);
        await initializeWorkflow();
      }

      setIsInitialized(true);
    };

    initialize();

    // Cleanup on unmount
    return () => {
      if (workflowId && mode === 'insert') {
        clearWorkflowCache(workflowId);
      }
    };
  }, [mode, initialData, workflowId, loadWorkflow, initializeWorkflow]);

  // Helper function to set form state from workflow data
  const setFormStateFromWorkflow = useCallback((data: WorkflowData) => {
    console.log('[WorkflowForm] Setting form state from workflow data:', data);
    setWorkflowName(data.name);
    setWorkflowDescription(data.description);
    setFlowType(data.flowType);
    setFlowStatus(data.flowStatus);
    setTags(data.metadata.tags);
  }, []);

  const handleFieldChange = useCallback((field: string, value: any) => {
    // Update workflow cache
    const cachedWorkflow = workflowCache.get(workflowId);
    if (cachedWorkflow) {
      const updatedWorkflow = {
        ...cachedWorkflow,
        [field]: value,
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
    }

    // Update workflow metadata
    updateWorkflowMetadata({ [field]: value });
    
    // Update local state
    switch (field) {
      case 'name':
        setWorkflowName(value);
        break;
      case 'description':
        setWorkflowDescription(value);
        break;
      case 'flowType':
        setFlowType(value);
        break;
      case 'flowStatus':
        setFlowStatus(value);
        break;
      case 'tags':
        setTags(value);
        break;
    }
    
    setHasUnsavedChanges(true);
  }, [workflowId, updateWorkflowMetadata, setHasUnsavedChanges]);

  const handleNameChange = useCallback((newName: string) => {
    handleFieldChange('name', newName);
  }, [handleFieldChange]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    handleFieldChange('description', newDescription);
  }, [handleFieldChange]);

  const handleFlowTypeChange = useCallback((newType: string) => {
    handleFieldChange('flowType', newType);
  }, [handleFieldChange]);

  const handleStatusChange = useCallback((newStatus: 'draft' | 'active') => {
    handleFieldChange('flowStatus', newStatus);
  }, [handleFieldChange]);

  const handleTagsChange = useCallback((newTags: string[]) => {
    handleFieldChange('tags', newTags);
  }, [handleFieldChange]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags]);

  const handleSave = async (e?: React.MouseEvent) => {
    try {
      setIsSaving(true);
      updateWorkflowMetadata({
        name: workflowName,
        description: workflowDescription,
        flowType,
        flowStatus: initialData?.flowStatus || 'draft',
        tags,
      });
      
      // Get the current workflow data from cache
      const cachedWorkflow = workflowCache.get(workflowId);
      if (!cachedWorkflow) {
        throw new Error('Workflow not found in cache');
      }
      
      // Transform nodes to WorkflowNode type
      const workflowNodes = nodes.map(node => ({
        ...node,
        category: node.data?.category || 'default',
        x: node.position.x,
        y: node.position.y,
      }));
      
      // Save to database with the current mode
      console.log(`Saving workflow with mode: ${mode}`);
      const result = await WorkflowService.saveWorkflow({
        workflowId: workflowId,
        name: cachedWorkflow.name,
        description: cachedWorkflow.description,
        flowType: cachedWorkflow.flowType,
        flowStatus: cachedWorkflow.flowStatus,
        tenantId: cachedWorkflow.tenantId,
        version: cachedWorkflow.version || '1.0.0',
        metadata: cachedWorkflow.metadata,
        nodes: workflowNodes,
        edges: edges.map(edge => ({
          ...edge,
          lastModified: new Date().toISOString()
        })),
        execution: cachedWorkflow.execution
      }, mode);

      if (result.id) {
        toast({
          title: "Success",
          description: `Workflow ${mode === 'insert' ? 'created' : 'updated'} successfully`,
          variant: "default"
        });
      } else {
        throw new Error('Failed to save workflow - no ID returned');
      }
    } catch (err) {
      console.error('Failed to save workflow:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save workflow",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (!type) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(type, position);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleNodeSelect = (node: WorkflowNode<BaseNodeConfig> | null) => {
    setSelectedNode(node);
  };

  const handleNodeConfigUpdate = (nodeId: string, updates: Partial<NodeData>) => {
    console.log('[WorkflowForm][UPDATE] Node update requested:', {
      nodeId,
      updates,
      timestamp: new Date().toISOString()
    });

    const existingNode = nodes.find(n => n.id === nodeId);
    if (!existingNode) {
      console.warn('[WorkflowForm][UPDATE] Node not found:', nodeId);
      return;
    }

    console.log('[WorkflowForm][UPDATE] Found existing node:', {
      nodeId,
      existingNode
    });

    // Update nodes state
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        // Deep merge the updates with existing data
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            ...updates,
            // Special handling for config updates to prevent losing existing values
            config: updates.config ? {
              ...node.data.config,
              ...updates.config,
              // Preserve category and metadata
              category: updates.config.category || node.data.config?.category,
              metadata: {
                ...node.data.config?.metadata,
                ...updates.config.metadata,
                lastModified: new Date().toISOString()
              }
            } : node.data.config,
            // Update metadata
            metadata: {
              ...node.data.metadata,
              lastModified: new Date().toISOString()
            }
          }
        };

        console.log('[WorkflowForm][UPDATE] Node will update to:', {
          previous: node,
          updated: updatedNode,
          diff: {
            data: {
              previous: node.data,
              updated: updatedNode.data
            }
          }
        });

        return updatedNode;
      }
      return node;
    }));

    // Update workflow cache
    const cachedWorkflow = workflowCache.get(workflowId);
    if (cachedWorkflow && 'nodes' in cachedWorkflow) {
      console.log('[WorkflowForm][CACHE] Updating workflow cache:', {
        workflowId,
        cached: cachedWorkflow
      });

      // Get existing nodes from cache
      const nodesObject = Object.fromEntries(
        Array.isArray(cachedWorkflow.nodes) 
          ? cachedWorkflow.nodes.map(node => [node.id, node])
          : Object.entries(cachedWorkflow.nodes)
      );

      // Update the specific node in cache
      const existingCachedNode = nodesObject[nodeId];
      const updatedNode = {
        ...existingCachedNode,
        data: {
          ...existingCachedNode.data,
          ...updates,
          config: updates.config ? {
            ...existingCachedNode.data.config,
            ...updates.config,
            // Preserve category and metadata
            category: updates.config.category || existingCachedNode.data.config?.category,
            metadata: {
              ...existingCachedNode.data.config?.metadata,
              ...updates.config.metadata,
              lastModified: new Date().toISOString()
            }
          } : existingCachedNode.data.config,
          metadata: {
            ...existingCachedNode.data.metadata,
            lastModified: new Date().toISOString()
          }
        }
      };

      nodesObject[nodeId] = updatedNode;

      const updatedCache = {
        ...cachedWorkflow,
        nodes: nodesObject,
        metadata: {
          ...cachedWorkflow.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      console.log('[WorkflowForm][CACHE] Setting updated cache:', {
        previous: cachedWorkflow,
        updated: updatedCache,
        diff: {
          nodes: {
            [nodeId]: {
              previous: nodesObject[nodeId],
              updated: updatedNode
            }
          }
        }
      });

      workflowCache.set(workflowId, updatedCache);
      workflowCacheUpdateEmitter.emit(WORKFLOW_CACHE_UPDATE_EVENT, { workflowId });
    }
    
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4 flex-1 max-w-2xl">
          <div>
            <Label data-testid="workflow-name-label">Workflow Name</Label>
            <Input
              value={workflowName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter workflow name"
              data-testid="workflow-name-input"
            />
          </div>

          <div>
            <Label data-testid="workflow-description-label">Description</Label>
            <Input
              value={workflowDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter workflow description"
              data-testid="workflow-description-input"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label data-testid="flow-type-label">Flow Type</Label>
              <Select value={flowType} onValueChange={(value: string) => handleFlowTypeChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label data-testid="flow-status-label">Status</Label>
              <Select value={flowStatus} onValueChange={(value: 'draft' | 'active') => handleStatusChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label data-testid="tags-label">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tags..."
                data-testid="tags-input"
              />
              <Button type="button" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            data-testid="save-workflow-button"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setIsPublishDialogOpen(true)}>
            <Play className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-24rem)] bg-background border rounded-lg overflow-hidden">
        {/* Node Library */}
        <div className={cn(
          'border-r transition-all duration-200',
          showLibrary ? 'w-80' : 'w-0 overflow-hidden'
        )}>
          <NodeLibrary onDragStart={handleDragStart} />
        </div>

        {/* Toggle Library Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-80 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-sm"
          onClick={() => setShowLibrary(!showLibrary)}
        >
          {showLibrary ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {/* Flow Canvas */}
        <div className="flex-1 flex">
          <div 
            ref={reactFlowWrapper}
            style={{ width: '100%', height: '100%' }}
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) => {
                if (node.type && 'data' in node && node.data) {
                  const typedNode = node as Node<Partial<NodeData>>;
                  handleNodeSelect(typedNode);
                }
              }}
              fitView
              defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
              minZoom={0.5}
              maxZoom={2}
              fitViewOptions={{ padding: 0.2 }}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode={['Meta', 'Shift']}
              selectionKeyCode={['Meta']}
              className="bg-background"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e5e5" />
              <Controls />
              <MiniMap 
                nodeColor="#e5e5e5"
                maskColor="rgb(0, 0, 0, 0.1)"
                className="bg-background"
              />
              <Panel position="top-right">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => reactFlowInstance.fitView()}>
                    Fit View
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {selectedNode && (
            <NodeConfigPanel
              node={{
                ...selectedNode,
                width: selectedNode.width ?? undefined
              }}
              workflowId={workflowId}
              onClose={() => handleNodeSelect(null)}
              onUpdate={handleNodeConfigUpdate}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <WorkflowCacheDebugPanel />
      </div>

      <PublishWorkflowDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        workflowData={{
          workflowId: initialData?.workflowId || crypto.randomUUID(),
          tenantId: initialData?.tenantId,
          name: workflowName,
          flowType: initialData?.flowType || 'default',
          flowStatus: initialData?.flowStatus || 'draft',
          flow_description: workflowDescription,
          nodes,
          edges,
          metadata: {
            createdAt: initialData?.metadata?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            tags,
            nodeCount: nodes.length
          },
          execution: {
            mode: 'sequential',
            enabled: true,
            retryPolicy: {
              maxAttempts: 3,
              initialInterval: '1s'
            }
          }
        }}
      />
    </div>
  );
}

export function WorkflowForm(props: WorkflowFormProps) {
  return (
    <ReactFlowProvider>
      <WorkflowFormContent {...props} />
    </ReactFlowProvider>
  );
}