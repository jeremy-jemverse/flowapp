import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Snowflake } from 'lucide-react';
import { NodeData } from '../types';

interface SnowflakeNodeData extends NodeData {
  connection?: string;
  warehouse?: string;
  database?: string;
  schema?: string;
  query?: string;
  parameters?: Record<string, any>;
  mode?: 'query' | 'procedure';
}

export const SnowflakeNode = memo(({ 
  data,
  selected,
}: NodeProps<SnowflakeNodeData>) => {
  return (
    <Card className="relative w-[200px] transition-all duration-200 bg-card border-border">
      <div className={`absolute inset-0 rounded-lg transition-all duration-200 ${
        selected ? 'ring-2 ring-primary' : ''
      }`} />
      
      <Handle type="target" position={Position.Left} />
      
      <div className="p-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{data.label}</span>
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
          {data.mode || 'query'} - {data.connection || 'No connection'}
          {data.warehouse && ` - ${data.warehouse}`}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

SnowflakeNode.displayName = 'SnowflakeNode';