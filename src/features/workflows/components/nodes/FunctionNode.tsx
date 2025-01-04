import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import { BaseNode, BaseNodeData } from './BaseNode';
import { NodeInput, NodeOutput } from './types';

interface FunctionNodeData extends BaseNodeData {
  code?: string;
  inputs?: NodeInput[];
  outputs?: NodeOutput[];
}

export const FunctionNode = memo((props: NodeProps<FunctionNodeData>) => {
  return (
    <BaseNode 
      {...props} 
      data={{
        ...props.data,
        icon: Code
      }}
    />
  );
});

FunctionNode.displayName = 'FunctionNode';