import { isNullOrEmpty } from '@/lib/utils';

export class SqlService {
  static generateInsertQuery(data: any) {
    // Define fields in the exact order with correct names
    const fields = [
      'id',
      'created_at',
      'last_used',
      'connection_name',
      'connection_category',
      'connection_type',
      'host_name',
      'port',
      'database_name',
      'conn_user',
      'conn_pass',
      'ssl',
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
      this.formatValue(data.type),
      this.formatValue(data.connection_type),
      this.formatValue(data.host_name),
      data.port || 'NULL',
      this.formatValue(data.database_name),
      this.formatValue(data.username),
      data.password === 'expertdev' || !data.password ? "'expertdev'" : this.formatValue(data.password),
      data.ssl ? 'true' : 'false',
      this.formatValue(data.url),
      this.formatValue(data.api_key),
      this.formatValue(data.api_secret),
      this.formatValue(data.base_url),
      this.formatValue(data.auth_type)
    ];

    // Build the SQL query as a single line
    return `INSERT INTO public.connection_details (${fields.join(', ')}) VALUES (${values.join(', ')});`;
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

  static validateConnectionData(data: any): boolean {
    const requiredFields = ['connection_name', 'type', 'connection_type'];
    return requiredFields.every(field => !isNullOrEmpty(data[field]));
  }
}