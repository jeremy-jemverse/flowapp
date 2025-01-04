import { Outlet } from 'react-router-dom';
import { H1, P } from '@/components/ui/typography';

export default function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <H1>Settings</H1>
        <P className="text-muted-foreground">
          Manage your application settings and configurations
        </P>
      </div>
      <Outlet />
    </div>
  );
}