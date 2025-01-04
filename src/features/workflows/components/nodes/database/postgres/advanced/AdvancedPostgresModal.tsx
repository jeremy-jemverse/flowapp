import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PostgresConnectionSelect } from '../PostgresConnectionSelect';
import { Settings2, X, ChevronRight, Pencil, Copy, Download } from 'lucide-react';
import { QueryBuilder } from './QueryBuilder';
import { OutputConfig } from './OutputConfig';
import { InputConfig } from './InputConfig';
import { OutputFormat } from './types';
import { PostgresNodeData } from '../types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PostgresService } from '@/lib/services/database/postgres.service';
import { useToast } from '@/components/ui/use-toast';
import { usePostgresConnections } from '../hooks/usePostgresConnections';

interface AdvancedPostgresModalProps {
  open: boolean;
  onClose: () => void;
  initialData: PostgresNodeData;
  onSave: (data: Partial<PostgresNodeData>) => void;
  nodeId: string;
}

export function AdvancedPostgresModal({ 
  open, 
  onClose,
  initialData,
  onSave,
  nodeId
}: AdvancedPostgresModalProps) {
  const { toast } = useToast();
  const { connections, isLoading: isLoadingConnections } = usePostgresConnections();
  const [selectedConnectionId, setSelectedConnectionId] = useState(initialData.connectionId);
  const [showConfig, setShowConfig] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [label, setLabel] = useState(initialData.label || 'Postgres Query');
  const [description, setDescription] = useState(initialData.description || '');
  const [query, setQuery] = useState(initialData.query || '');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string[]>(["query"]);
  const [activeTab, setActiveTab] = useState<'grid' | 'json'>('grid');
  const [format, setFormat] = useState<OutputFormat>('single');
  const [outputFields, setOutputFields] = useState<string[]>([]);
  const [queryDuration, setQueryDuration] = useState<number>(0);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [parameters, setParameters] = useState(initialData.parameters || []);
  const [parameterMode, setParameterMode] = useState<'visual' | 'manual'>('visual');
  const selectedConnection = connections.find(conn => conn.id === selectedConnectionId);

  useEffect(() => {
    if (selectedConnection) {
      PostgresService.getTables({
        host: selectedConnection.host_name,
        port: selectedConnection.port,
        database: selectedConnection.database_name,
        user: selectedConnection.conn_user,
        password: selectedConnection.conn_password,
        ssl: selectedConnection.ssl
      })
      .then(tables => setAvailableTables(tables))
      .catch(error => {
        console.error('Failed to fetch tables:', error);
        toast({
          variant: "destructive",
          title: "Error fetching tables",
          description: error instanceof Error ? error.message : "Failed to fetch available tables"
        });
      });
    }
  }, [selectedConnection]);

  const handleGenerateQuery = async (prompt: string) => {
    // TODO: Implement query generation
    return 'SELECT * FROM users;';
  };

  const executeQuery = async () => {
    if (!selectedConnection) {
      toast({
        title: "Error",
        description: "No connection selected",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setQueryResult(null);
    const startTime = performance.now();

    try {
      const result = await PostgresService.executeQuery(query, {
        host: selectedConnection.host_name,
        port: selectedConnection.port,
        database: selectedConnection.database_name,
        user: selectedConnection.conn_user,
        password: selectedConnection.conn_password,
        ssl: selectedConnection.ssl
      });

      const endTime = performance.now();
      setQueryDuration(endTime - startTime);

      // Store the API response with metadata
      const queryResultData = {
        rows: Array.isArray(result) ? result : [],
        columns: Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && result[0] !== null ? Object.keys(result[0]) : []
      };

      setQueryResult(queryResultData);
    } catch (error) {
      console.error('Error executing query:', error);
      
      // Store error response
      setQueryResult({
        rows: [],
        columns: [],
        rowCount: 0,
        error: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'An unknown error occurred'
      });

      toast({
        variant: "destructive",
        title: "Error executing query",
        description: error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave({
      label,
      description,
      query,
      connectionId: selectedConnectionId,
      options: {
        parameters,
        errorAction: 'fail'
      }
    });
    onClose();
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(queryResult, null, 2));
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy JSON to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCsv = () => {
    if (!queryResult?.rows?.length) return;
    
    // Convert rows to CSV
    const headers = queryResult.columns;
    const csvContent = [
      headers.join(','),
      ...queryResult.rows.map((row: Record<string, any>) => 
        headers.map((header: string) => {
          const value = row[header];
          // Handle special cases
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col p-0 gap-0 bg-[#0A0F1C] text-white">
        {/* Header */}
        <div className="flex flex-col border-b border-border/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                {isEditingLabel ? (
                  <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={() => setIsEditingLabel(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
                    className="max-w-[300px]"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{label}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setIsEditingLabel(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {isEditingDescription ? (
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => setIsEditingDescription(false)}
                    className="min-h-[60px] text-sm"
                    placeholder="Add a description..."
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {description || 'Add a description...'}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PostgresConnectionSelect
                value={selectedConnectionId}
                onChange={setSelectedConnectionId}
                className="w-[200px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConfig(!showConfig)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Accordion Sections */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Accordion
            type="multiple"
            value={activeSection}
            onValueChange={setActiveSection}
            className="flex-1 overflow-auto"
          >
            {/* Input Section */}
            <AccordionItem value="input" className="border-b border-border/20">
              <AccordionTrigger className="bg-blue-500/5 hover:bg-blue-500/10 px-4 py-3 group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 text-blue-500">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </div>
                  <span className="font-medium text-blue-500">Input Data</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <Tabs defaultValue="schema" className="w-full">
                    <TabsList>
                      <TabsTrigger value="schema">Schema</TabsTrigger>
                      <TabsTrigger value="table">Table</TabsTrigger>
                      <TabsTrigger value="json">JSON</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="schema" className="mt-4">
                      <div className="space-y-4">
                        <div className="rounded-lg border border-border/20 bg-card p-4">
                          <h4 className="text-sm font-medium mb-2">Available Tables</h4>
                          {isLoadingConnections ? (
                            <div className="text-sm text-muted-foreground">Loading tables...</div>
                          ) : availableTables.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground mb-2">
                                Click a table to generate a basic SELECT query
                              </div>
                              {availableTables.map((table, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center gap-2 text-sm p-2 hover:bg-accent rounded-md cursor-pointer group"
                                  onClick={() => {
                                    setQuery(`SELECT * FROM "${table}" LIMIT 100;`);
                                    setActiveSection(["query"]);
                                  }}
                                >
                                  <span className="group-hover:text-accent-foreground">{table}</span>
                                  <span className="text-xs text-muted-foreground ml-auto group-hover:text-accent-foreground">Click to query</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">
                                {selectedConnection 
                                  ? 'No tables found in public schema. Make sure you have the correct permissions.' 
                                  : 'Select a connection to view available tables'}
                              </div>
                              {selectedConnection && (
                                <div className="text-sm text-muted-foreground">
                                  You can still write custom queries in the Query tab.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="rounded-lg border border-border/20 bg-card p-4">
                          <h4 className="text-sm font-medium mb-2">Selected Fields</h4>
                          {/* Add field selection here */}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="table" className="mt-4">
                      {/* Table input view */}
                    </TabsContent>
                    
                    <TabsContent value="json" className="mt-4">
                      {/* JSON input view */}
                    </TabsContent>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Query Testing Section */}
            <AccordionItem value="query" className="border-b border-border/20">
              <AccordionTrigger className="bg-purple-500/5 hover:bg-purple-500/10 px-4 py-3 group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-500">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </div>
                  <span className="font-medium text-purple-500">Query Builder</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <QueryBuilder
                        value={query}
                        onChange={setQuery}
                        onGenerateQuery={handleGenerateQuery}
                        onRun={executeQuery}
                        isLoading={isLoading}
                        queryResult={queryResult}
                        connectionId={initialData.connectionId}
                      />
                    </div>
                    <div className="rounded-lg border border-border/20 bg-card p-4">
                      <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                      {/* Add parameter inputs here */}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={executeQuery}>
                        Test Query
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Parameters Section */}
            <AccordionItem value="parameters">
              <AccordionTrigger>
                Parameters
              </AccordionTrigger>
              <AccordionContent>
                <InputConfig
                  query={query}
                  parameters={parameters}
                  onChange={setParameters}
                  mode={parameterMode}
                  onModeChange={setParameterMode}
                  nodeId={nodeId}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Output Section */}
            <AccordionItem value="output" className="border-b border-border/20">
              <AccordionTrigger className="bg-green-500/5 hover:bg-green-500/10 px-4 py-3 group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/10 text-green-500">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </div>
                  <span className="font-medium text-green-500">Output</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Query Results</h3>
                    {queryResult && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {queryResult.rows?.length || 0} rows
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfig(!showConfig)}
                        >
                          Configure Output
                        </Button>
                      </div>
                    )}
                  </div>

                  {isLoading && (
                    <div className="text-center p-4">
                      <div className="text-sm text-muted-foreground">Running query...</div>
                    </div>
                  )}

                  {!isLoading && !queryResult && (
                    <div className="text-center p-4">
                      <div className="text-sm text-muted-foreground">
                        No results to display. Run a query to see the output.
                      </div>
                    </div>
                  )}
                  
                  {!isLoading && queryResult && 'error' in queryResult && (
                    <div className="text-center p-4">
                      <div className="text-sm text-red-500">
                        {queryResult.error}
                      </div>
                    </div>
                  )}
                  
                  {!isLoading && queryResult && !('error' in queryResult) && (
                    <div className="rounded-lg border border-border/20 overflow-hidden">
                      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'grid' | 'json')} className="w-full">
                        <div className="px-4 pt-4">
                          <TabsList className="w-full justify-start">
                            <TabsTrigger value="grid">Grid View</TabsTrigger>
                            <TabsTrigger value="json">JSON View</TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent value="grid" className="m-0">
                          <div className="p-4">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadCsv}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download CSV
                              </Button>
                            </div>
                            <ScrollArea className="h-[400px] w-full">
                              <Table>
                                {queryResult?.columns && queryResult.rows && (
                                  <>
                                    <TableHeader>
                                      <TableRow>
                                        {queryResult.columns.map((column: string, index: number) => (
                                          <TableHead key={index}>{column}</TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {queryResult.rows.map((row: Record<string, any>, rowIndex: number) => (
                                        <TableRow key={rowIndex}>
                                          {queryResult.columns.map((col: string, colIndex: number) => (
                                            <TableCell key={colIndex}>
                                              {JSON.stringify(row[col], null, 2)}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </>
                                )}
                              </Table>
                            </ScrollArea>
                          </div>
                        </TabsContent>

                        <TabsContent value="json" className="m-0">
                          <div className="p-4">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyJson}
                                className="flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy JSON
                              </Button>
                            </div>
                            <ScrollArea className="h-[400px] w-full">
                              <pre className="text-sm">
                                {queryResult ? JSON.stringify(queryResult, null, 2) : ''}
                              </pre>
                            </ScrollArea>
                          </div>
                        </TabsContent>

                        <div className="border-t border-border/20 p-4 flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            {!('error' in queryResult) && `${queryResult?.rows?.length || 0} ${queryResult?.rows?.length === 1 ? 'row' : 'rows'} retrieved`}
                            {'error' in queryResult && 'Query failed'}
                          </span>
                          <span>
                            Query duration: {queryDuration.toFixed(2)}ms
                          </span>
                        </div>
                      </Tabs>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border/20">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
