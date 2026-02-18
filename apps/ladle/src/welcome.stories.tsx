import { Button, Card, CardContent, CardHeader, CardTitle } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Welcome',
};

export const Introduction: Story = () => (
  <div className="max-w-2xl space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Git Repo Analyzer</h1>
      <p className="text-muted-foreground mt-2">
        Welcome to the component library for Git Repo Analyzer. This Ladle instance showcases all
        the shared UI components used across the web application and Chrome extension.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Browse the components in the sidebar to see all available UI elements. Each component has
          multiple stories showing different variants and states.
        </p>
        <div className="flex gap-2">
          <Button>Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Action</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Project Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>
            <code>packages/ui</code> - Shared React components
          </li>
          <li>
            <code>packages/core</code> - Core analysis library
          </li>
          <li>
            <code>packages/store</code> - Zustand state management
          </li>
          <li>
            <code>apps/web</code> - Web application
          </li>
          <li>
            <code>apps/extension</code> - Chrome extension
          </li>
          <li>
            <code>apps/cli</code> - CLI tool
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export const ThemeShowcase: Story = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Theme Colors</h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="space-y-2">
        <div className="bg-primary h-16 rounded-lg" />
        <p className="text-xs">Primary</p>
      </div>
      <div className="space-y-2">
        <div className="bg-secondary h-16 rounded-lg" />
        <p className="text-xs">Secondary</p>
      </div>
      <div className="space-y-2">
        <div className="bg-accent h-16 rounded-lg" />
        <p className="text-xs">Accent</p>
      </div>
      <div className="space-y-2">
        <div className="bg-destructive h-16 rounded-lg" />
        <p className="text-xs">Destructive</p>
      </div>
      <div className="space-y-2">
        <div className="bg-muted h-16 rounded-lg" />
        <p className="text-xs">Muted</p>
      </div>
      <div className="space-y-2">
        <div className="bg-card h-16 rounded-lg border" />
        <p className="text-xs">Card</p>
      </div>
      <div className="space-y-2">
        <div className="bg-popover h-16 rounded-lg border" />
        <p className="text-xs">Popover</p>
      </div>
      <div className="space-y-2">
        <div className="bg-background ring-border h-16 rounded-lg ring-1" />
        <p className="text-xs">Background</p>
      </div>
    </div>
  </div>
);
