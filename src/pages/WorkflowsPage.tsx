import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setViewMode,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} from '@/features/workflows/workflowSlice';
import { useWorkflowList } from '@/features/workflows/hooks/useWorkflowList';
import { WorkflowList } from '@/features/workflows/components/WorkflowList';
import { WorkflowForm } from '@/features/workflows/components/WorkflowForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { H1, P } from '@/components/ui/typography';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { WorkflowListItem } from '@/features/workflows/services/workflow-list.service';

export default function WorkflowsPage() {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowListItem | undefined>(undefined);
  const { items, isLoading, error, refresh } = useWorkflowList();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortByValue] = useState<string>('created_at');
  const [sortOrder, setSortOrderValue] = useState<'asc' | 'desc'>('desc');

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(undefined);
    setIsEditing(true);
  };

  const handleEditWorkflow = (workflow: WorkflowListItem) => {
    setSelectedWorkflow(workflow);
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
    setSelectedWorkflow(undefined);
    refresh(); // Refresh the list when returning
  };

  // Filter and sort workflows
  const filteredWorkflows = items
    .filter(workflow => {
      const searchLower = (searchQuery || '').toLowerCase();
      return (
        (workflow.name?.toLowerCase() || '').includes(searchLower) ||
        (workflow.description?.toLowerCase() || '').includes(searchLower) ||
        workflow.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof WorkflowListItem] || '';
      const bValue = b[sortBy as keyof WorkflowListItem] || '';
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <H1>{selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</H1>
            <P className="text-muted-foreground mt-1">
              {selectedWorkflow 
                ? 'Modify your existing workflow configuration'
                : 'Design your workflow using the visual builder'
              }
            </P>
          </div>
        </div>
        <WorkflowForm 
          mode={selectedWorkflow ? 'edit' : 'insert'}
          initialData={selectedWorkflow}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H1>Workflows</H1>
          <P className="text-muted-foreground mt-1">
            Create and manage your workflow templates
          </P>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="mr-2 h-4 w-4" /> Create Workflow
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={setSortByValue}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flow_name">Name</SelectItem>
            <SelectItem value="created_at">Created Date</SelectItem>
            <SelectItem value="flow_type">Type</SelectItem>
            <SelectItem value="amount_of_nodes">Nodes</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: 'asc' | 'desc') => setSortOrderValue(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <WorkflowList
        items={filteredWorkflows}
        viewMode={viewMode}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={handleEditWorkflow}
      />
    </div>
  );
}