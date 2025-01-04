import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Globe } from 'lucide-react';
import { BaseNode, BaseNodeData } from './BaseNode';

interface ApiNodeData extends BaseNodeData {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: string;
}

export const ApiNode = memo((props: NodeProps<ApiNodeData>) => {
  return (
    <BaseNode 
      {...props} 
      data={{
        ...props.data,
        icon: Globe
      }}
    />
  );
});

ApiNode.displayName = 'ApiNode';