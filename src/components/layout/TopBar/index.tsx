import { ThemeToggle } from "./ThemeToggle";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import { H3, Label } from "@/components/ui/typography";

export function TopBar() {
  return (
    <div className="border-b border-neutral-800 bg-[#1C1F26]">
      <div className="flex h-16 items-center px-4">
        <div>
          <H3 className="text-neutral-100">Dashboard</H3>
          <Label className="text-neutral-400">Welcome back to your workspace</Label>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}