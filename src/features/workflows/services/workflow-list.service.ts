import { DatabaseService } from '@/lib/services/database.service';

export interface WorkflowListItem {
  workflowId: string;
  tenantId: string;
  name: string;
  version: string;
  description: string;
  flowType: string;
  flowStatus: 'draft' | 'active';
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    nodeCount?: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  flow_tags?: string | string[];
  nodeCount?: number;
  schema: string | Record<string, any>;
}

export class WorkflowListService {
  static async getAll(): Promise<WorkflowListItem[]> {
    try {
      console.log('WorkflowListService.getAll: Fetching workflows');

      const query = `
        SELECT 
          id as "workflowId",
          tenant_id as "tenantId",
          flow_name as "name",
          flow_description as "description",
          flow_type as "flowType",
          flow_status as "flowStatus",
          created_at as "createdAt",
          updated_at as "updatedAt",
          user_updated as "createdBy",
          flow_tags as "flow_tags",
          amount_of_nodes as "nodeCount",
          schema
        FROM public.flows
        ORDER BY created_at DESC;
      `.trim();

      const response = await DatabaseService.executeQuery<WorkflowListItem>(query);
      
      console.log('WorkflowListService.getAll: Found workflows:', response?.length);
      console.log('WorkflowListService.getAll: Data:', response);

      // Get the actual result array from the response
      const result = response || [];

      // Transform the database result into the new format
      return result.map(workflow => {
        // Parse tags from the database result
        const tags = workflow.flow_tags ? 
          (typeof workflow.flow_tags === 'string' ? 
            JSON.parse(workflow.flow_tags) : workflow.flow_tags) 
          : [];

        // Create the metadata structure
        const metadata = {
          createdAt: workflow.createdAt || new Date().toISOString(),
          updatedAt: workflow.updatedAt || new Date().toISOString(),
          createdBy: workflow.createdBy || 'system',
          tags,
          nodeCount: workflow.nodeCount || 0
        };

        // Return the transformed workflow
        return {
          workflowId: workflow.workflowId,
          tenantId: workflow.tenantId,
          name: workflow.name || '',
          description: workflow.description || '',
          flowType: workflow.flowType || 'standard',
          flowStatus: (workflow.flowStatus || 'draft') as 'draft' | 'active',
          metadata,
          schema: workflow.schema || {},
          version: '1.0.0', // Default version if not provided
          createdAt: workflow.createdAt || new Date().toISOString(),
          updatedAt: workflow.updatedAt || new Date().toISOString(),
          createdBy: workflow.createdBy || 'system',
          tags,
          flow_tags: workflow.flow_tags,
          nodeCount: workflow.nodeCount || 0
        };
      });
    } catch (error) {
      console.error('WorkflowListService.getAll: Error:', error);
      throw error;
    }
  }
}