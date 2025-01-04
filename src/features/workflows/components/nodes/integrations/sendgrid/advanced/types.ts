export interface OutputField {
  name: string;
  expression: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

export interface SendGridNodeData {
  connectionId?: string;
  label?: string;
  description?: string;
  email: {
    type: 'body' | 'template';
    to: string;
    from: string;
    subject: string;
    body?: {
      html?: string;
      text?: string;
    };
    templateId?: string;
    templateData?: Record<string, any>;
  };
  input?: {
    mappings?: Record<string, string>;
  };
  output?: {
    mode: 'visual' | 'manual';
    fields: OutputField[];
    customExpression?: string;
  };
}

export const DEFAULT_OUTPUT_FIELDS: OutputField[] = [
  { name: 'status', expression: '{{$json.status}}', type: 'string' },
  { name: 'messageId', expression: '{{$json.messageId}}', type: 'string' },
  { name: 'to', expression: '{{$json.to}}', type: 'string' },
  { name: 'timestamp', expression: '{{$json.timestamp}}', type: 'string' }
];
