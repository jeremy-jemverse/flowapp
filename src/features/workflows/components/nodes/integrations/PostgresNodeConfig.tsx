import { Node } from 'reactflow';
import { WorkflowNode } from '../../../types/workflow';
import { BaseNodeConfig } from '../../../types/workflow';
import { PostgresNodeData } from './PostgresNode';

export interface PostgresNodeConfigProps {
  node: Node<Partial<PostgresNodeData>> & Partial<WorkflowNode<BaseNodeConfig>>;
  onChange: (data: Partial<PostgresNodeData>) => void;
}

export const PostgresNodeConfig: React.FC<PostgresNodeConfigProps> = ({ node, onChange }) => {
  const handleInputChange = (field: keyof PostgresNodeData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...node.data,
      [field]: e.target.value,
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Postgres Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Host</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={node.data?.host || ''}
            onChange={handleInputChange('host')}
            placeholder="localhost"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Port</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={node.data?.port || ''}
            onChange={handleInputChange('port')}
            placeholder="5432"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Database</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={node.data?.database || ''}
            onChange={handleInputChange('database')}
            placeholder="postgres"
          />
        </div>
      </div>
    </div>
  );
};
