import { PostgresConfig, DEFAULT_DB_CONFIG } from './types';

export class PostgresService {
  private static readonly API_BASE_URL = 'https://flownodes.onrender.com/api/nodes/postgres';

  static async executeQuery<T>(
    query: string, 
    config: PostgresConfig = DEFAULT_DB_CONFIG,
    params?: (string | number | boolean | null)[]
  ): Promise<T[]> {
    try {
      console.log('PostgresService.executeQuery: Starting...', { 
        query,
        host: config.host,
        database: config.database,
        user: config.user,
        ssl: config.ssl,
        params
      });

      const payload = {
        connectionDetails: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: Boolean(config.ssl)
        },
        query: query.trim(),
        params
      };

      const response = await fetch(`${this.API_BASE_URL}/execute-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('PostgresService.executeQuery: API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });

        // Handle database-specific errors
        if (errorData?.message?.includes('relation') && errorData?.message?.includes('does not exist')) {
          throw new Error(`Table or view ${errorData.message.match(/"([^"]+)"/)?.[1] || 'specified'} does not exist in the database`);
        }

        const errorMessage = errorData?.error || errorData?.message || `Query execution failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('PostgresService.executeQuery: Success:', {
        responseData: data
      });

      // Ensure we consistently return the data property from the response
      return data.data || [];
    } catch (error) {
      console.error('PostgresService.executeQuery: Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        query,
        params,
        error: JSON.stringify(error, null, 2),
        config: {
          ...config,
          password: '[REDACTED]'
        }
      });
      throw error;
    }
  }

  static async getTables(config: PostgresConfig): Promise<string[]> {
    const query = `
      SELECT table_name 
      FROM (
        -- Try information_schema first (standard)
        SELECT table_name, table_schema
        FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        UNION ALL
        -- Fallback to pg_tables if information_schema is not accessible
        SELECT tablename as table_name, schemaname as table_schema
        FROM pg_tables
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ) AS combined_tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    try {
      const tables = await this.executeQuery<{ table_name: string }>(query, config);
      return tables.map(t => t.table_name);
    } catch (error) {
      console.error('PostgresService.getTables: Error:', error);
      
      // If the first query fails, try a simpler fallback query
      try {
        const fallbackQuery = `
          SELECT tablename as table_name
          FROM pg_tables
          WHERE schemaname = 'public'
          ORDER BY tablename;
        `;
        const fallbackTables = await this.executeQuery<{ table_name: string }>(fallbackQuery, config);
        return fallbackTables.map(t => t.table_name);
      } catch (fallbackError) {
        console.error('PostgresService.getTables: Fallback Error:', fallbackError);
        throw error; // Throw the original error if both attempts fail
      }
    }
  }

  static async testConnection(config: PostgresConfig): Promise<boolean> {
    try {
      console.log('PostgresService.testConnection: Testing connection...', {
        host: config.host,
        database: config.database,
        user: config.user,
        ssl: config.ssl
      });

      const payload = {
        connectionDetails: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: Boolean(config.ssl)
        }
      };

      console.log('PostgresService: Sending request with payload:', {
        ...payload,
        connectionDetails: {
          ...payload.connectionDetails,
          password: '[REDACTED]'
        }
      });

      const response = await fetch(`${this.API_BASE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('PostgresService.testConnection: API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        const errorMessage = errorData?.error || errorData?.message || `Connection test failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('PostgresService.testConnection: Success:', {
        responseData: data
      });

      return data.success;
    } catch (error) {
      console.error('PostgresService.testConnection: Error:', error);
      return false;
    }
  }
}