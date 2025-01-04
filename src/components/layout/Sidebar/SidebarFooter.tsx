import { cn } from '@/lib/utils';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500">
          <span className="text-white text-sm font-medium">P</span>
        </div>
        {!collapsed && (
          <span className="font-medium text-sm text-neutral-200">Platform</span>
        )}
      </div>
    </div>
  );
}