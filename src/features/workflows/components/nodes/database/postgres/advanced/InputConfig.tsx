import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useReactFlow, Edge, Node } from 'reactflow';
import { Badge } from '@/components/ui/badge';

interface InputParameter {
  name: string;
  expression: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  defaultValue?: string;
}

interface InputConfigProps {
  query: string;
  parameters: InputParameter[];
  onChange: (parameters: InputParameter[]) => void;
  mode: 'visual' | 'manual';
  onModeChange: (mode: 'visual' | 'manual') => void;
  nodeId: string; 
}

export function InputConfig({ 
  query, 
  parameters, 
  onChange, 
  mode, 
  onModeChange,
  nodeId 
}: InputConfigProps) {
  const [detectedParams, setDetectedParams] = useState<string[]>([]);
  const { getNode, getEdges, getNodes } = useReactFlow();
  const [connectedNodes, setConnectedNodes] = useState<Node[]>([]);

  useEffect(() => {
    const edges = getEdges();
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    const sourceNodeIds = incomingEdges.map(edge => edge.source);
    const sourceNodes = sourceNodeIds.map(id => getNode(id)).filter(Boolean) as Node[];
    setConnectedNodes(sourceNodes);
  }, [nodeId, getEdges, getNode]);

  useEffect(() => {
    const paramRegex = /:([\w_]+)/g;
    const matches = Array.from(query.matchAll(paramRegex));
    const params = matches.map(match => match[1]);
    setDetectedParams(params);

    const existingParamNames = new Set(parameters.map(p => p.name));
    const newParams = params
      .filter(param => !existingParamNames.has(param))
      .map(param => ({
        name: param,
        expression: '',
        type: 'string' as const,
      }));

    if (newParams.length > 0) {
      onChange([...parameters, ...newParams]);
    }
  }, [query]);

  const handleExpressionChange = (name: string, expression: string) => {
    const updatedParams = parameters.map(param =>
      param.name === name ? { ...param, expression } : param
    );
    onChange(updatedParams);
  };

  const handleTypeChange = (name: string, type: InputParameter['type']) => {
    const updatedParams = parameters.map(param =>
      param.name === name ? { ...param, type } : param
    );
    onChange(updatedParams);
  };

  const handleDefaultValueChange = (name: string, defaultValue: string) => {
    const updatedParams = parameters.map(param =>
      param.name === name ? { ...param, defaultValue } : param
    );
    onChange(updatedParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Parameter Mapping</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="mode">Visual Mode</Label>
          <Switch
            id="mode"
            checked={mode === 'visual'}
            onCheckedChange={(checked) => onModeChange(checked ? 'visual' : 'manual')}
          />
        </div>
      </div>

      {connectedNodes.length > 0 && (
        <div className="mb-4">
          <Label className="text-sm text-muted-foreground">Connected Input Nodes:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {connectedNodes.map((node) => (
              <Badge 
                key={node.id} 
                variant="secondary"
                className="flex items-center gap-2"
              >
                {node.data?.label || node.type}
                <span className="text-xs text-muted-foreground">({node.id})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {mode === 'visual' ? (
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Expression</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param) => (
                <TableRow key={param.name}>
                  <TableCell className="font-mono">:{param.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={param.expression}
                        onChange={(e) => handleExpressionChange(param.name, e.target.value)}
                        placeholder="{{$json.field}}"
                        className="w-full"
                      />
                      {!param.expression && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={param.type}
                      onValueChange={(value: InputParameter['type']) =>
                        handleTypeChange(param.name, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={param.defaultValue || ''}
                      onChange={(e) =>
                        handleDefaultValueChange(param.name, e.target.value)
                      }
                      placeholder="Default value"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manual mode allows you to directly edit the parameter mapping code.
          </p>
          <pre className="p-4 bg-muted rounded-lg">
            {JSON.stringify(parameters, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
