import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      title: 'Flows',
      icon: Workflow,
      path: '/workflows',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings/connections',
    },
  ];

  return (
    <div
      className={cn(
        'h-screen bg-card border-r border-border transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={cn('flex items-center gap-2', collapsed && 'hidden')}>
          <Workflow className="h-6 w-6" />
          <span className="font-bold text-lg">WorkflowPro</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-6 bg-background border shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground',
                collapsed && 'justify-center'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;