import { PostgresNodeData, PostgresOperation } from '../types';

export type OutputFormat = 'single' | 'array' | 'dataset';

export interface QueryResult {
  columns: string[];
  rows: any[];
  rowCount: number;
  error?: string;
}

export interface AdvancedPostgresModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: PostgresNodeData;
  onSave: (data: Partial<PostgresNodeData>) => void;
}

export interface QueryBuilderProps {
  value: string;
  onChange: (value: string) => void;
  onGenerateQuery?: (prompt: string) => Promise<string>;
  onRun: () => Promise<void>;
  isLoading: boolean;
  queryResult?: QueryResult;
  connectionId: string;
}

export interface QueryPreviewProps {
  query: string;
  connectionId: string;
  onRun: () => void;
  result?: QueryResult;
  isLoading: boolean;
}

export interface OutputConfigProps {
  format: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  outputFields: string[];
  onOutputFieldsChange: (fields: string[]) => void;
}
