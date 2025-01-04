import { WorkflowData } from '../types/workflow';
import { DatabaseService, DEFAULT_DB_CONFIG } from '@/lib/services/database.service';
import { v4 as uuidv4 } from 'uuid';
import { workflowCache, initializeWorkflowCache, updateWorkflowCache } from '../utils/workflowCache';

export interface SaveWorkflowResponse {
  id: string;
  workflowId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowDbResult {
  workflowid: string;
  tenantId: string;
  name: string;
  flowType: string;
  flowStatus: 'draft' | 'active';
  description: string;
  flowTags: string[];
  schema: any;
  temporal_workflow_id: string | null;
  nodeCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

export class WorkflowService {
  static async saveWorkflow(data: WorkflowData, mode: 'insert' | 'edit' = 'insert'): Promise<SaveWorkflowResponse> {
    try {
      console.log('Starting saveWorkflow:', { mode, workflowId: data.workflowId });
      
      if (!data.workflowId) {
        throw new Error('No workflowId provided');
      }
      
      const workflowId = data.workflowId;

      // Initialize workflow cache if it doesn't exist
      if (!workflowCache.has(workflowId)) {
        initializeWorkflowCache(workflowId);
      }
      
      // Update workflow cache with new data
      updateWorkflowCache(workflowId, {
        workflowId,
        tenantId: data.tenantId,
        name: data.name,
        version: data.version,
        flowType: data.flowType,
        flowStatus: data.flowStatus || 'draft',
        description: data.description,
        metadata: data.metadata,
        nodes: data.nodes,
        edges: data.edges,
        execution: data.execution
      });

      // Get cached workflow metadata
      const cachedWorkflow = workflowCache.get(workflowId);
      if (!cachedWorkflow) {
        throw new Error('Workflow not found in cache');
      }

      // Check if workflow exists in database
      if (mode === 'insert') {
        // For insert mode, check if workflow already exists
        const existingWorkflow = await DatabaseService.executeQuery(
          'SELECT id FROM public.flows WHERE id = $1',
          DEFAULT_DB_CONFIG,
          [workflowId]
        );

        if (existingWorkflow && existingWorkflow.length > 0) {
          throw new Error('Workflow already exists. Use edit mode to update existing workflows.');
        }

        console.log('Executing INSERT for new workflow');

        const params = {
          workflowId,
          name: cachedWorkflow.name || '',
          description: cachedWorkflow.description || '',
          flowType: cachedWorkflow.flowType || 'standard',
          flowStatus: cachedWorkflow.flowStatus || 'draft',
          tags: Array.isArray(cachedWorkflow.metadata?.tags) ? JSON.stringify(cachedWorkflow.metadata.tags) : '[]',
          schema: JSON.stringify(cachedWorkflow),
          createdBy: cachedWorkflow.metadata?.createdBy || 'system',
          tenantId: data.tenantId || ''
        };

        console.log('cachedWorkflow:', cachedWorkflow);

        // Validate data types
        const validationErrors = [];
        if (typeof params.workflowId !== 'string' || !params.workflowId) validationErrors.push('workflowId must be a non-empty string');
        if (typeof params.name !== 'string') validationErrors.push('name must be a string');
        if (typeof params.description !== 'string') validationErrors.push('description must be a string');
        if (typeof params.flowType !== 'string') validationErrors.push('flowType must be a string');
        if (typeof params.flowStatus !== 'string') validationErrors.push('flowStatus must be a string');
        if (typeof params.tags !== 'string') validationErrors.push('tags must be a stringified array');
        if (typeof params.schema !== 'string') validationErrors.push('schema must be a stringified object');
        if (typeof params.createdBy !== 'string') validationErrors.push('createdBy must be a string');
        if (typeof params.tenantId !== 'string') validationErrors.push('tenantId must be a string');

        if (validationErrors.length > 0) {
          console.error('Workflow data validation failed:', validationErrors);
          throw new Error(`Invalid workflow data: ${validationErrors.join(', ')}`);
        }

        console.log('Workflow save payload:', {
          params: {
            workflowId: params.workflowId,
            name: params.name,
            description: params.description,
            flowType: params.flowType,
            flowStatus: params.flowStatus,
            tags: params.tags,
            schema: JSON.stringify(cachedWorkflow),
            createdBy: params.createdBy,
            tenantId: params.tenantId
          },
          queryParams: [
            params.workflowId,
            params.name,
            params.description,
            params.flowType,
            params.flowStatus,
            params.tags,
            params.schema,
            new Date().toISOString(),  // created_at
            new Date().toISOString(),  // updated_at
            params.createdBy,
            params.tenantId
          ].map((p, i) => ({
            [`$${i + 1}`]: {
              value: p === params.schema ? `[String length: ${String(p).length}]` : p,
              type: typeof p,
              isNull: p === null,
              isUndefined: p === undefined
            }
          }))
        });

        console.log('Executing INSERT query with validated params:', {
          ...params,
          queryParams: [
            params.workflowId,
            params.name,
            params.description,
            params.flowType,
            params.flowStatus,
            params.tags,
            params.schema,
            new Date().toISOString(),  // created_at
            new Date().toISOString(),  // updated_at
            params.createdBy,
            params.tenantId
          ].map((p, i) => `$${i + 1}: ${p === null ? 'null' : typeof p}`)
        });

        try {
          await DatabaseService.executeQuery(
            `INSERT INTO public.flows (
              id, 
              tenant_id, 
              flow_name, 
              flow_type,
              flow_status,
              flow_description,
              flow_tags,
              schema,
              created_at, 
              updated_at, 
              user_updated, 
              amount_of_nodes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            DEFAULT_DB_CONFIG,
            [
              params.workflowId,
              params.tenantId,
              params.name,
              params.flowType,
              params.flowStatus,
              params.description,
              params.tags,
              JSON.stringify(cachedWorkflow), // Store the React Flow compatible format
              new Date().toISOString(),  // created_at
              new Date().toISOString(),  // updated_at
              params.createdBy,
              Array.isArray(data.nodes) ? data.nodes.length : Object.keys(data.nodes || {}).length
            ]
          );
          
          console.log('INSERT query completed successfully');
        } catch (error) {
          console.error('Failed to execute INSERT query:', {
            error,
            params: [
              params.workflowId,
              params.tenantId,
              params.name,
              params.flowType,
              params.flowStatus,
              params.description,
              params.tags,
              params.schema,
              new Date().toISOString(),  // created_at
              new Date().toISOString(),  // updated_at
              params.createdBy,
              Array.isArray(data.nodes) ? data.nodes.length : Object.keys(data.nodes || {}).length
            ].map((p, i) => `$${i + 1}: ${p === null ? 'null' : typeof p}`),
            config: {
              ...DEFAULT_DB_CONFIG,
              password: '[REDACTED]'
            }
          });
          throw new Error(`Failed to save workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        return {
          id: workflowId,
          workflowId: workflowId,
          name: params.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        // For edit mode, check if workflow exists
        const existingWorkflow = await DatabaseService.executeQuery(
          'SELECT id FROM public.flows WHERE id = $1',
          DEFAULT_DB_CONFIG,
          [workflowId]
        );

        if (!existingWorkflow || existingWorkflow.length === 0) {
          throw new Error('Workflow not found. Cannot edit non-existent workflow.');
        }

        console.log('Executing UPDATE for existing workflow');

        // Ensure we use the cached workflow data for the update
        const schema = {
          ...cachedWorkflow,
          nodes: data.nodes || cachedWorkflow.nodes,
          edges: data.edges || cachedWorkflow.edges,
          metadata: {
            ...cachedWorkflow.metadata,
            ...data.metadata,
            updatedAt: new Date().toISOString()
          },
          version: data.version || cachedWorkflow.version
        };

        const query = `
          UPDATE public.flows 
          SET flow_name = $1,
              flow_description = $2,
              flow_type = $3,
              flow_tags = $4::jsonb,
              amount_of_nodes = $5,
              flow_status = $6,
              updated_at = $7,
              schema = $8::jsonb
          WHERE id = $9
          RETURNING id;
        `;

        const values = [
          schema.name || '',
          schema.description || '',
          schema.flowType || 'standard',
          JSON.stringify(schema.metadata?.tags || []),
          Array.isArray(schema.nodes) ? schema.nodes.length : Object.keys(schema.nodes || {}).length,
          schema.flowStatus || 'draft',
          new Date().toISOString(),
          JSON.stringify(schema),
          workflowId
        ];

        console.log('Executing UPDATE query with:', {
          query,
          values
        });

        try {
          const result = await DatabaseService.executeQuery(query, DEFAULT_DB_CONFIG, values);
          
          if (!result || result.length === 0) {
            throw new Error('Update failed - no rows affected');
          }

          return {
            id: workflowId,
            workflowId: workflowId,
            name: schema.name,
            createdAt: schema.metadata?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Failed to execute UPDATE query:', {
            error,
            params: values.map((p, i) => `$${i + 1}: ${p === null ? 'null' : typeof p}`),
            config: {
              ...DEFAULT_DB_CONFIG,
              password: '[REDACTED]'
            }
          });
          throw new Error(`Failed to save workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return {
        id: '',
        workflowId: '',
        name: '',
        createdAt: '',
        updatedAt: ''
      };
    }
  }

  static async getWorkflow(id: string): Promise<WorkflowData | null> {
    try {
      const query = `
        SELECT * FROM public.flows
        WHERE id = $1
        LIMIT 1;
      `.trim();

      const result = await DatabaseService.executeQuery(query, DEFAULT_DB_CONFIG, [id]);
      
      if (!result || result.length === 0) {
        return null;
      }

      const workflow = result[0] as WorkflowDbResult;
      
      // Parse the schema which contains nodes and edges
      const schema = typeof workflow.schema === 'string' ? JSON.parse(workflow.schema) : workflow.schema;
      
      // Transform and normalize nodes
      const nodes = schema?.nodes || {};
      const normalizedNodes = Array.isArray(nodes) 
        ? nodes 
        : Object.values(nodes);

      const workflowData: WorkflowData = {
        workflowId: workflow.workflowid,
        tenantId: workflow.tenantId,
        name: workflow.name,
        version: schema?.version || '1.0.0',
        flowType: workflow.flowType,
        flowStatus: workflow.flowStatus,
        description: workflow.description,
        metadata: {
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
          createdBy: workflow.createdBy || 'system',
          tags: workflow.flowTags || [],
          nodeCount: workflow.nodeCount
        },
        nodes: normalizedNodes,
        edges: schema?.edges || [],
        execution: schema?.execution || {
          mode: 'sequential',
          enabled: true,
          retryPolicy: {
            maxAttempts: 3,
            initialInterval: '1s'
          }
        }
      };

      return workflowData;
    } catch (error) {
      console.error('Failed to get workflow:', error);
      return null;
    }
  }

  static async executeWorkflow(workflowId: string) {
    // TODO: Implement API call to execute workflow
    console.log('Executing workflow:', workflowId);
    return { success: true };
  }

  static normalizeNode(node: any) {
    // Add implementation for normalizing node
  }
}