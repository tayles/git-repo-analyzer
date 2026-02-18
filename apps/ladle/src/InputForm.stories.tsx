import { InputForm } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const InputForms: Story = () => <InputForm repo={null} onAnalyze={() => {}} />;
