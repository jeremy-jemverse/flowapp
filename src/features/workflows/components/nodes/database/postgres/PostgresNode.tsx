import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Settings2 } from 'lucide-react';
import { PostgresNodeData, PostgresOperation, PostgresErrorAction } from './types';
import { cn } from '@/lib/utils';

export const PostgresNode = memo(({ 
  data: inputData,
  selected,
}: NodeProps<PostgresNodeData>) => {
  const data = {
    ...inputData,
    connectionId: inputData?.connectionId || '',
    query: inputData?.query || '',
    options: {
      errorAction: inputData?.options?.errorAction || 'fail' as PostgresErrorAction,
      maxRetries: inputData?.options?.maxRetries || 3,
      parameters: inputData?.options?.parameters || {}
    },
    nodeType: inputData.nodeType || 'postgres' as const,
    category: inputData.category || 'database' as const,
  };

  return (
    <Card className={cn('w-[200px]', selected && 'ring-2 ring-primary')}>
      <Handle type="target" position={Position.Left} />
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{data.label || 'PostgreSQL'}</span>
          </div>
          {data.onConfigure && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                data.onConfigure?.();
              }}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {data.operation === 'select_rows' ? 'Select Rows' : 'Execute Query'}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

PostgresNode.displayName = 'PostgresNode';

export const defaultData: PostgresNodeData = {
  label: 'PostgreSQL',
  operation: 'execute_query',
  connectionId: '',
  query: '',
  options: {
    errorAction: 'fail',
  },
  nodeType: 'postgres',
  category: 'database',
};