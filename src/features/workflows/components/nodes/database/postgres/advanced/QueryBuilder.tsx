import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Code, Play, Loader2 } from 'lucide-react';
import { QueryBuilderProps } from './types';
import { QueryPreview } from './QueryPreview';
import { cn } from '@/lib/utils';

export function QueryBuilder({ 
  value, 
  onChange, 
  onGenerateQuery,
  onRun,
  isLoading,
  queryResult,
  connectionId // Add connectionId prop to QueryBuilder component
}: QueryBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'assistant' | 'sql'>('assistant');

  const handleGenerate = async () => {
    if (!prompt.trim() || !onGenerateQuery) return;
    
    try {
      const query = await onGenerateQuery(prompt);
      onChange(query);
      setPrompt(''); // Clear the prompt after successful generation
    } catch (error) {
      console.error('Failed to generate query:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-border/20">
        <Button
          variant={mode === 'assistant' ? 'secondary' : 'ghost'}
          size="sm"
          className="gap-2"
          onClick={() => setMode('assistant')}
        >
          <MessageSquare className="h-4 w-4" />
          Query Assistant
        </Button>
        <Button
          variant={mode === 'sql' ? 'secondary' : 'ghost'}
          size="sm"
          className="gap-2"
          onClick={() => setMode('sql')}
        >
          <Code className="h-4 w-4" />
          SQL Editor
        </Button>
      </div>

      {/* Query Input Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          {mode === 'assistant' ? (
            <Textarea
              placeholder="Describe what data you want to query in plain English..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              className="w-full min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 text-base"
            />
          ) : (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="SELECT * FROM table WHERE condition;"
              className="w-full min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 font-mono text-sm"
            />
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 border-t border-border/20">
          <QueryPreview
            query={value}
            result={queryResult}
            isLoading={isLoading}
            onRun={onRun}
            connectionId={connectionId}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex justify-between items-center border-t border-border/20">
        <div className="text-sm text-muted-foreground">
          {mode === 'assistant' ? 'Press Enter to generate SQL' : 'Write your SQL query directly'}
        </div>
        <div className="flex gap-2">
          {mode === 'assistant' && (
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              size="sm"
            >
              Generate SQL
            </Button>
          )}
          <Button
            onClick={onRun}
            disabled={!value.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Query
          </Button>
        </div>
      </div>
    </div>
  );
}
