import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardContent } from "./card";

interface CardTabsProps extends React.ComponentProps<typeof Tabs> {
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function CardTabs({ tabs, className, ...props }: CardTabsProps) {
  return (
    <Card className={className}>
      <Tabs defaultValue={tabs[0].value} {...props}>
        <TabsList variant="card">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} variant="card">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <CardContent>{tab.content}</CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}