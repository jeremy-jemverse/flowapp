import axios from 'axios';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export const testDatabaseConnection = async (config: DatabaseConfig) => {
  try {
    const response = await axios.post('/api/database/test', config);
    return response.data;
  } catch (error) {
    throw new Error('Failed to connect to database');
  }
};

export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  host: 'eca-data-dev-aurora.cluster-c3i2wiuyixpk.eu-central-1.rds.amazonaws.com',
  port: 5432,
  database: 'workflow_dev',
  user: 'expert',
  password: 'expertdev'
};