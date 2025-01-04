import { DatabaseService } from '@/lib/services/database.service';
import { ApiService } from '@/lib/services/api.service';
import { ConnectionDetails, ConnectionFormData } from '../types';
import { SqlService } from './sql.service';

export class ConnectionService {
  static async getAll(): Promise<ConnectionDetails[]> {
    try {
      console.log('ConnectionService.getAll: Starting fetch...');
      
      const query = `
        SELECT 
          id, 
          created_at, 
          last_used, 
          connection_name, 
          connection_category, 
          connection_type,
          db_type,
          host_name, 
          port, 
          database_name, 
          conn_user, 
          conn_password, 
          ssl, 
          account,
          warehouse,
          role,
          schema,
          url, 
          api_key, 
          api_secret, 
          base_url, 
          auth_type 
        FROM public.connection_details 
        ORDER BY created_at DESC;
      `.trim();

      console.log('ConnectionService.getAll: Executing query');
      const result = await DatabaseService.executeQuery<ConnectionDetails>(query);
      
      console.log('ConnectionService.getAll: Raw response:', result);
      return result || [];
    } catch (error) {
      console.error('ConnectionService.getAll: Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch connections');
    }
  }

  static async testConnection(data: ConnectionFormData): Promise<{ success: boolean; message: string }> {
    console.log('ConnectionService.testConnection: Starting with data:', data);
    
    try {
      if (data.connection_category === 'database') {
        console.log('ConnectionService.testConnection: Testing database connection');
        
        if (data.db_type === 'snowflake') {
          const result = await DatabaseService.testSnowflakeConnection({
            account: data.account || '',
            warehouse: data.warehouse || '',
            database: data.database_name || '',
            schema: data.schema || '',
            role: data.role || '',
            username: data.conn_user || '',
            password: data.conn_password || ''
          });

          return {
            success: result,
            message: result ? 'Successfully connected to Snowflake' : 'Failed to connect to Snowflake'
          };
        } else {
          const result = await DatabaseService.testPostgresConnection({
            host: data.host_name || '',
            port: Number(data.port) || 5432,
            database: data.database_name || '',
            user: data.conn_user || '',
            password: data.conn_password || '',
            ssl: data.ssl || false
          });

          return {
            success: result,
            message: result ? 'Successfully connected to PostgreSQL' : 'Failed to connect to PostgreSQL'
          };
        }
      } else if (data.connection_category === 'api') {
        console.log('ConnectionService.testConnection: Testing API connection');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        if (data.auth_type === 'bearer') {
          headers['Authorization'] = `Bearer ${data.api_key}`;
        } else if (data.auth_type === 'apiKey') {
          headers['X-API-Key'] = data.api_key || '';
        }

        try {
          const response = await fetch(data.base_url || '', {
            method: 'GET',
            headers
          });

          const success = response.ok;
          return {
            success,
            message: success ? 'Successfully connected to API' : `Failed to connect to API: ${response.statusText}`
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }

      return {
        success: false,
        message: 'Invalid connection type'
      };
    } catch (error) {
      console.error('ConnectionService.testConnection: Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test connection'
      };
    }
  }

  static async create(data: ConnectionFormData): Promise<ConnectionDetails> {
    try {
      const query = SqlService.generateInsertQuery(data);
      console.log('ConnectionService.create: Generated SQL query:', query);

      const result = await DatabaseService.executeQuery<ConnectionDetails>(query);
      console.log('ConnectionService.create: Query result:', result);
      
      if (!result?.length) {
        throw new Error('No data returned after creation');
      }

      return result[0];
    } catch (error) {
      console.error('ConnectionService.create: Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create connection');
    }
  }

  static async update(id: string, data: Partial<ConnectionFormData>): Promise<ConnectionDetails> {
    try {
      const query = SqlService.generateUpdateQuery(id, data);
      console.log('ConnectionService.update: Generated SQL query:', query);

      const result = await DatabaseService.executeQuery<ConnectionDetails>(query);
      
      if (!result?.length) {
        throw new Error('No data returned after update');
      }

      return result[0];
    } catch (error) {
      console.error('ConnectionService.update: Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update connection');
    }
  }
}