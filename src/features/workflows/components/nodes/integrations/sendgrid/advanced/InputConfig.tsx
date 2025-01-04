import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SendGridNodeData } from './types';

interface InputConfigProps {
  value?: SendGridNodeData['input'];
  onChange: (value: SendGridNodeData['input']) => void;
}

export function InputConfig({ value, onChange }: InputConfigProps) {
  const mappings = value?.mappings || {};

  const handleAddMapping = () => {
    onChange({
      ...value,
      mappings: {
        ...mappings,
        '': ''
      }
    });
  };

  const handleRemoveMapping = (key: string) => {
    const newMappings = { ...mappings };
    delete newMappings[key];
    onChange({
      ...value,
      mappings: newMappings
    });
  };

  const handleUpdateMapping = (oldKey: string, newKey: string, newValue: string) => {
    const newMappings = { ...mappings };
    if (oldKey !== newKey) {
      delete newMappings[oldKey];
    }
    newMappings[newKey] = newValue;
    onChange({
      ...value,
      mappings: newMappings
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Input Mappings</Label>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleAddMapping}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {Object.entries(mappings).length === 0 ? (
        <div className="text-sm text-muted-foreground italic">
          No input mappings configured. Click 'Add Mapping' to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(mappings).map(([key, value], index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={key}
                  onChange={(e) => handleUpdateMapping(key, e.target.value, value)}
                  placeholder="Input key"
                  className="h-8"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={value}
                  onChange={(e) => handleUpdateMapping(key, key, e.target.value)}
                  placeholder="Mapped value"
                  className="h-8"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMapping(key)}
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
