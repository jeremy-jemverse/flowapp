import { Button } from './button';
import { Mail, Send, Loader2 } from 'lucide-react';

export function ButtonDemo() {
  return (
    <div className="p-4 space-y-8">
      {/* Standard Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Standard Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      {/* Outline Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Outline Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Default</Button>
          <Button variant="primary-outline">Primary</Button>
          <Button variant="success-outline">Success</Button>
          <Button variant="warning-outline">Warning</Button>
          <Button variant="danger-outline">Danger</Button>
        </div>
      </div>

      {/* Ghost Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ghost Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="ghost">Default</Button>
          <Button variant="primary-ghost">Primary</Button>
          <Button variant="success-ghost">Success</Button>
          <Button variant="warning-ghost">Warning</Button>
          <Button variant="danger-ghost">Danger</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="2xl">2X Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button leftIcon={<Mail />}>Left Icon</Button>
          <Button rightIcon={<Send />}>Right Icon</Button>
          <Button leftIcon={<Mail />} rightIcon={<Send />}>Both Icons</Button>
          <Button size="icon"><Mail /></Button>
        </div>
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Loading State</h3>
        <div className="flex flex-wrap gap-4">
          <Button loading>Loading</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="success" loading>Loading</Button>
          <Button variant="warning" loading>Loading</Button>
          <Button variant="danger" loading>Loading</Button>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Disabled State</h3>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="success" disabled>Disabled</Button>
          <Button variant="warning" disabled>Disabled</Button>
          <Button variant="danger" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}