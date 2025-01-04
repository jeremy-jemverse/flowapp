import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { PostgresOperation } from './types';

interface PostgresQueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  operation: PostgresOperation;
}

export function PostgresQueryEditor({ value = '', onChange, operation }: PostgresQueryEditorProps) {
  const [error, setError] = useState<string | null>(null);

  const validateQuery = (query: string = '') => {
    if (!query?.trim()) {
      setError('Query cannot be empty');
      return;
    }

    // Basic SQL validation
    const normalizedQuery = query.toLowerCase().trim();
    
    if (operation === 'select_rows' && !normalizedQuery.startsWith('select')) {
      setError('Query must start with SELECT when using Select Rows operation');
      return;
    }

    // Check for common SQL injection patterns
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
      setError('Invalid query: Only SELECT statements are allowed in this mode');
      return;
    }

    setError(null);
  };

  useEffect(() => {
    validateQuery(value);
  }, [value, operation]);

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={operation === 'select_rows' 
          ? 'SELECT * FROM table WHERE condition'
          : 'Enter your SQL query here'
        }
        className="font-mono min-h-[200px]"
      />
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
    </div>
  );
}