export const DEFAULT_PORT = 5432;

export const ERROR_ACTIONS = [
  { value: 'fail', label: 'Stop Execution' },
  { value: 'continue', label: 'Continue Execution' },
  { value: 'retry', label: 'Retry Operation' }
] as const;

export const OPERATIONS = [
  { value: 'execute_query', label: 'Execute SQL Query' },
  { value: 'select_rows', label: 'Select Rows from Table' }
] as const;

export const DEFAULT_MAX_RETRIES = 3;
export const MAX_ALLOWED_RETRIES = 10;