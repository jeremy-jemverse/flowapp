export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export interface SnowflakeConfig {
  account: string;
  warehouse: string;
  database: string;
  schema: string;
  role: string;
  username: string;
  password: string;
}

export const DEFAULT_DB_CONFIG: PostgresConfig = {
  host: "eca-data-dev-aurora.cluster-c3i2wiuyixpk.eu-central-1.rds.amazonaws.com",
  port: 5432,
  database: "workflow_dev",
  user: "expert",
  password: "expertdev",
  ssl: true
};