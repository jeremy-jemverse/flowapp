import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PostgresErrorAction } from './types';

interface PostgresOptionsPanelProps {
  value: {
    errorAction: PostgresErrorAction;
    maxRetries?: number;
    parameters?: Record<string, any>;
  };
  onChange: (value: any) => void;
}

export function PostgresOptionsPanel({ value, onChange }: PostgresOptionsPanelProps) {
  const handleChange = (field: string, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>On Error</Label>
        <Select
          value={value.errorAction || 'fail'}
          onValueChange={(v: PostgresErrorAction) => handleChange('errorAction', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fail">Stop Execution</SelectItem>
            <SelectItem value="continue">Continue Execution</SelectItem>
            <SelectItem value="retry">Retry Operation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value.errorAction === 'retry' && (
        <div className="space-y-2">
          <Label>Max Retries</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={value.maxRetries || 3}
            onChange={(e) => handleChange('maxRetries', parseInt(e.target.value, 10))}
          />
        </div>
      )}
    </div>
  );
}