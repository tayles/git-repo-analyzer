import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../lib/utils';
import { Button } from './ui/button';

export interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const isClickScrolling = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const elements = items
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        if (isClickScrolling.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);
    isClickScrolling.current = true;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    return () => clearTimeout(clickTimeoutRef.current);
  }, []);

  return (
    <nav
      aria-label="Table of contents"
      className="sm:text-md mx-auto flex items-center gap-1 text-xs"
    >
      {items.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => handleClick(item.id)}
          className={cn('transition-all', activeId === item.id ? 'bg-muted text-foreground' : '')}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
