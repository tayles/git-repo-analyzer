import { formatNumber } from '@git-repo-analyzer/core';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatCardProps {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
}
export function StatCard({ label, value, icon }: StatCardProps) {
  let formattedValue: string | number | null = value;
  if (typeof value === 'number') {
    formattedValue = formatNumber(value);
  }


  return (
    <Card className="gap-0 p-2">
      <CardHeader className="p-0">
        <CardTitle className="text-muted-foreground text-xs font-normal">{label}</CardTitle>
        <CardAction className="text-muted-foreground">{icon}</CardAction>
      </CardHeader>
      <CardContent className="p-0 text-xl font-bold">{formattedValue}</CardContent>
    </Card>
  );
}
