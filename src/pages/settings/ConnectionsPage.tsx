import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  setViewMode,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} from '@/features/connections/connectionSlice';
import { useConnections } from '@/features/connections/hooks/useConnections';
import { useConnectionData } from '@/features/connections/hooks/useConnectionData';
import { useConnectionForm } from '@/features/connections/hooks/useConnectionForm';
import { ConnectionList } from '@/features/connections/components/ConnectionList';
import { ConnectionForm } from '@/features/connections/components/ConnectionForm';
import { H1, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { ConnectionDetails, ConnectionFormData } from '@/features/connections/types';

export default function ConnectionsPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionDetails | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    items,
    viewMode,
    searchQuery,
    sortBy,
    sortOrder,
    isEmpty
  } = useConnections();

  const { isLoading, error, refresh } = useConnectionData();
  const { isSubmitting, handleSubmit } = useConnectionForm(selectedConnection ? 'edit' : 'insert');

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refresh();
      toast({
        title: "Success",
        description: "Connections list refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh connections",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateConnection = () => {
    setSelectedConnection(null);
    setIsEditing(true);
  };

  const handleEditConnection = (connection: ConnectionDetails) => {
    setSelectedConnection(connection);
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
    setSelectedConnection(null);
    refresh();
  };

  const handleSaveConnection = async (data: ConnectionFormData) => {
    const success = await handleSubmit(data);
    if (success) {
      setIsEditing(false);
      setSelectedConnection(null);
      refresh();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <H1>{selectedConnection ? 'Edit Connection' : 'Create New Connection'}</H1>
            <P className="text-muted-foreground mt-1">
              {selectedConnection 
                ? 'Modify your existing connection configuration'
                : 'Configure a new connection to an external service'
              }
            </P>
          </div>
        </div>

        <ConnectionForm
          mode={selectedConnection ? 'edit' : 'insert'}
          initialData={selectedConnection || undefined}
          onSubmit={handleSaveConnection}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          <p className="font-medium">Error loading connections</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H1>Connections</H1>
          <P className="text-muted-foreground mt-1">
            Manage your external service connections and integrations
          </P>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw 
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              data-testid="refresh-icon"
            />
            Refresh
          </Button>
          <Button onClick={handleCreateConnection}>
            <Plus className="mr-2 h-4 w-4" /> Add Connection
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: any) => dispatch(setSortBy(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="connection_name">Name</SelectItem>
            <SelectItem value="connection_category">Type</SelectItem>
            <SelectItem value="last_used">Last Used</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: any) => dispatch(setSortOrder(value))}
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
            onClick={() => dispatch(setViewMode('grid'))}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => dispatch(setViewMode('list'))}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConnectionList
        items={items}
        viewMode={viewMode}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={handleEditConnection}
      />
    </div>
  );
}