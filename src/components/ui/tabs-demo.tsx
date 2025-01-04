import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Card } from './card';
import { CardTabs, CardTabsList, CardTabsTrigger } from './tabs';
import { ToolbarTabs, ToolbarTabsList, ToolbarTabsTrigger } from './tabs';

export function TabsDemo() {
  return (
    <div className="space-y-8">
      {/* Default Tabs */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Default Tabs</h3>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account settings</TabsContent>
          <TabsContent value="password">Password settings</TabsContent>
          <TabsContent value="settings">Other settings</TabsContent>
        </Tabs>
      </div>

      {/* Card Tabs */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Card Tabs</h3>
        <Card>
          <CardTabs defaultValue="overview">
            <CardTabsList>
              <CardTabsTrigger value="overview">Overview</CardTabsTrigger>
              <CardTabsTrigger value="analytics">Analytics</CardTabsTrigger>
              <CardTabsTrigger value="reports">Reports</CardTabsTrigger>
              <CardTabsTrigger value="notifications">Notifications</CardTabsTrigger>
            </CardTabsList>
            <div className="p-4">
              <TabsContent value="overview">Overview content</TabsContent>
              <TabsContent value="analytics">Analytics content</TabsContent>
              <TabsContent value="reports">Reports content</TabsContent>
              <TabsContent value="notifications">Notifications content</TabsContent>
            </div>
          </CardTabs>
        </Card>
      </div>

      {/* Toolbar Tabs */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Toolbar Tabs</h3>
        <ToolbarTabs defaultValue="all">
          <ToolbarTabsList>
            <ToolbarTabsTrigger value="all">All</ToolbarTabsTrigger>
            <ToolbarTabsTrigger value="active">Active</ToolbarTabsTrigger>
            <ToolbarTabsTrigger value="inactive">Inactive</ToolbarTabsTrigger>
            <ToolbarTabsTrigger value="archived">Archived</ToolbarTabsTrigger>
          </ToolbarTabsList>
          <TabsContent value="all">All items</TabsContent>
          <TabsContent value="active">Active items</TabsContent>
          <TabsContent value="inactive">Inactive items</TabsContent>
          <TabsContent value="archived">Archived items</TabsContent>
        </ToolbarTabs>
      </div>
    </div>
  );
}