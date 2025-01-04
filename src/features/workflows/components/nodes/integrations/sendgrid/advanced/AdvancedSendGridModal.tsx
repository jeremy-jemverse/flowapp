import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { SendGridNodeData } from './types';
import { EmailSection } from './EmailSection';
import { InputConfig } from './InputConfig';
import { OutputConfig } from './OutputConfig';
import { ConnectionSelector } from '../selectConnection';
import { connectionsApi } from '@/features/connections/api';
import { useQueryClient } from '@tanstack/react-query';

interface AdvancedSendGridModalProps {
  open: boolean;
  onClose: () => void;
  initialData: SendGridNodeData;
  onSave: (data: Partial<SendGridNodeData>) => void;
  nodeId: string;
}

export function AdvancedSendGridModal({ 
  open, 
  onClose,
  initialData,
  onSave,
  nodeId
}: AdvancedSendGridModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConnectionId, setSelectedConnectionId] = useState(initialData.connectionId || '');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [label, setLabel] = useState(initialData.label || 'SendGrid Email');
  const [description, setDescription] = useState(initialData.description || '');
  const [emailConfig, setEmailConfig] = useState<SendGridNodeData['email']>({
    type: 'body',
    to: '',
    from: '',
    subject: '',
    body: {
      html: '',
      text: ''
    }
  });
  const [activeSection, setActiveSection] = useState<string>("");
  const [connectionConfig, setConnectionConfig] = useState({
    id: initialData.connectionId || '',
    apiKey: ''
  });

  const updateCache = useCallback((updates: Partial<SendGridNodeData>) => {
    queryClient.setQueryData(['node', nodeId], (oldData: any) => {
      if (!oldData) {
        return {
          data: {
            ...initialData,
            ...updates,
          }
        };
      }
      return {
        ...oldData,
        data: {
          ...oldData.data,
          ...updates,
        },
      };
    });
  }, [queryClient, nodeId, initialData]);

  const handleInputChange = useCallback((input: any) => {
    updateCache({ input });
  }, [updateCache]);

  const handleEmailConfigChange = useCallback((email: SendGridNodeData['email']) => {
    setEmailConfig(email);
    updateCache({ email });
  }, [updateCache]);

  const handleConnectionChange = useCallback((connectionId: string) => {
    setSelectedConnectionId(connectionId);
    updateCache({ connectionId });
  }, [updateCache]);

  const handleLabelChange = useCallback((newLabel: string) => {
    setLabel(newLabel);
    updateCache({ label: newLabel });
  }, [updateCache]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    setDescription(newDescription);
    updateCache({ description: newDescription });
  }, [updateCache]);

  const handleSave = useCallback(() => {
    const updatedData = {
      ...initialData,
      label,
      description,
      connectionId: selectedConnectionId,
      email: emailConfig,
    };

    onSave(updatedData);
    onClose();
  }, [label, description, selectedConnectionId, emailConfig, initialData, onSave]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogTitle className="sr-only">SendGrid Email Configuration</DialogTitle>
        <DialogDescription className="sr-only">
          Configure your SendGrid email settings including email type, sender, recipient, and content.
        </DialogDescription>

        {/* Header */}
        <div className="flex-none">
          <div className="flex items-center justify-between p-4 bg-[#252E38]">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-white" />
                <div className="flex flex-col">
                  {isEditingLabel ? (
                    <Input
                      value={label}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      onBlur={() => setIsEditingLabel(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
                      className="h-7"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="font-semibold cursor-pointer text-white"
                      onClick={() => setIsEditingLabel(true)}
                    >
                      {label}
                    </div>
                  )}
                  {isEditingDescription ? (
                    <Textarea
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      onBlur={() => setIsEditingDescription(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingDescription(false)}
                      className="min-h-[60px] text-sm"
                      autoFocus
                    />
                  ) : description ? (
                    <div
                      className="text-sm text-gray-300 cursor-pointer"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      {description}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-400 cursor-pointer italic"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      Add description...
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <ConnectionSelector
                  value={selectedConnectionId}
                  onChange={handleConnectionChange}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <Accordion
              type="single"
              value={activeSection}
              onValueChange={setActiveSection}
              className="space-y-4"
            >
              <AccordionItem
                value="input"
                className="border rounded-lg shadow-sm"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Input</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <InputConfig
                    value={initialData.input}
                    onChange={handleInputChange}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="email"
                className="border rounded-lg shadow-sm"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Email Configuration</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <EmailSection
                    value={emailConfig}
                    onChange={handleEmailConfigChange}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="output"
                className="border rounded-lg shadow-sm"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Output</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <OutputConfig
                    value={initialData.output}
                    onChange={(output) => onSave({ ...initialData, output })}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-none flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label>Connection</Label>
            <ConnectionSelector
              value={selectedConnectionId}
              onChange={handleConnectionChange}
            />
          </div>

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={connectionConfig.apiKey}
              onChange={(e) => setConnectionConfig({ ...connectionConfig, apiKey: e.target.value })}
              placeholder="Enter SendGrid API Key"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
