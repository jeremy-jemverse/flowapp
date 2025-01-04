import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Merge } from 'lucide-react';
import { NodeData } from '../types';

interface MergeNodeData extends NodeData {
  mode?: 'combine' | 'join' | 'zip';
  inputCount?: number;
}

export const MergeNode = memo(({ 
  data,
  selected,
}: NodeProps<MergeNodeData>) => {
  const inputCount = data.inputCount || 2;

  return (
    <Card className={`relative w-[200px] transition-all duration-200 ${selected ? 'ring-2 ring-primary' : ''}`}>
      {/* Multiple input handles */}
      {Array.from({ length: inputCount }).map((_, i) => (
        <Handle
          key={i}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{ top: `${(i + 1) * (100 / (inputCount + 1))}%` }}
        />
      ))}
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Merge className="h-4 w-4 text-primary" />
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
          {data.mode || 'combine'} merge ({inputCount} inputs)
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

MergeNode.displayName = 'MergeNode';