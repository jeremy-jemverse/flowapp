import { ApiService } from '@/lib/services/api.service';
import { DatabaseService } from '@/lib/services/database.service';
import { ConnectionFormData } from '../types';

export class ConnectionTestService {
  static async testConnection(data: ConnectionFormData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('ConnectionTestService: Testing connection:', {
        category: data.connection_category,
        type: data.connection_type,
        dbType: data.db_type
      });

      // Validate required fields before testing
      const validationError = this.validateConnectionData(data);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      if (data.connection_category === 'database') {
        return await this.testDatabaseConnection(data);
      } else if (data.connection_category === 'api') {
        return await this.testApiConnection(data);
      }

      throw new Error('Invalid connection category');
    } catch (error) {
      console.error('ConnectionTestService: Error testing connection:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test connection'
      };
    }
  }

  private static validateConnectionData(data: ConnectionFormData): string | null {
    if (!data.connection_category) {
      return 'Connection category is required';
    }

    if (data.connection_category === 'database') {
      if (!data.db_type) {
        return 'Database type is required';
      }

      if (data.db_type === 'postgres') {
        if (!data.host_name) return 'Host is required';
        if (!data.port) return 'Port is required';
        if (!data.database_name) return 'Database name is required';
        if (!data.conn_user) return 'Username is required';
        if (!data.conn_password) return 'Password is required';
      }

      if (data.db_type === 'snowflake') {
        if (!data.account) return 'Account is required';
        if (!data.warehouse) return 'Warehouse is required';
        if (!data.database_name) return 'Database name is required';
        if (!data.conn_user) return 'Username is required';
        if (!data.conn_password) return 'Password is required';
      }
    }

    if (data.connection_category === 'api') {
      if (!data.base_url) return 'Base URL is required';
      if (!data.auth_type) return 'Authentication type is required';

      if (data.auth_type === 'bearer' && !data.api_key) {
        return 'Bearer token is required';
      }

      if (data.auth_type === 'basic') {
        if (!data.conn_user) return 'Username is required';
        if (!data.conn_password) return 'Password is required';
      }

      if (data.auth_type === 'apiKey' && !data.api_key) {
        return 'API key is required';
      }
    }

    return null;
  }

  private static async testDatabaseConnection(data: ConnectionFormData): Promise<{ success: boolean; message: string }> {
    try {
      if (data.db_type === 'snowflake') {
        const result = await DatabaseService.testSnowflakeConnection({
          account: data.account || '',
          warehouse: data.warehouse || '',
          database: data.database_name || '',
          schema: data.schema || 'public',
          role: data.role || 'ACCOUNTADMIN',
          username: data.conn_user || '',
          password: data.conn_password || ''
        });

        return {
          success: result,
          message: result ? 'Successfully connected to Snowflake' : 'Failed to connect to Snowflake'
        };
      } else if (data.db_type === 'postgres') {
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

      throw new Error('Unsupported database type');
    } catch (error) {
      console.error('ConnectionTestService: Database connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to database'
      };
    }
  }

  private static async testApiConnection(data: ConnectionFormData): Promise<{ success: boolean; message: string }> {
    try {
      // Prepare headers based on auth type
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (data.auth_type === 'bearer') {
        headers['Authorization'] = `Bearer ${data.api_key}`;
      } else if (data.auth_type === 'apiKey') {
        headers['X-API-Key'] = data.api_key || '';
      } else if (data.auth_type === 'basic') {
        const credentials = btoa(`${data.conn_user}:${data.conn_password}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }

      // Make test request to the API
      const response = await fetch(data.base_url || '', {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const success = response.ok;
      const message = success 
        ? 'Successfully connected to API'
        : `Failed to connect to API: ${response.statusText}`;

      return { success, message };
    } catch (error) {
      let errorMessage = 'Failed to connect to API';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Connection timed out';
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error - please check the URL and your internet connection';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }
}