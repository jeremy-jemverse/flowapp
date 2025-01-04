import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

export interface BaseNodeData {
  description?: string;
  icon?: any;
  label: string;
  onConfigure?: () => void;
}

export const BaseNode = memo(({ 
  data,
  selected,
}: NodeProps<BaseNodeData>) => {
  const Icon = data.icon;

  return (
    <Card 
      className={`relative w-[200px] transition-all duration-200 ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Left}
        className="!bg-background !border-border"
      />
      
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
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
        {data.description && (
          <div className="text-xs text-muted-foreground mt-1">
            {data.description}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right}
        className="!bg-background !border-border"
      />
    </Card>
  );
});

BaseNode.displayName = 'BaseNode';