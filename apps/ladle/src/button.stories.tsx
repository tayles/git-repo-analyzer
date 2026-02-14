import type { Story } from '@ladle/react';

import { Button } from '@git-repo-analyzer/ui';

export default {
  title: 'Components/Button',
};

export const AllVariants: Story = () => (
  <div className="flex flex-col gap-4">
    <section>
      <h2 className="text-lg font-bold">All Variants</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold">Disabled</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="default" disabled>
          Default
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="destructive" disabled>
          Destructive
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="link" disabled>
          Link
        </Button>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold">Small</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="default" size="sm">
          Default
        </Button>
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="destructive" size="sm">
          Destructive
        </Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
        <Button variant="ghost" size="sm">
          Ghost
        </Button>
        <Button variant="link" size="sm">
          Link
        </Button>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold">Large</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="default" size="lg">
          Default
        </Button>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="destructive" size="lg">
          Destructive
        </Button>
        <Button variant="outline" size="lg">
          Outline
        </Button>
        <Button variant="ghost" size="lg">
          Ghost
        </Button>
        <Button variant="link" size="lg">
          Link
        </Button>
      </div>
    </section>
  </div>
);
