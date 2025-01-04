import { Node } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { H4, Subtle } from '@/components/ui/typography';
import { ChevronRight, Pencil } from 'lucide-react';
import { WorkflowData } from '../types/workflow';
import { NodeData, NodeProperties } from './nodes/types';
import { WorkflowNode, BaseNodeConfig } from '../types/workflow';
import { nodeDefinitions } from './nodes';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { workflowCache } from '../utils/workflowCache';

interface NodeConfigPanelProps {
  node: Node<Partial<NodeData>> & Partial<NodeProperties> & WorkflowNode<BaseNodeConfig>;
  workflowId: string;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<NodeData>) => void;
}

export function NodeConfigPanel({ node, workflowId, onClose, onUpdate }: NodeConfigPanelProps) {
  console.log('[NodeConfigPanel][INIT] Panel opened with:', {
    node,
    workflowId,
    nodeData: node.data,
    nodeConfig: node.data?.config
  });

  // Initialize with merged data from node and cache
  const cached = workflowCache.get(workflowId);
  console.log('[NodeConfigPanel][CACHE] Retrieved cached workflow:', {
    workflowId,
    cached,
    hasNodes: !!cached?.nodes
  });

  const cachedNode = cached?.nodes && (
    typeof cached.nodes === 'object' && !Array.isArray(cached.nodes)
      ? cached.nodes[node.id]
      : Array.isArray(cached.nodes)
        ? cached.nodes.find(n => n.id === node.id)
        : undefined
  );

  console.log('[NodeConfigPanel][CACHE] Found cached node:', {
    nodeId: node.id,
    cachedNode,
    cachedNodeData: cachedNode?.data,
    cachedNodeConfig: cachedNode?.data?.config
  });

  const [nodeData, setNodeData] = useState(() => {
    const initialData = {
      label: node.data?.label ?? cachedNode?.data?.label ?? 'Configure Node',
      config: {
        ...cachedNode?.data?.config,
        ...node.data?.config,
        label: node.data?.label ?? cachedNode?.data?.label ?? 'Configure Node',
        description: node.data?.config?.description ?? cachedNode?.data?.config?.description ?? '',
        category: node.data?.category ?? node.data?.config?.category ?? cachedNode?.data?.category ?? 'email',
      },
      description: node.data?.config?.description ?? cachedNode?.data?.config?.description ?? ''
    };

    console.log('[NodeConfigPanel][STATE] Initializing state with:', {
      initialData,
      mergedFrom: {
        nodeLabel: node.data?.label,
        cachedLabel: cachedNode?.data?.label,
        nodeConfig: node.data?.config,
        cachedConfig: cachedNode?.data?.config
      }
    });

    return initialData;
  });

  // Only log state changes in development
  useEffect(() => {
    console.log('[NodeConfigPanel] Current state:', {
      node,
      nodeData: node.data,
      nodeConfig: node.data?.config,
    });
  }, [node]);

  const handleFieldUpdate = useCallback((field: string, value: any) => {
    console.log('[NodeConfigPanel][UPDATE] Field update requested:', {
      field,
      value,
      currentNodeData: nodeData
    });

    setNodeData(prev => {
      // For config updates, update the config object directly without nesting
      if (field === 'config') {
        // Ensure we don't create nested config objects
        const newConfig = {
          ...prev.config,
          ...(value.config || value), // If value has a config property, use that, otherwise use value directly
          metadata: {
            ...(prev.config?.metadata || {
              created: new Date().toISOString(),
              version: '1.0.0',
              isValid: true,
              errors: []
            }),
            lastModified: new Date().toISOString()
          }
        } as NodeData['config'];

        // Remove any nested config property if it exists
        if ('config' in newConfig) {
          delete newConfig.config;
        }

        const updatedData = {
          ...prev,
          config: newConfig
        };

        console.log('[NodeConfigPanel][UPDATE] State will update to:', {
          previous: prev,
          updated: updatedData,
          diff: {
            config: {
              previous: prev.config,
              updated: updatedData.config
            }
          }
        });
        
        onUpdate(node.id, {
          config: updatedData.config
        });
        return updatedData;
      }

      // For other fields, update both the top level and config
      const updatedData = {
        ...prev,
        [field]: value,
        config: {
          ...prev.config,
          label: field === 'label' ? value : prev.config.label,
          description: field === 'description' ? value : prev.config.description
        }
      };
      
      console.log('[NodeConfigPanel][UPDATE] State will update to:', {
        previous: prev,
        updated: updatedData,
        diff: {
          [field]: {
            from: (prev as any)[field],
            to: value
          }
        }
      });

      onUpdate(node.id, {
        [field]: value,
        config: updatedData.config
      });

      return updatedData;
    });
  }, [node.id, onUpdate]);

  // Get the config component from the node definition
  const nodeDefinition = node.type ? nodeDefinitions[node.type as keyof typeof nodeDefinitions] : undefined;
  const NodeConfigComponent = nodeDefinition && typeof nodeDefinition !== 'string' ? nodeDefinition.getConfigComponent?.() : undefined;
  const nodeType = node.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Node';

  if (!NodeConfigComponent) {
    console.warn(`No config component found for node type: ${node.type}`);
    return null;
  }

  return (
    <Card className="w-[600px] h-full border-l rounded-none flex flex-col">
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={nodeData.label}
            onChange={(e) => handleFieldUpdate('label', e.target.value)}
            className="h-8"
          />
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <Tabs defaultValue="node" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full flex-shrink-0">
          <TabsTrigger value="node" className="flex-1">{nodeType}</TabsTrigger>
          <TabsTrigger value="config" className="flex-1">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="node" className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4">
              <NodeConfigComponent
                node={{
                  ...node,
                  data: {
                    ...node.data,
                    config: node.data?.config || {},
                  }
                }}
                onChange={(data) => handleFieldUpdate('config', data)}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="config" className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <H4>General Configuration</H4>
                  <Subtle>Configure general node settings here</Subtle>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={nodeData.description}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    placeholder="Add a description for this node"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}