import { DatabaseConnectionForm } from '@/features/connections/components/DatabaseConnectionForm';
import { H2, P } from '@/components/ui/typography';

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <H2>Database Connection</H2>
        <P className="text-muted-foreground">
          Configure and manage your PostgreSQL database connection settings
        </P>
      </div>
      <DatabaseConnectionForm />
    </div>
  );
}