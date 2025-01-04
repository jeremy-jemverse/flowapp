import { PostgresOperation } from '../types';

export function validateQuery(query: string, operation: PostgresOperation): string | null {
  if (!query.trim()) {
    return 'Query cannot be empty';
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  if (operation === 'select_rows' && !normalizedQuery.startsWith('select')) {
    return 'Query must start with SELECT when using Select Rows operation';
  }

  const dangerousPatterns = [
    '--',
    ';',
    'drop table',
    'drop database',
    'truncate table',
    'delete from',
    'update ',
    'insert into'
  ];

  if (operation === 'select_rows' && 
      dangerousPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return 'Invalid query: Only SELECT statements are allowed in this mode';
  }

  return null;
}