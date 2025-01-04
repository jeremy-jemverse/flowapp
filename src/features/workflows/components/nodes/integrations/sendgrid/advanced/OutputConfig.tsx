import { Plus, Trash2, Code, Eye, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SendGridNodeData, OutputField, DEFAULT_OUTPUT_FIELDS } from './types';

interface OutputConfigProps {
  value?: SendGridNodeData['output'];
  onChange: (value: SendGridNodeData['output']) => void;
}

export function OutputConfig({ value, onChange }: OutputConfigProps) {
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState<Partial<OutputField>>({});
  const [mode, setMode] = useState<'visual' | 'manual'>(value?.mode || 'visual');
  const fields = value?.fields || DEFAULT_OUTPUT_FIELDS;

  const handleAddField = () => {
    if (!newField.name || !newField.expression) return;
    
    onChange({
      mode: mode || 'visual',
      fields: [...fields, {
        name: newField.name,
        expression: newField.expression,
        type: newField.type || 'string'
      }]
    });
    setNewField({});
    setIsAddingField(false);
  };

  const handleRemoveField = (index: number) => {
    onChange({
      mode: value?.mode || mode || 'visual',
      fields: fields.filter((_, i) => i !== index)
    });
  };

  const handleModeChange = (newMode: 'visual' | 'manual') => {
    setMode(newMode);
    onChange({
      mode: newMode,
      fields: value?.fields || DEFAULT_OUTPUT_FIELDS,
      customExpression: value?.customExpression
    });
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Output Mode</Label>
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'visual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('visual')}
            className="h-8"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visual
          </Button>
          <Button
            variant={mode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('manual')}
            className="h-8"
          >
            <Code className="w-4 h-4 mr-2" />
            Manual
          </Button>
        </div>
      </div>

      {mode === 'visual' ? (
        <div className="space-y-4">
          {/* Output Fields Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Expression</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.expression}</TableCell>
                  <TableCell>{field.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(index)}
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Field Dialog */}
          <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Output Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Output Field</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Field Name</Label>
                  <Input
                    id="name"
                    value={newField.name || ''}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="e.g., status"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expression">Expression</Label>
                  <Input
                    id="expression"
                    value={newField.expression || ''}
                    onChange={(e) => setNewField({ ...newField, expression: e.target.value })}
                    placeholder="e.g., {{$json.status}}"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(type) => setNewField({ ...newField, type: type as OutputField['type'] })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="object">Object</SelectItem>
                      <SelectItem value="array">Array</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingField(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField}>
                  Add Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Custom Expression</Label>
            <Textarea
              value={value?.customExpression || ''}
              onChange={(e) => onChange({
                mode: value?.mode || 'visual',
                fields: value?.fields || DEFAULT_OUTPUT_FIELDS,
                customExpression: e.target.value
              })}
              placeholder="Enter custom JSON expression..."
              className="min-h-[200px] font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
