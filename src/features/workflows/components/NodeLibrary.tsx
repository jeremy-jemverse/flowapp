import { ScrollArea } from '@/components/ui/scroll-area';
import { H4, Subtle } from '@/components/ui/typography';
import { CardComponent as Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Database,
  Globe,
  Code,
  Split,
  Zap,
  FileJson,
  Filter,
  Merge,
  GitBranch,
  Repeat,
  Mail,
  Snowflake,
} from 'lucide-react';

interface NodeType {
  type: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

interface NodeCategory {
  id: string;
  label: string;
  nodes: NodeType[];
}

interface NodeLibraryProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const nodeCategories: NodeCategory[] = [
  {
    id: 'triggers',
    label: 'Triggers',
    nodes: [
      {
        type: 'trigger',
        label: 'Webhook',
        description: 'Start workflow on HTTP request',
        icon: Zap,
        category: 'triggers'
      },
      {
        type: 'schedule',
        label: 'Schedule',
        description: 'Start workflow on schedule',
        icon: Zap,
        category: 'triggers'
      }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    nodes: [
      {
        type: 'postgres',
        label: 'PostgreSQL',
        description: 'Execute PostgreSQL queries',
        icon: Database,
        category: 'integrations'
      },
      {
        type: 'snowflake',
        label: 'Snowflake',
        description: 'Execute Snowflake queries',
        icon: Snowflake,
        category: 'integrations'
      },
      {
        type: 'sendgrid',
        label: 'SendGrid',
        description: 'Send emails via SendGrid',
        icon: Mail,
        category: 'integrations'
      },
      {
        type: 'api',
        label: 'HTTP Request',
        description: 'Make HTTP requests',
        icon: Globe,
        category: 'integrations'
      }
    ]
  },
  {
    id: 'flow',
    label: 'Flow Control',
    nodes: [
      {
        type: 'parallel',
        label: 'Parallel',
        description: 'Execute branches in parallel',
        icon: Split,
        category: 'flow'
      },
      {
        type: 'switch',
        label: 'Switch',
        description: 'Conditional branching',
        icon: GitBranch,
        category: 'flow'
      },
      {
        type: 'loop',
        label: 'Loop',
        description: 'Iterate over data',
        icon: Repeat,
        category: 'flow'
      }
    ]
  },
  {
    id: 'data',
    label: 'Data Processing',
    nodes: [
      {
        type: 'transform',
        label: 'Transform',
        description: 'Transform data structure',
        icon: FileJson,
        category: 'data'
      },
      {
        type: 'filter',
        label: 'Filter',
        description: 'Filter data based on conditions',
        icon: Filter,
        category: 'data'
      },
      {
        type: 'merge',
        label: 'Merge',
        description: 'Combine multiple inputs',
        icon: Merge,
        category: 'data'
      }
    ]
  },
  {
    id: 'code',
    label: 'Code',
    nodes: [
      {
        type: 'function',
        label: 'Function',
        description: 'Custom JavaScript code',
        icon: Code,
        category: 'code'
      }
    ]
  }
];

export function NodeLibrary({ onDragStart }: NodeLibraryProps) {
  return (
    <div className="h-full flex flex-col" data-testid="node-library">
      <div className="p-4 border-b">
        <H4>Node Library</H4>
        <Subtle>Drag nodes to the canvas</Subtle>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="p-4" data-testid="node-categories">
          {nodeCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id} data-testid={`node-category-${category.id}`}>
              <AccordionTrigger className="text-sm">
                {category.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {category.nodes.map((node) => {
                    const Icon = node.icon;
                    return (
                      <Card
                        key={node.type}
                        className="p-3 cursor-move transition-colors hover:bg-accent"
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        data-testid={`node-type-${node.type.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {node.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {node.description}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}