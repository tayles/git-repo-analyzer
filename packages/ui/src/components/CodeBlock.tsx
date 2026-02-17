import { Check, Copy } from 'lucide-react';

import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard';
import { cn } from '../lib/utils';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group';

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copy, isCopied] = useCopyToClipboard();

  return (
    <InputGroup className={cn('min-w-[260px]', className)}>
      <InputGroupInput placeholder={code} readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs" onClick={() => copy(code)}>
          {isCopied ? <Check /> : <Copy />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
