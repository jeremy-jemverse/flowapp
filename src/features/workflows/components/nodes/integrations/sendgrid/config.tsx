import { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, TestTube, Bot } from 'lucide-react';
import { SendGridService } from './service';
import { useToast } from '@/hooks/use-toast';
import { NodeData, NodeProperties } from '@/features/workflows/components/nodes/types';
import { WorkflowNode, BaseNodeConfig } from '@/features/workflows/types/workflow';
import { ConnectionSelector } from './selectConnection';
import { connectionsApi } from '@/features/connections/api';
import { AIEmailEditor } from './AIEmailEditor';
import { SendGridNodeDefinition } from './types';
import { AdvancedSendGridModal } from './advanced/AdvancedSendGridModal';
import { SendGridNodeData } from './advanced/types';

interface SendGridNodeConfigProps {
  node: Node<NodeData & { nodeType: 'sendgrid' }> & Partial<NodeProperties> & WorkflowNode<BaseNodeConfig>;
  onChange: (data: Partial<NodeData>) => void;
}

interface SendGridNodeConfig {
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
    id: string;
    apiKey: string;
  };
  category: 'email';
  label: string;
}

export function SendGridNodeConfig({ node, onChange }: SendGridNodeConfigProps) {
  console.log('[SendGridNodeConfig][INIT] Component initializing with:', {
    node,
    nodeData: node.data,
    nodeConfig: node.data?.config,
    hasConfig: !!node.data?.config,
  });

  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [isAIEditorOpen, setIsAIEditorOpen] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  
  // Initialize config with cached values or defaults
  const [config, setConfig] = useState<SendGridNodeConfig>(() => {
    const defaultConfig = SendGridNodeDefinition.defaultData.config;
    const existingConfig = node.data?.config || {};
    
    console.log('[SendGridNodeConfig][STATE] Initializing config state:', {
      defaultConfig,
      existingConfig,
      mergedConfig: {
        ...defaultConfig,
        ...existingConfig,
        email: {
          ...defaultConfig.email,
          ...existingConfig.email,
        },
        connection: {
          ...defaultConfig.connection,
          ...existingConfig.connection,
        }
      }
    });

    return {
      ...defaultConfig,
      ...existingConfig,
      category: 'email',
      email: {
        ...defaultConfig.email,
        ...existingConfig.email,
      },
      connection: {
        ...defaultConfig.connection,
        ...existingConfig.connection,
      },
    };
  });

  // Initialize config with parent when component mounts
  useEffect(() => {
    console.log('[SendGridNodeConfig][INIT] Initializing parent with config:', {
      nodeData: node.data,
      config,
      mergedData: {
        ...node.data,
        config,
      }
    });
    
    onChange({
      ...node.data,
      config,
    });
  }, []); // Only run once on mount

  // Update config when node data changes
  useEffect(() => {
    if (!node.data?.config) return;

    const newConfig = node.data.config;
    console.log('[SendGridNodeConfig][UPDATE] Node data changed:', {
      newData: node.data,
      newConfig,
      currentConfig: config,
      hasEmail: newConfig?.email !== undefined,
      hasConnection: newConfig?.connection !== undefined,
    });

    // Create a new config object with the new values, properly handling empty strings
    const updatedConfig = {
      email: {
        type: newConfig.email?.type ?? config.email.type,
        to: newConfig.email?.to ?? config.email.to,
        from: newConfig.email?.from ?? config.email.from,
        subject: newConfig.email?.subject ?? config.email.subject,
        body: {
          html: newConfig.email?.body?.html ?? config.email.body?.html ?? '',
          text: newConfig.email?.body?.text ?? config.email.body?.text ?? '',
        },
        template: newConfig.email?.template,
      },
      connection: {
        id: newConfig.connection?.id ?? config.connection.id,
        apiKey: newConfig.connection?.apiKey ?? config.connection.apiKey,
      },
      category: 'email' as const,
      label: newConfig.label ?? 'SendGrid Email',
    };

    console.log('[SendGridNodeConfig][UPDATE] Updated config:', {
      previous: config,
      updated: updatedConfig,
      diff: {
        email: {
          type: {
            from: config.email.type,
            to: updatedConfig.email.type
          },
          to: {
            from: config.email.to,
            to: updatedConfig.email.to
          },
          from: {
            from: config.email.from,
            to: updatedConfig.email.from
          },
          subject: {
            from: config.email.subject,
            to: updatedConfig.email.subject
          },
          body: {
            html: {
              from: config.email.body?.html,
              to: updatedConfig.email.body?.html
            },
            text: {
              from: config.email.body?.text,
              to: updatedConfig.email.body?.text
            }
          },
          template: {
            from: config.email.template,
            to: updatedConfig.email.template
          }
        },
        connection: {
          id: {
            from: config.connection.id,
            to: updatedConfig.connection.id
          },
          apiKey: {
            from: config.connection.apiKey,
            to: updatedConfig.connection.apiKey
          }
        }
      }
    });

    // Only update if there are actual changes
    if (JSON.stringify(config) !== JSON.stringify(updatedConfig)) {
      console.log('[SendGridNodeConfig][UPDATE] Setting updated config:', {
        updatedConfig,
        emailFields: updatedConfig.email,
        connectionFields: updatedConfig.connection
      });
      
      setConfig(updatedConfig);
    }
  }, [node.data?.config]); // Only watch config changes, not all node.data

  // Handle local config changes
  const handleConfigChange = useCallback((field: keyof SendGridNodeConfig, value: any) => {
    console.log('[SendGridNodeConfig][CHANGE] Field change:', {
      field,
      value,
      currentConfig: config
    });

    const newConfig = {
      ...config,
      [field]: value,
    };

    console.log('[SendGridNodeConfig][CHANGE] Updated config:', {
      previous: config,
      updated: newConfig,
      diff: {
        [field]: {
          from: config[field],
          to: value
        }
      }
    });

    setConfig(newConfig);
    
    // Notify parent of the change without including all node.data
    onChange({
      config: newConfig,
    });
  }, [config, onChange]);

  // Handle email config changes
  const handleEmailConfigChange = useCallback((field: keyof typeof config.email, value: string) => {
    console.log('[SendGridNodeConfig][EMAIL] Field change:', {
      field,
      value,
      currentConfig: config
    });

    const newConfig = {
      ...config,
      email: {
        ...config.email,
        [field]: value
      }
    };

    console.log('[SendGridNodeConfig][EMAIL] Updated config:', {
      previous: config,
      updated: newConfig,
      diff: {
        email: {
          [field]: {
            from: config.email[field],
            to: value
          }
        }
      }
    });

    setConfig(newConfig);
    
    // Notify parent of the change with flattened config
    onChange({
      config: {
        ...newConfig,
        category: 'email',
        label: node.data?.label || 'SendGrid Email'
      }
    });
  }, [config, onChange, node.data?.label]);

  // Handle body changes
  const handleBodyChange = useCallback((field: 'html' | 'text', value: string) => {
    console.log('[SendGridNodeConfig][BODY] Field change:', {
      field,
      value,
      currentConfig: config
    });

    const newConfig = {
      ...config,
      email: {
        ...config.email,
        body: {
          ...config.email.body,
          [field]: value,
        }
      }
    };

    console.log('[SendGridNodeConfig][BODY] Updated config:', {
      previous: config,
      updated: newConfig,
      diff: {
        email: {
          body: {
            [field]: {
              from: config.email.body?.[field],
              to: value
            }
          }
        }
      }
    });

    setConfig(newConfig);
    
    // Notify parent of the change
    onChange({
      category: 'sendgrid',
      config: {
        ...newConfig,
        category: 'email'
      }
    });
  }, [config, onChange]);

  // Handle connection changes
  const handleConnectionChange = useCallback((connectionId: string, apiKey: string) => {
    console.log('[SendGridNodeConfig][CONNECTION] Connection change:', {
      connectionId,
      apiKey,
      currentConfig: config
    });

    const newConfig = {
      ...config,
      connection: {
        id: connectionId,
        apiKey
      }
    };

    console.log('[SendGridNodeConfig][CONNECTION] Updated config:', {
      previous: config,
      updated: newConfig,
      diff: {
        connection: {
          id: {
            from: config.connection.id,
            to: connectionId
          },
          apiKey: {
            from: config.connection.apiKey,
            to: apiKey
          }
        }
      }
    });

    setConfig(newConfig);
    onChange({
      category: 'sendgrid',
      config: {
        ...newConfig,
        category: 'email'
      }
    });
  }, [config, onChange]);

  // Load API key for existing connection on mount
  useEffect(() => {
    const loadConnectionDetails = async () => {
      const connectionId = config.connection.id;
      if (!connectionId) return;

      try {
        const connections = await connectionsApi.getSendGridConnections();
        const selectedConnection = connections.find(conn => conn.id === connectionId);
        
        if (!selectedConnection) return;

        const apiKey = selectedConnection.api_key || '';
        
        console.log('[SendGridNodeConfig][CONNECTION] Loaded connection details:', {
          connectionId,
          apiKey,
          currentConfig: config
        });

        const newConfig = {
          ...config,
          connection: {
            id: connectionId,
            apiKey,
          },
        };

        console.log('[SendGridNodeConfig][CONNECTION] Updated config:', {
          previous: config,
          updated: newConfig,
          diff: {
            connection: {
              id: {
                from: config.connection.id,
                to: connectionId
              },
              apiKey: {
                from: config.connection.apiKey,
                to: apiKey
              }
            }
          }
        });

        setConfig(newConfig);
      } catch (error) {
        console.error('Failed to load initial connection details:', error);
      }
    };

    loadConnectionDetails();
  }, []); // Run only on mount

  const handleAIEditorSave = (body: string) => {
    console.log('[SendGridNodeConfig][AI_EDITOR] AI editor save:', {
      body,
      currentConfig: config
    });

    const newConfig = {
      ...config,
      email: {
        ...config.email,
        body: {
          ...config.email.body,
          text: body
        }
      }
    };

    console.log('[SendGridNodeConfig][AI_EDITOR] Updated config:', {
      previous: config,
      updated: newConfig,
      diff: {
        email: {
          body: {
            text: {
              from: config.email.body?.text,
              to: body
            }
          }
        }
      }
    });

    setConfig(newConfig);
    onChange({
      config: newConfig
    });
  };

  const handleTest = async () => {
    try {
      setIsTesting(true);
      await SendGridService.testEmail({
        apiKey: config.connection.apiKey || '',
        emailType: config.email.type,
        to: config.email.to,
        from: config.email.from,
        subject: config.email.subject,
        text: config.email.body?.text,
        html: config.email.body?.html,
        templateId: config.email.template?.id,
        dynamicTemplateData: config.email.template?.dynamicData
      });
      toast({
        title: 'Connection Test Successful',
        description: 'Successfully connected to SendGrid API',
      });
    } catch (error) {
      toast({
        title: 'Connection Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>SendGrid Connection</Label>
        <ConnectionSelector
          value={config.connection.id}
          onChange={(connectionId) => handleConnectionChange(connectionId, '')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          value={config.connection.apiKey || ''}
          onChange={(e) => handleConfigChange('connection', {
            ...config.connection,
            apiKey: e.target.value
          })}
          placeholder="SendGrid API Key"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Email Configuration</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedModal(true)}
          >
            Advanced Configuration
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Email Type</Label>
          <Select
            value={config.email.type}
            onValueChange={(value) => handleEmailConfigChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select email type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="body">Direct Body</SelectItem>
              <SelectItem value="template">Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            value={config.email.to}
            onChange={(e) => handleEmailConfigChange('to', e.target.value)}
            placeholder="Recipient email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            value={config.email.from}
            onChange={(e) => handleEmailConfigChange('from', e.target.value)}
            placeholder="Sender email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={config.email.subject}
            onChange={(e) => handleEmailConfigChange('subject', e.target.value)}
            placeholder="Email subject"
          />
        </div>

        {config.email.type === 'body' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="html">HTML Content</Label>
              <Textarea
                id="html"
                value={config.email.body?.html || ''}
                onChange={(e) => handleBodyChange('html', e.target.value)}
                placeholder="HTML content"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="text">Text Content</Label>
              <div className="relative">
                <Textarea
                  id="text"
                  value={config.email.body?.text || ''}
                  onChange={(e) => handleBodyChange('text', e.target.value)}
                  placeholder="Text content"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 left-2 h-6 w-6"
                  onClick={() => setIsAIEditorOpen(true)}
                >
                  <Bot className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {config.email.type === 'template' && (
          <div className="space-y-2">
            <Label htmlFor="templateId">Template ID</Label>
            <Input
              id="templateId"
              value={config.email.template?.id || ''}
              onChange={(e) => {
                handleConfigChange('email', {
                  ...config.email,
                  template: {
                    ...config.email.template,
                    id: e.target.value
                  }
                });
              }}
              placeholder="SendGrid template ID"
            />
          </div>
        )}
      </div>

      <AIEmailEditor
        isOpen={isAIEditorOpen}
        onClose={() => setIsAIEditorOpen(false)}
        emailData={{
          to: config.email.to,
          from: config.email.from,
          subject: config.email.subject,
          body: config.email.body?.text || '',
        }}
        onSave={handleAIEditorSave}
      />

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
            Test Connection
          </>
        )}
      </Button>

      <AdvancedSendGridModal
        open={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        initialData={{
          ...node.data,
          email: node.data?.config?.email || {
            type: 'body',
            to: '',
            from: '',
            subject: '',
            body: { html: '', text: '' }
          }
        } as SendGridNodeData}
        nodeId={node.id}
        onSave={(updatedData) => {
          onChange(updatedData);
          setShowAdvancedModal(false);
        }}
      />
    </div>
  );
}