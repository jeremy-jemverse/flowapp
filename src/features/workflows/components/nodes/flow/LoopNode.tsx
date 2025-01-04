import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Repeat } from 'lucide-react';
import { NodeData } from '../types';

interface LoopNodeData extends NodeData {
  mode?: 'collection' | 'count' | 'while';
  maxIterations?: number;
}

export const LoopNode = memo(({ 
  data,
  selected,
}: NodeProps<LoopNodeData>) => {
  return (
    <Card className={`
      w-[200px] transition-all duration-200
      ${selected ? 'ring-2 ring-primary' : ''}
    `}>
      <Handle type="target" position={Position.Left} />
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-primary" />
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
          {data.mode} loop {data.maxIterations ? `(max ${data.maxIterations})` : ''}
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="next" />
      <Handle type="source" position={Position.Bottom} id="complete" />
    </Card>
  );
});

LoopNode.displayName = 'LoopNode';