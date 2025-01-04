import { WorkflowData } from '../../features/workflows/types/workflow';
import { PostgresService } from './database/postgres.service';

export class WorkflowDbService {
  async save(data: WorkflowData, mode: 'insert' | 'edit' = 'insert'): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const query = mode === 'insert' 
        ? `INSERT INTO public.flows (
              id,
              tenant_id,
              flow_name,
              flow_type,
              flow_status,
              flow_description,
              flow_tags,
              schema,
              amount_of_nodes,
              created_at,
              updated_at,
              user_updated
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`
        : `UPDATE public.flows 
           SET tenant_id = $2,
               flow_name = $3,
               flow_type = $4,
               flow_status = $5,
               flow_description = $6,
               flow_tags = $7,
               schema = $8,
               amount_of_nodes = $10,
               updated_at = $12,
               user_updated = $13
           WHERE id = $1 RETURNING *`;

      const now = new Date().toISOString();
      const schema = {
        nodes: data.nodes,
        edges: data.edges,
        version: data.version,
        execution: data.execution,
        metadata: {
          ...data.metadata,
          updatedAt: now,
          nodeCount: data.nodes?.length || 0
        }
      };

      const params = [
        data.workflowId,                              // id ($1)
        data.tenantId || null,                        // tenant_id ($2)
        data.name,                                    // flow_name ($3)
        data.flowType,                                // flow_type ($4)
        data.flowStatus || 'draft',                   // flow_status ($5)
        data.description || null,                     // flow_description ($6)
        JSON.stringify(data.metadata.tags || []),     // flow_tags ($7)
        JSON.stringify(data),                         // schema ($8)
        data.metadata.nodeCount || 0,                 // amount_of_nodes ($10)
        now,                                          // created_at ($11)
        now,                                          // updated_at ($12)
        data.metadata.createdBy || 'system'           // user_updated ($13)
      ];

      const result = await PostgresService.executeQuery(query, undefined, params);
      const row = result[0];

      return {
        success: true,
        message: `Workflow ${mode === 'insert' ? 'created' : 'updated'} successfully`,
        data: row
      };
    } catch (error) {
      console.error(`WorkflowDbService.save: Error ${mode === 'insert' ? 'creating' : 'updating'} workflow:`, error);
      return {
        success: false,
        message: `Error ${mode === 'insert' ? 'creating' : 'updating'} workflow`
      };
    }
  }

  async get(id: string): Promise<WorkflowData | null> {
    try {
      const query = `
        SELECT id, flow_name, flow_description, flow_type, flow_tags, schema, flow_status
        FROM workflows
        WHERE id = $1
      `;

      const result = await PostgresService.executeQuery<any>(query, undefined, [id]);
      
      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      const schema = JSON.parse(row.schema);
      
      return {
        workflowId: row.id,
        tenantId: row.tenant_id,
        name: row.flow_name,
        version: schema.version || '1.0.0',
        flowType: row.flow_type,
        flowStatus: row.flow_status || 'draft',
        description: row.flow_description,
        nodes: schema.nodes || [],
        edges: schema.edges || [],

        execution: schema.execution || {
          mode: 'sequential',
          enabled: true
        },
        metadata: {
          ...schema.metadata,
          createdAt: schema.metadata?.createdAt || new Date().toISOString(),
          updatedAt: schema.metadata?.updatedAt || new Date().toISOString(),
          createdBy: schema.metadata?.createdBy || 'system',
          tags: JSON.parse(row.flow_tags || '[]'),
          nodeCount: (schema.nodes || []).length,
        }
      };
    } catch (error) {
      console.error('WorkflowDbService.get: Error fetching workflow:', error);
      throw error;
    }
  }
}