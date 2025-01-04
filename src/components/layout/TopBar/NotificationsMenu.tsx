import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col gap-1">
            <span className="font-medium">New workflow created</span>
            <span className="text-sm text-muted-foreground">2 minutes ago</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Task completed</span>
            <span className="text-sm text-muted-foreground">1 hour ago</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}