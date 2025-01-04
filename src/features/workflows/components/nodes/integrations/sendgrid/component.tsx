import { memo, useState } from 'react';
import { Mail, Loader2, TestTube } from 'lucide-react';
import { NodeProps, Handle, Position } from 'reactflow';
import { CardComponent as Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { SendGridService, SendGridConfig } from './service';
import { connectionsApi } from '@/features/connections/api';
import { SendGridNodeConfig } from './config';
import { NodeMetadata } from '../../../nodes/types';

interface SendGridNodeProps extends NodeProps {
  data: {
    label: string;
    description?: string;
    config: {
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
    nodeType: 'sendgrid';
    category: 'email';
    metadata: NodeMetadata;
  };
  selected: boolean;
}

export const SendGridNodeComponent = memo(({ data, selected }: SendGridNodeProps) => {
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.config.connection.id) {
      toast({
        title: 'Error',
        description: 'Please configure SendGrid connection first',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    try {
      // Get the connection details first
      const connections = await connectionsApi.getSendGridConnections();
      const connection = connections.find(c => c.id === data.config.connection.id);
      
      if (!connection?.api_key) {
        throw new Error('SendGrid connection not found or missing API key');
      }

      // Create SendGridConfig with API key from connection
      const sendGridConfig: SendGridConfig = {
        apiKey: connection.api_key,
        emailType: data.config.email.type,
        to: data.config.email.to,
        from: data.config.email.from,
        subject: data.config.email.subject,
        ...(data.config.email.type === 'body' && {
          body: {
            html: data.config.email.body?.html,
            text: data.config.email.body?.text,
          },
        }),
        ...(data.config.email.type === 'template' && {
          template: {
            id: data.config.email.template?.id,
            dynamicData: data.config.email.template?.dynamicData,
          },
        }),
      };

      await SendGridService.testEmail(sendGridConfig);
      toast({
        title: 'Success',
        description: 'Test email sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className={cn('w-[200px]', selected && 'ring-2 ring-primary')}>
      <Handle type="target" position={Position.Left} />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">{data.label || 'SendGrid'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Test
              </>
            )}
          </Button>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

SendGridNodeComponent.displayName = 'SendGridNode';

export const SendGridNode = {
  type: 'sendgrid',
  component: SendGridNodeComponent,
  getConfigComponent: () => SendGridNodeConfig,
  defaultData: {
    label: 'SendGrid',
    config: {
      email: {
        type: '',
        to: '',
        from: '',
        subject: '',
        body: {
          html: '',
          text: '',
        },
        template: {
          id: '',
          dynamicData: {},
        },
      },
      connection: {
        id: '',
        apiKey: '',
      },
      category: 'email',
    },
    nodeType: 'sendgrid',
    category: 'email',
    metadata: {},
  },
};
