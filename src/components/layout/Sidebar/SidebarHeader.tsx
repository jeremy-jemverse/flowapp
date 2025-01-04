import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4">
      <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500">
          <CircleCheck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-medium text-sm text-neutral-200">Client Company</span>
        )}
      </div>
    </div>
  );
}