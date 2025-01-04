import { HttpClient } from '@/lib/services/http/http-client';
import { DEFAULT_DB_CONFIG } from '@/lib/services/database/types';
import { ConnectionDetails, ConnectionFormData } from './types';

const API_BASE_URL = 'https://flownodes.onrender.com/api/nodes/postgres';

export const connectionsApi = {
  getPostgresConnections: async (): Promise<ConnectionDetails[]> => {
    try {
      console.log('ConnectionsApi.getPostgresConnections: Fetching postgres connections');

      const response = await HttpClient.post<ConnectionDetails[]>(`${API_BASE_URL}/execute-query`, {
        connectionDetails: DEFAULT_DB_CONFIG,
        query: `
          SELECT 
            id, 
            created_at, 
            last_used, 
            connection_name, 
            connection_category, 
            connection_type,
            host_name, 
            port, 
            database_name, 
            conn_user, 
            conn_password, 
            ssl, 
            conn_details
          FROM public.connection_details 
          WHERE connection_category = 'database'
          AND db_type = 'postgres'
          ORDER BY created_at DESC;
        `.trim()
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('ConnectionsApi.getPostgresConnections: Error:', error);
      throw error;
    }
  },

  getSendGridConnections: async (): Promise<ConnectionDetails[]> => {
    try {
      console.log('ConnectionsApi.getSendGridConnections: Fetching SendGrid connections');

      const response = await HttpClient.post<ConnectionDetails[]>(`${API_BASE_URL}/execute-query`, {
        connectionDetails: DEFAULT_DB_CONFIG,
        query: `
          SELECT 
            id, 
            created_at, 
            last_used, 
            connection_name, 
            connection_category, 
            connection_type,
            api_key,
            conn_details
          FROM public.connection_details 
          WHERE connection_category = 'api'
          AND connection_type = 'sendgrid'
          ORDER BY created_at DESC;
        `.trim()
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('ConnectionsApi.getSendGridConnections: Error:', error);
      throw error;
    }
  },

  createSendGridConnection: async (data: ConnectionFormData): Promise<ConnectionDetails> => {
    try {
      console.log('ConnectionsApi.createSendGridConnection: Creating connection');

      // Prepare connection details JSON
      const connDetails = {
        apiKey: data.api_key,
        defaultFrom: data.from_email,
        settings: {
          sandboxMode: false,
          clickTracking: true,
          openTracking: true
        }
      };

      const query = `
        INSERT INTO public.connection_details (
          id, 
          created_at, 
          connection_name, 
          connection_category, 
          connection_type,
          api_key,
          conn_details
        ) VALUES (
          gen_random_uuid(), 
          CURRENT_TIMESTAMP, 
          '${data.connection_name}',
          'api',
          'sendgrid',
          '${data.api_key}',
          '${JSON.stringify(connDetails)}'::jsonb
        ) RETURNING *;
      `.trim();

      const response = await HttpClient.post<ConnectionDetails[]>(`${API_BASE_URL}/execute-query`, {
        connectionDetails: DEFAULT_DB_CONFIG,
        query
      });

      if (!response.data?.[0]) {
        throw new Error('Failed to create connection');
      }

      return response.data[0];
    } catch (error) {
      console.error('ConnectionsApi.createSendGridConnection: Error:', error);
      throw error;
    }
  },

  create: async (data: ConnectionFormData): Promise<ConnectionDetails> => {
    try {
      console.log('ConnectionsApi.create: Creating connection');

      // Prepare connection details JSON
      const connDetails = {
        host: data.host_name,
        port: data.port,
        database: data.database_name,
        user: data.conn_user,
        password: data.conn_password,
        ssl: data.ssl,
        type: 'postgres',
        options: {
          maxConnections: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000
        }
      };

      const query = `
        INSERT INTO public.connection_details (
          id, created_at, connection_name, connection_category, connection_type,
          host_name, port, database_name, conn_user, conn_password, ssl,
          conn_details, db_type
        ) VALUES (
          gen_random_uuid(), CURRENT_TIMESTAMP, 
          '${data.connection_name}', 'database', 'host',
          '${data.host_name}', ${data.port}, '${data.database_name}',
          '${data.conn_user}', '${data.conn_password}', ${data.ssl},
          '${JSON.stringify(connDetails)}'::jsonb,
          'postgres'
        ) RETURNING *;
      `.trim();

      const response = await HttpClient.post<ConnectionDetails[]>(`${API_BASE_URL}/execute-query`, {
        connectionDetails: DEFAULT_DB_CONFIG,
        query
      });

      if (!response.data?.[0]) {
        throw new Error('Failed to create connection');
      }

      return response.data[0];
    } catch (error) {
      console.error('ConnectionsApi.create: Error:', error);
      throw error;
    }
  }
};