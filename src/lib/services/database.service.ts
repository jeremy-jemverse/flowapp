import { PostgresService } from './database/postgres.service';
import { SnowflakeService } from './database/snowflake.service';
import { 
  type PostgresConfig,
  type SnowflakeConfig,
  DEFAULT_DB_CONFIG 
} from './database/types';

export class DatabaseService {
  static readonly API_BASE_URL = 'https://flownodes.onrender.com/api/nodes/postgres';

  static async executeQuery<T>(
    query: string, 
    config: PostgresConfig = DEFAULT_DB_CONFIG,
    params?: (string | number | boolean | null)[]
  ): Promise<T[]> {
    return PostgresService.executeQuery<T>(query, config, params);
  }

  static async testPostgresConnection(config: PostgresConfig): Promise<boolean> {
    return PostgresService.testConnection(config);
  }

  static async testSnowflakeConnection(config: SnowflakeConfig): Promise<boolean> {
    return SnowflakeService.testConnection(config);
  }

  static async testConnection(config: PostgresConfig = DEFAULT_DB_CONFIG): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1', config);
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

export {
  type PostgresConfig,
  type SnowflakeConfig,
  DEFAULT_DB_CONFIG
};