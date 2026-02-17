import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { AppLoadingPage } from '@git-repo-analyzer/ui';

import { WebBrowser } from './wrappers/WebBrowser';

export default {
  title: 'App',
  decorators: [
    Component => (
      <WebBrowser>
        <Component />
      </WebBrowser>
    ),
  ],
} satisfies StoryDefault;

const progress = 'Analyzing code structure (1/4)';

export const LoadingPage: Story = () => (
  <AppLoadingPage repo="facebook/react" onCancel={() => {}} progress={progress} />
);
