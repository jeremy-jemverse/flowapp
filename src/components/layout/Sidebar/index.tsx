import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'relative h-screen transition-all duration-300',
        'bg-[#1C1F26] border-r border-neutral-800',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      <SidebarHeader collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 bg-[#1C1F26] border border-neutral-800 hover:bg-neutral-800"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-neutral-400" />
        )}
      </Button>
    </div>
  );
}