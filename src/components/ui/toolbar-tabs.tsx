import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

interface ToolbarTabsProps extends React.ComponentProps<typeof Tabs> {
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  size?: "md" | "lg";
}

export function ToolbarTabs({ tabs, size = "md", className, ...props }: ToolbarTabsProps) {
  return (
    <Tabs defaultValue={tabs[0].value} className={className} {...props}>
      <TabsList variant="toolbar">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            variant="toolbar"
            size={size}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}