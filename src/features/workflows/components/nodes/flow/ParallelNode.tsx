import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Split } from 'lucide-react';
import { NodeData } from '../types';

interface ParallelNodeData extends NodeData {
  branches?: number;
}

export const ParallelNode = memo(({ 
  data,
  selected,
}: NodeProps<ParallelNodeData>) => {
  const branches = data.branches || 2;

  return (
    <Card className={`
      w-[200px] transition-all duration-200
      ${selected ? 'ring-2 ring-primary' : ''}
    `}>
      <Handle type="target" position={Position.Left} />
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Split className="h-4 w-4 text-primary" />
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
          {branches} parallel branches
        </div>
      </div>

      {/* Multiple output handles for parallel branches */}
      {Array.from({ length: branches }).map((_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          style={{ top: `${(i + 1) * (100 / (branches + 1))}%` }}
        />
      ))}
    </Card>
  );
});

ParallelNode.displayName = 'ParallelNode';