import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { PostgresOperation, PostgresErrorAction, PostgresNodeData } from './types';
import { PostgresConnectionSelect } from './PostgresConnectionSelect';
import { PostgresQueryEditor } from './PostgresQueryEditor';
import { PostgresOptionsPanel } from './PostgresOptionsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { CreateConnectionDialog } from './CreateConnectionDialog';
import { AdvancedPostgresModal } from './advanced/AdvancedPostgresModal';

interface PostgresNodeConfigProps {
  node: Node<PostgresNodeData>;
  onChange: (data: Partial<PostgresNodeData>) => void;
}

export function PostgresNodeConfig({ node, onChange }: PostgresNodeConfigProps) {
  const [showCreateConnection, setShowCreateConnection] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const data = {
    ...node.data,
    query: node.data?.query || '',
    operation: node.data?.operation || 'execute_query',
    options: node.data?.options || {
      errorAction: 'fail' as PostgresErrorAction,
      maxRetries: 3,
      parameters: {}
    }
  };

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label>Node Label</Label>
        <Input
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="PostgreSQL Node"
        />
      </div>

      <div className="space-y-2">
        <Label>Operation</Label>
        <Select
          value={data.operation}
          onValueChange={(value) => handleChange('operation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="execute_query">Execute Query</SelectItem>
            <SelectItem value="select_rows">Select Rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Connection</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setShowCreateConnection(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Connection
          </Button>
        </div>
        <PostgresConnectionSelect
          value={data.connectionId}
          onChange={(value) => handleChange('connectionId', value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Query</Label>
        <PostgresQueryEditor
          value={data.query}
          onChange={(value) => handleChange('query', value)}
          operation={data.operation}
        />
      </div>

      <PostgresOptionsPanel
        value={data.options}
        onChange={(value) => handleChange('options', value)}
      />

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowAdvancedModal(true)}
        >
          Advanced Configuration
        </Button>
      </div>

      <CreateConnectionDialog
        open={showCreateConnection}
        onOpenChange={setShowCreateConnection}
        onSuccess={(connectionId) => {
          handleChange('connectionId', connectionId);
          setShowCreateConnection(false);
        }}
      />

      <AdvancedPostgresModal
        open={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        initialData={data}
        nodeId={node.id}
        onSave={(updatedData) => {
          onChange(updatedData);
          setShowAdvancedModal(false);
        }}
      />
    </div>
  );
}