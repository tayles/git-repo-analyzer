import { LANGUAGE_COLORS } from '@git-repo-analyzer/core';
import { LanguageLogo } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const LanguageLogos: Story = () => (
  <div className="flex flex-col gap-4">
    {Object.entries(LANGUAGE_COLORS).map(([language, color]) => (
      <div key={language} className="flex items-center gap-2">
        <LanguageLogo language={language} />
        <span>{language}</span>
        <small style={{ color }}>{color}</small>
      </div>
    ))}
  </div>
);
