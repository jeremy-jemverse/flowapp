import { CardComponent as Card } from '@/components/ui/card';
import { H1, H3, P } from '@/components/ui/typography';
import { BarChart3, Users, Workflow, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Workflows',
      value: '24',
      change: '+12%',
      icon: Workflow,
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+3.2%',
      icon: Users,
    },
    {
      title: 'Completion Rate',
      value: '92%',
      change: '+5.4%',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <H1>Dashboard</H1>
        <P className="text-muted-foreground mt-2">
          Welcome back to your workflow management dashboard
        </P>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-500">
                  {stat.change}
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <P className="text-4xl font-bold">{stat.value}</P>
                <P className="text-sm text-muted-foreground mt-1">{stat.title}</P>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <H3>Recent Activity</H3>
          <div className="mt-4 space-y-4">
            {/* Activity items will go here */}
            <P className="text-muted-foreground">No recent activity to display</P>
          </div>
        </Card>

        <Card className="p-6">
          <H3>Quick Actions</H3>
          <div className="mt-4 space-y-4">
            {/* Quick action buttons will go here */}
            <P className="text-muted-foreground">No quick actions available</P>
          </div>
        </Card>
      </div>
    </div>
  );
}