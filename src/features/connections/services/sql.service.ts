import { ConnectionFormData } from '../types';

export class SqlService {
  static generateInsertQuery(data: ConnectionFormData): string {
    // Define fields in the exact order with correct names
    const fields = [
      'id',
      'created_at',
      'last_used',
      'connection_name',
      'connection_category',
      'connection_type',
      'db_type',
      'host_name',
      'port',
      'database_name',
      'conn_user',
      'conn_password',
      'ssl',
      'account',
      'warehouse',
      'role',
      'schema',
      'url',
      'api_key',
      'api_secret',
      'base_url',
      'auth_type'
    ];

    // Map form data to database fields
    const values = [
      'gen_random_uuid()',
      'CURRENT_TIMESTAMP',
      'NULL',
      this.formatValue(data.connection_name),
      this.formatValue(data.connection_category),
      this.formatValue(data.connection_type),
      this.formatValue(data.db_type),
      this.formatValue(data.host_name),
      data.port || 'NULL',
      this.formatValue(data.database_name),
      this.formatValue(data.conn_user),
      this.formatValue(data.conn_password),
      data.ssl ? 'true' : 'false',
      this.formatValue(data.account),
      this.formatValue(data.warehouse),
      this.formatValue(data.role),
      this.formatValue(data.schema),
      this.formatValue(data.url),
      this.formatValue(data.api_key),
      this.formatValue(data.api_secret),
      this.formatValue(data.base_url),
      this.formatValue(data.auth_type)
    ];

    return `INSERT INTO public.connection_details (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING *;`;
  }

  static generateUpdateQuery(id: string, data: Partial<ConnectionFormData>): string {
    // Build SET clause with only provided fields
    const updateFields = [];

    if (data.connection_name !== undefined) {
      updateFields.push(`connection_name = ${this.formatValue(data.connection_name)}`);
    }
    if (data.connection_category !== undefined) {
      updateFields.push(`connection_category = ${this.formatValue(data.connection_category)}`);
    }
    if (data.connection_type !== undefined) {
      updateFields.push(`connection_type = ${this.formatValue(data.connection_type)}`);
    }
    if (data.db_type !== undefined) {
      updateFields.push(`db_type = ${this.formatValue(data.db_type)}`);
    }
    if (data.host_name !== undefined) {
      updateFields.push(`host_name = ${this.formatValue(data.host_name)}`);
    }
    if (data.port !== undefined) {
      updateFields.push(`port = ${data.port || 'NULL'}`);
    }
    if (data.database_name !== undefined) {
      updateFields.push(`database_name = ${this.formatValue(data.database_name)}`);
    }
    if (data.conn_user !== undefined) {
      updateFields.push(`conn_user = ${this.formatValue(data.conn_user)}`);
    }
    if (data.conn_password !== undefined) {
      updateFields.push(`conn_password = ${this.formatValue(data.conn_password)}`);
    }
    if (data.ssl !== undefined) {
      updateFields.push(`ssl = ${data.ssl ? 'true' : 'false'}`);
    }
    if (data.account !== undefined) {
      updateFields.push(`account = ${this.formatValue(data.account)}`);
    }
    if (data.warehouse !== undefined) {
      updateFields.push(`warehouse = ${this.formatValue(data.warehouse)}`);
    }
    if (data.role !== undefined) {
      updateFields.push(`role = ${this.formatValue(data.role)}`);
    }
    if (data.schema !== undefined) {
      updateFields.push(`schema = ${this.formatValue(data.schema)}`);
    }
    if (data.url !== undefined) {
      updateFields.push(`url = ${this.formatValue(data.url)}`);
    }
    if (data.api_key !== undefined) {
      updateFields.push(`api_key = ${this.formatValue(data.api_key)}`);
    }
    if (data.api_secret !== undefined) {
      updateFields.push(`api_secret = ${this.formatValue(data.api_secret)}`);
    }
    if (data.base_url !== undefined) {
      updateFields.push(`base_url = ${this.formatValue(data.base_url)}`);
    }
    if (data.auth_type !== undefined) {
      updateFields.push(`auth_type = ${this.formatValue(data.auth_type)}`);
    }

    // Always update last_used timestamp
    updateFields.push('last_used = CURRENT_TIMESTAMP');

    return `
      UPDATE public.connection_details 
      SET ${updateFields.join(', ')}
      WHERE id = ${this.formatValue(id)}
      RETURNING *;
    `.trim();
  }

  private static formatValue(value: any): string {
    if (value === undefined || value === null || value === '') {
      return 'NULL';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    // Escape single quotes and wrap in single quotes
    return `'${value.toString().replace(/'/g, "''")}'`;
  }

  static validateConnectionData(data: ConnectionFormData): boolean {
    if (!data.connection_name || !data.connection_category) {
      return false;
    }

    if (data.connection_category === 'database') {
      if (!data.db_type) {
        return false;
      }

      if (data.db_type === 'postgres') {
        return !!(data.host_name && data.port && data.database_name && data.conn_user);
      }

      if (data.db_type === 'snowflake') {
        return !!(data.account && data.warehouse && data.database_name && data.conn_user);
      }
    }

    if (data.connection_category === 'api') {
      return !!(data.base_url && data.auth_type);
    }

    return false;
  }
}