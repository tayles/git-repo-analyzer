import { InputForm } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import { useState } from 'react';

export default {
  title: 'Components',
};

export const InputForms: Story = () => {
  const [token, setToken] = useState('');
  const [isTokenSectionOpen, setIsTokenSectionOpen] = useState(false);

  return (
    <InputForm
      repo={null}
      token={token}
      isTokenSectionOpen={isTokenSectionOpen}
      onAnalyze={() => {}}
      onTokenChange={setToken}
      onTokenSectionOpenChange={setIsTokenSectionOpen}
    />
  );
};

export const InputFormWithTokenExpanded: Story = () => {
  const [token, setToken] = useState('');
  const [isTokenSectionOpen, setIsTokenSectionOpen] = useState(true);

  return (
    <InputForm
      repo="facebook/react"
      token={token}
      isTokenSectionOpen={isTokenSectionOpen}
      onAnalyze={() => {}}
      onTokenChange={setToken}
      onTokenSectionOpenChange={setIsTokenSectionOpen}
    />
  );
};
