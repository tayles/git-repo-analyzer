import { formatNumber } from '@git-repo-analyzer/core';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatCardProps {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
  href?: string;
  children?: React.ReactNode;
}

export function StatCard({ label, value, icon, href, children }: StatCardProps) {
  let formattedValue: string | number | null = value;

  if (typeof value === 'number') {
    formattedValue = formatNumber(value);
  }

  const card = (
    <Card
      className={`gap-0 p-2 select-text lg:p-4 ${href ? 'hover:bg-accent transition-colors' : ''}`}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-muted-foreground text-xs font-normal">{label}</CardTitle>
        <CardAction className="text-muted-foreground">{icon}</CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-2 p-0 text-lg font-bold lg:text-xl">
        {formattedValue}
        {children}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {card}
      </a>
    );
  }

  return card;
}
