import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, GitBranch } from 'lucide-react';
import { NodeData } from '../types';

interface SwitchNodeData extends NodeData {
  conditions?: Array<{
    id: string;
    condition: string;
  }>;
}

export const SwitchNode = memo(({ 
  data,
  selected,
}: NodeProps<SwitchNodeData>) => {
  const conditions = data.conditions || [];

  return (
    <CardComponent className={`
      w-[200px] transition-all duration-200
      ${selected ? 'ring-2 ring-primary' : ''}
    `}>
      <Handle type="target" position={Position.Left} />
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
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
          {conditions.length} conditions
        </div>
      </div>

      {/* Output handles for each condition plus default */}
      {conditions.map((condition, i) => (
        <Handle
          key={condition.id}
          type="source"
          position={Position.Right}
          id={condition.id}
          style={{ top: `${(i + 1) * (100 / (conditions.length + 2))}%` }}
        />
      ))}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ top: '90%' }}
      />
    </CardComponent>
  );
});

SwitchNode.displayName = 'SwitchNode';