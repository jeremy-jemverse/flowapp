import axios from 'axios';
import { WorkflowData } from '@/features/workflows/types';
import { WorkflowDbService } from './workflow-db.service';

export class WorkflowService {
  static readonly API_ENDPOINT = 'https://flownodes.onrender.com/api/temporal/workflow';
  private static readonly workflowDb = new WorkflowDbService();

  static async publishWorkflow(data: WorkflowData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('WorkflowService.publishWorkflow: Publishing workflow:', {
        workflowId: data.workflowId,
        name: data.name,
        nodeCount: data.nodes.length,
      });

      const response = await axios.post<{ success: boolean; message: string }>(`${this.API_ENDPOINT}/save`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('WorkflowService.publishWorkflow: Response:', response.data);

      return {
        success: response.data.success ?? true,
        message: response.data.message ?? 'Workflow published successfully'
      };
    } catch (error) {
      console.error('WorkflowService.publishWorkflow: Error:', error);
      
      let errorMessage = 'Failed to publish workflow';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = error.response.data?.message || 'Server error occurred while publishing workflow';
        }
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  static async saveWorkflow(data: WorkflowData, mode: 'insert' | 'edit' = 'insert'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting saveWorkflow:', { mode, workflowId: data.workflowId });
      
      const result = await this.workflowDb.save(data, mode);
      
      if (!result.success) {
        return {
          success: false,
          message: result.message || `Failed to ${mode} workflow`
        };
      }

      return { 
        success: true, 
        message: `Successfully ${mode === 'insert' ? 'created' : 'updated'} workflow` 
      };
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save workflow'
      };
    }
  }

  static async getWorkflow(id: string): Promise<WorkflowData | null> {
    try {
      console.log('WorkflowService.getWorkflow: Fetching workflow:', id);

      const result = await this.workflowDb.get(id);

      if (!result) {
        console.log('WorkflowService.getWorkflow: No workflow found with id:', id);
        return null;
      }

      // Parse the schema which contains the full workflow data
      let workflowData: WorkflowData;
      try {
        if (typeof result === 'string') {
          const parsedSchema = JSON.parse(result);
          if (!this.isValidWorkflowData(parsedSchema)) {
            throw new Error('Invalid workflow data structure');
          }
          workflowData = parsedSchema;
        } else if (this.isValidWorkflowData(result)) {
          workflowData = result;
        } else {
          throw new Error('Invalid workflow data structure');
        }
      } catch (parseError) {
        console.error('WorkflowService.getWorkflow: Failed to parse workflow schema:', parseError);
        throw new Error('Invalid workflow data format');
      }

      console.log('WorkflowService.getWorkflow: Found workflow:', {
        workflowId: result.workflowId,
        name: result.name,
        nodeCount: result.metadata?.nodeCount || workflowData.nodes.length || workflowData.edges.length
      });

      return {
        ...workflowData,
        workflowId: result.workflowId,
        name: result.name,
        tenantId: result.tenantId || undefined
      };
    } catch (error) {
      console.error('WorkflowService.getWorkflow: Error:', error);
      throw error;
    }
  }

  private static isValidWorkflowData(data: any): data is WorkflowData {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.workflowId === 'string' &&
      typeof data.name === 'string' &&
      Array.isArray(data.nodes) &&
      Array.isArray(data.edges)
    );
  }
}