import type { Story } from '@ladle/react';

import { ToolLogo } from '@git-repo-analyzer/ui';
import { LANGUAGE_COLORS } from '@git-repo-analyzer/core';

export default {
  title: 'Components / Language Logo',
};

export const All: Story = () => (
  <div className="flex flex-col gap-4">
    {Object.entries(LANGUAGE_COLORS).map(([language, color]) => (
      <div key={language} className="flex items-center gap-2">
        <ToolLogo logo={language} />
        <span>{language}</span>
        <small style={{ color }}>{color}</small>
      </div>
    ))}
  </div>
)
