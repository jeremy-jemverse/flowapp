import { HttpClient } from '../http/http-client';
import { SnowflakeConfig } from './types';

export class SnowflakeService {
  private static readonly API_BASE_URL = 'https://flownodes.onrender.com/api/nodes/snowflake';

  static async testConnection(config: SnowflakeConfig): Promise<boolean> {
    try {
      const response = await HttpClient.post(`${this.API_BASE_URL}/test-connection`, {
        connectionDetails: config
      });
      return response.success;
    } catch (error) {
      console.error('SnowflakeService.testConnection: Error:', error);
      return false;
    }
  }
}