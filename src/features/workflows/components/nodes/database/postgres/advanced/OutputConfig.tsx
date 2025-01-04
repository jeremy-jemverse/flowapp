import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { OutputConfigProps, OutputFormat } from './types';

export function OutputConfig({ format, onFormatChange, outputFields, onOutputFieldsChange }: OutputConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Output Format</Label>
        <Select value={format} onValueChange={(value) => onFormatChange(value as OutputFormat)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Value</SelectItem>
            <SelectItem value="array">Array of Records</SelectItem>
            <SelectItem value="dataset">Full Dataset</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Output Fields</Label>
        <div className="flex flex-wrap gap-2">
          {outputFields.map((field, index) => (
            <Badge key={index} variant="secondary">
              {field}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
