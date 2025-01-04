import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import { BaseNode, BaseNodeData } from './BaseNode';

interface DatabaseNodeData extends BaseNodeData {
  query?: string;
  connection?: string;
}

export const DatabaseNode = memo((props: NodeProps<DatabaseNodeData>) => {
  return (
    <BaseNode 
      {...props} 
      data={{
        ...props.data,
        icon: Database
      }}
    />
  );
});

DatabaseNode.displayName = 'DatabaseNode';