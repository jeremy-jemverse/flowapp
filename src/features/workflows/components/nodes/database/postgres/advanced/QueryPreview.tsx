import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QueryResult } from './types';
import { CopyIcon, DownloadIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QueryPreviewProps {
  query: string;
  result: QueryResult | undefined;
  isLoading: boolean;
  onRun: () => Promise<void>;
  connectionId: string;
  onDownloadCsv?: () => void;
}

export function QueryPreview({ query, result, isLoading, onRun, connectionId, onDownloadCsv }: QueryPreviewProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!result || result.error) {
    return (
      <div className="text-sm text-destructive">
        {result?.error || 'No results'}
      </div>
    );
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2));
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy data to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'} returned
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="json">JSON View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="min-h-[200px]">
          <div className="rounded-md border">
            <div className="flex justify-end p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadCsv}
                disabled={!result.rows.length}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {result.columns.map((column, i) => (
                      <TableHead key={i}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row, i) => (
                    <TableRow key={i}>
                      {result.columns.map((column, j) => (
                        <TableCell key={j}>
                          {typeof row[column] === 'object' 
                            ? JSON.stringify(row[column]) 
                            : String(row[column] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="json" className="min-h-[200px]">
          <div className="rounded-md border">
            <div className="flex justify-end p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyJson}
                disabled={!result.rows.length}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 mr-2" />
                ) : (
                  <CopyIcon className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy JSON'}
              </Button>
            </div>
            <pre className="p-4 text-sm overflow-auto max-h-[500px] bg-muted/50">
              {JSON.stringify(result.rows, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
