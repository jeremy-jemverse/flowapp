import { WorkflowNode, BaseNodeConfig, NodeConnection, NodeMetadata } from '../../../../types/workflow';
import { SendGridNodeConfig } from './config';
import { SendGridNodeComponent } from './component';

export interface SendGridEmailConfiguration extends BaseNodeConfig {
  nodeType: 'sendgrid';
  metadata: NodeMetadata;
  inputs: NodeConnection[];
  outputs: NodeConnection[];
  config: {
    label: string;
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
      template?: {
        id: string;
        dynamicData?: Record<string, any>;
      };
    };
    connection: {
      id?: string;
      apiKey?: string;
    };
    category: 'email';
  };
}

export interface SendGridEmailNode extends WorkflowNode<SendGridEmailConfiguration> {
  id: string;
  type: 'sendgrid';
}

export const SendGridNodeDefinition = {
  type: 'sendgrid',
  component: SendGridNodeComponent,
  getConfigComponent: () => SendGridNodeConfig,
  defaultData: {
    nodeType: 'sendgrid' as const,
    label: 'SendGrid Email',
    description: '',
    category: 'email',
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: '1.0.0',
      isValid: false,
      errors: [],
    },
    connections: {
      inputs: [],
      outputs: [],
    },
    inputs: [],
    outputs: [],
    config: {
      label: 'SendGrid Email',
      description: '',
      email: {
        type: 'body',
        to: '',
        from: '',
        subject: '',
        body: {
          html: '',
          text: '',
        },
      },
      connection: {
        id: '',
        apiKey: '',
      },
      category: 'email',
    },
  }
};

export const createSendGridEmailNode = (
  id: string,
  position: { x: number; y: number },
  existingData?: Partial<SendGridEmailNode>
): SendGridEmailNode => {
  const defaultData = SendGridNodeDefinition.defaultData;
  
  return {
    id,
    type: 'sendgrid',
    position,
    data: {
      nodeType: 'sendgrid',
      label: defaultData.label,
      description: defaultData.description,
      category: defaultData.category,
      metadata: {
        ...defaultData.metadata
      },
      inputs: defaultData.inputs,
      outputs: defaultData.outputs,
      config: {
        label: defaultData.label,
        description: defaultData.description,
        category: 'email',
        email: {
          type: 'body',
          to: '',
          from: '',
          subject: '',
          body: {
            html: '',
            text: '',
          }
        },
        connection: {
          id: '',
          apiKey: '',
        },
        ...existingData?.data?.config,
      },
      ...existingData?.data,
    }
  };
};
