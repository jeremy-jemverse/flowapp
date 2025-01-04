import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SendGridNodeData } from './types';

interface EmailSectionProps {
  value: SendGridNodeData['email'];
  onChange: (value: SendGridNodeData['email']) => void;
}

export function EmailSection({ value, onChange }: EmailSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Email Type</Label>
        <Select
          value={value.type}
          onValueChange={(type) => onChange({ ...value, type: type as 'body' | 'template' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="body">Custom Body</SelectItem>
            <SelectItem value="template">Template</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>From Email</Label>
        <Input
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          placeholder="from@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>To Email</Label>
        <Input
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          placeholder="to@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Input
          value={value.subject}
          onChange={(e) => onChange({ ...value, subject: e.target.value })}
          placeholder="Email subject"
        />
      </div>

      {value.type === 'body' ? (
        <>
          <div className="space-y-2">
            <Label>HTML Content</Label>
            <Textarea
              value={value.body?.html || ''}
              onChange={(e) => onChange({
                ...value,
                body: { ...value.body, html: e.target.value }
              })}
              placeholder="<html>...</html>"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              value={value.body?.text || ''}
              onChange={(e) => onChange({
                ...value,
                body: { ...value.body, text: e.target.value }
              })}
              placeholder="Plain text version..."
              rows={6}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Template ID</Label>
            <Input
              value={value.templateId || ''}
              onChange={(e) => onChange({ ...value, templateId: e.target.value })}
              placeholder="d-xxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <Label>Template Data (JSON)</Label>
            <Textarea
              value={value.templateData ? JSON.stringify(value.templateData, null, 2) : ''}
              onChange={(e) => {
                try {
                  const templateData = JSON.parse(e.target.value);
                  onChange({ ...value, templateData });
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              placeholder={'{\n  "name": "value"\n}'}
              rows={6}
            />
          </div>
        </>
      )}
    </div>
  );
}
