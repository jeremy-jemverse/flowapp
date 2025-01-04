import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Move,
  Users,
  Search,
  Building2,
  Network,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'My work',
    icon: Briefcase,
    path: '/work',
  },
  {
    title: 'Moves',
    icon: Move,
    path: '/moves',
    submenu: [
      {
        title: 'Active Moves',
        path: '/moves/active',
      },
      {
        title: 'Completed',
        path: '/moves/completed',
      }
    ]
  },
  {
    title: 'Talent',
    icon: Users,
    path: '/talent',
  },
  {
    title: 'Discovery',
    icon: Search,
    path: '/discovery',
  },
  {
    title: 'Company',
    icon: Building2,
    path: '/company',
  },
];

const connectionsMenu = {
  title: 'Connections',
  icon: Network,
  path: '/settings/connections',
};

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    if (openSubmenu === path) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(path);
    }
  };

  return (
    <nav className="px-3 py-2">
      {menuItems.map((item) => (
        <div key={item.path}>
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
              'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800',
              location.pathname === item.path && 'text-neutral-100 bg-neutral-800',
              collapsed && 'justify-center'
            )}
            onClick={() => item.submenu && handleMenuClick(item.path)}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.submenu && (
                  openSubmenu === item.path ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </div>
          {!collapsed && item.submenu && openSubmenu === item.path && (
            <div className="ml-4 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={subItem.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                      'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800',
                      isActive && 'text-neutral-100 bg-neutral-800'
                    )
                  }
                >
                  <span>{subItem.title}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}

      <NavLink
        to={connectionsMenu.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mt-2',
            'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800',
            isActive && 'text-neutral-100 bg-neutral-800',
            collapsed && 'justify-center'
          )
        }
      >
        <connectionsMenu.icon className="h-5 w-5" />
        {!collapsed && <span>{connectionsMenu.title}</span>}
      </NavLink>
    </nav>
  );
}